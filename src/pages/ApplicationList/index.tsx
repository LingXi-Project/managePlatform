import { addRule, getqiniutoken, removeRule, rule } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProForm,
  ProFormTextArea,
  ProTable,
  ProFormDateRangePicker,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Input, message, Form, Typography, Space, Divider, Image } from 'antd';
import axios from 'axios';
import React, { useRef, useState } from 'react';
const { Text } = Typography;

// 从临时 URL 下载文件
const downloadFile = async (tempUrl: string): Promise<Blob> => {
  try {
    const response = await axios.get(tempUrl, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error('下载文件失败:', error);
    throw error;
  }
};

// 上传文件到七牛云并获取正式 URL
const getPermanentUrl = async (tempUrl: string, videoname: string) => {
  try {
    const qiniutoken = await getqiniutoken();
    const fileBlob = await downloadFile(tempUrl); // 下载文件

    const timestamp = new Date().getTime();
    const key = `${timestamp}_${videoname}`;

    const formData = new FormData();
    formData.append('file', fileBlob, videoname); // 将 Blob 作为文件上传
    formData.append('token', qiniutoken.data.token);
    formData.append('key', key);

    const response = await axios.post('https://upload-cn-east-2.qiniup.com', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('上传响应:', response.data);
    // 从响应中提取正式 URL
    const { key: fileKey } = response.data;
    const permanentUrl = `https://img-bed.shudong814.com/${fileKey}`; // 根据实际情况调整 URL

    return permanentUrl;
  } catch (error) {
    console.error('获取永久 URL 失败:', error);
    return ''; // 如果请求失败，返回空字符串
  }
};

// 上传临时 URL 到七牛云并获取正式 URL
const changeUrl = async (info: any) => {
  console.log('info identity', info.identity);

  const { identity } = info;

  // 获取身份证明的永久 URL
  const backIdCardPermanentUrl = await getPermanentUrl(identity.backIdCard, 'backIdCard.png');
  const frontIdCardPermanentUrl = await getPermanentUrl(identity.frontIdCard, 'frontIdCard.png');
  
  // 获取文件列表的永久 URL
  const filePromises = identity.files.map((file: string) => getPermanentUrl(file, file.split('/').pop() || 'unknown'));
  const filePermanentUrls = await Promise.all(filePromises);

  // 更新 info 对象中的 URL
  const updatedInfo = {
    ...info,
    identity: {
      ...identity,
      backIdCard: backIdCardPermanentUrl,
      frontIdCard: frontIdCardPermanentUrl,
      files: filePermanentUrls,
    },
  };

  return updatedInfo;
};

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.ApplicationForm>();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const intl = useIntl();
  const [form] = Form.useForm<API.ApplicationForm>();

  const columns: ProColumns<API.ApplicationForm>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.applicationTable.ruleName.nameLabel"
          defaultMessage="User Name"
        />
      ),
      dataIndex: 'username',
      tip: '主键',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.applicationTable.formInfo" defaultMessage="Info" />,
      dataIndex: 'user_id',
      tip: '申请表详情',
      render: (_, info) => {
        console.log('info', info);
        
        return (
          <>
            <ModalForm<API.ApplicationForm>
              title="申请表详情"
              form={form}
              initialValues={info}
              trigger={<a>查看申请</a>}
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('Modal closed'),
              }}
              onOpenChange={async (open) => {
                if (open) {
                  const updatedInfo = await changeUrl(info);
                  form.setFieldsValue({ ...updatedInfo, sex: !!updatedInfo.sex ? '女' : '男' });
                }
              }}
              submitTimeout={2000}
              onFinish={async () => {
                return true;
              }}
            >
              <Divider />
              <Space direction="vertical" size="middle">
                <Text strong>个人信息</Text>
                <ProForm.Group>
                  <ProFormText width="sm" name="username" label="姓名" disabled />
                  <ProFormText width="sm" name="mobile" label="电话号码" disabled />
                  <ProFormText width="sm" name="address" label="地址" disabled />
                  <ProFormText width="sm" name="sex" label="性别" disabled />
                  <ProFormText width="sm" name="identificationNumber" label="证件号" disabled />
                  <ProFormText width="sm" name="native" label="籍贯" disabled />
                  <ProFormText width="sm" name="email" label="邮箱" disabled />
                  <ProFormText width="sm" name="degree" label="学历" disabled />
                  <ProFormText width="sm" name="speciality" label="专业" disabled />
                  <ProFormText width="sm" name="policialOutlook" label="政治面貌" disabled />
                  <ProFormText width="sm" name="work" label="所在部门及职务、职称" disabled />
                  <ProFormText width="sm" name="outWork" label="其他社会职务" disabled />
                  <ProFormText width="sm" name={['medicalHistory', 'outpatientHistory']} label="精神科及心理门诊历史" disabled />
                  <ProFormText width="sm" name={['medicalHistory', 'medicineHistory']} label="药物历史" disabled />
                  <ProFormText width="sm" name={['medicalHistory', 'medicine']} label="现用药物" disabled />
                </ProForm.Group>
              </Space>
              <ProForm.Group title="身份证明">
                <Image width={200} src={info.identity.frontIdCard} alt="身份证正面" />
                <Image width={200} src={info.identity.backIdCard} alt="身份证反面" />
                {info.identity.files.map((file: string, index: number) => (
                  <Image key={index} width={200} src={file} alt={`其他证明 ${index}`} />
                ))}
              </ProForm.Group>
              <ProForm.Group title="简历">
                {info.resumes.map((resume, index) => (
                  <React.Fragment key={index}>
                    <ProFormText initialValue={resume.time} name={`resume_${index}_time`} label="时间" width="sm" disabled />
                    <ProFormText initialValue={resume.place} name={`resume_${index}_place`} label="地点" width="sm" disabled />
                    <ProFormText initialValue={resume.duty} name={`resume_${index}_duty`} label="职务" width="sm" disabled />
                  </React.Fragment>
                ))}
              </ProForm.Group>
            </ModalForm>
          </>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.applicationTable.status" defaultMessage="Status" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: <FormattedMessage id="pages.applicationTable.status.pending" defaultMessage="待审批" />,
          status: 'default',
        },
        1: {
          text: <FormattedMessage id="pages.applicationTable.status.areapass" defaultMessage="区域负责人审批通过" />,
          status: 'Processing',
        },
        2: {
          text: <FormattedMessage id="pages.applicationTable.status.adminpass" defaultMessage="组委会审批通过" />,
          status: 'Processing',
        },
        3: {
          text: <FormattedMessage id="pages.applicationTable.status.fail" defaultMessage="未通过" />,
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.applicationTable.date" defaultMessage="Last scheduled time" />,
      sorter: true,
      dataIndex: 'update_time',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const status = Number(record?.status);
        if (status !== 3)
          return [
            <a
              key="config"
              onClick={() => {
                setCurrentRow(record);
                setShowDetail(true);
              }}
            >
              通过
            </a>,
            <a key="subscribeAlert" onClick={() => {}}>
              不通过
            </a>,
          ];
        return null;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ApplicationForm, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="username"
        search={{ labelWidth: 120 }}
        request={async (params) => {
          const { current, pageSize, ...filters } = params;
          const res = await rule({ current, pageSize }).then((res) => res.data.list);
          const filteredList = res.filter((item) => {
            return Object.keys(filters).every((name) => {
              return String(item[name]) === String(filters[name]);
            });
          });
          return {
            data: filteredList,
            success: true,
            total: res.length,
          };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      {/* <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        ></ProFormText>
        <ProFormTextArea width="md" name="desc" />
      </ModalForm> */}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
