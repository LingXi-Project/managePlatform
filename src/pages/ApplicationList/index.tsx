import { addRule, removeRule, rule } from '@/services/ant-design-pro/api';
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
import { Button, Drawer, Input, message, Form, Typography, Space, Divider } from 'antd';
import React, { useRef, useState } from 'react';
const { Text } = Typography;
// import type { FormValueType } from './components/UpdateForm';
// import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('Configuring');
//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
//     hide();

//     message.success('Configuration is successful');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Configuration failed, please try again!');
//     return false;
//   }
// };

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  let [form] = Form.useForm<API.ApplicationForm |  {sex: string}>();
  const columns: ProColumns<API.ApplicationForm>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.applicationTable.ruleName.nameLabel"
          defaultMessage="user name"
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
        console.log('dom', info);
        form.setFieldsValue({...info, sex: !!info.sex ? '女' : '男'});
        return (
          <>
            <ModalForm<API.ApplicationForm | {sex: string}>
              title="申请表详情"
              form={form}
              trigger={<a>查看申请</a>}
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
              }}
              submitTimeout={2000}
              onFinish={async () => {
                return true;
              }}
            >
              <Divider />
              <Space direction="vertical" size="middle">
                <Text strong>
                  个人信息
                </Text>
                <ProForm.Group>
                  <ProFormText width="sm" name="username" label="姓名" disabled />

                  <ProFormText width="sm" name="mobile" label="电话号码" disabled />
                  <ProFormText width="sm" name="address" label="地址" disabled />
                  <ProFormText width="sm" name="sex" label="性别" disabled />
                  <ProFormText width="sm" name="policialOutlook" label="政治面貌" disabled />
                </ProForm.Group>
              </Space>
              <ProForm.Group>
                <ProFormText width="md" name="contract" label="合同名称" placeholder="请输入名称" />
                <ProFormDateRangePicker name="contractTime" label="合同生效时间" />
              </ProForm.Group>
              <ProFormText width="sm" name="id" label="主合同编号" />
              <ProFormText name="project" disabled label="项目名称" initialValue="xxxx项目" />
              <ProFormText
                width="xs"
                name="mangerName"
                disabled
                label="商务经理"
                initialValue="启途"
              />
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
          text: (
            <FormattedMessage id="pages.applicationTable.status.pending" defaultMessage="待审批" />
          ),
          status: 'default',
        },
        1: {
          text: (
            <FormattedMessage
              id="pages.applicationTable.status.areapass"
              defaultMessage="区域负责人审批通过"
            />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage
              id="pages.applicationTable.status.adminpass"
              defaultMessage="组委会审批通过"
            />
          ),
          status: 'Processing',
        },
        3: {
          text: (
            <FormattedMessage id="pages.applicationTable.status.fail" defaultMessage="未通过" />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: (
        <FormattedMessage id="pages.applicationTable.date" defaultMessage="Last scheduled time" />
      ),
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
              }}
            >
              通过{' '}
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
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          const { current, pageSize, ...filters } = params;
          const res = await rule({ current, pageSize }).then((res) => res.data.list);
          const filteredList = res.filter((item) => {
            return Object.keys(filters).every((name) => {
              //@ts-ignore
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
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
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
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>

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
