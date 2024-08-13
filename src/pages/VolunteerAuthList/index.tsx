import { addRule, removeRule, userinfo, updateRole, updateManage } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProForm,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Form, message, Space, Divider, Select, Typography } from 'antd';
import React, { useRef, useState } from 'react';
const { Text } = Typography;

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.UserListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserListItem[]>([]);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [form] = Form.useForm<API.User | { sex: string }>();

  const handleAdd = async (fields: API.RuleListItem) => {
    const hide = message.loading('正在添加');
    try {
      await addRule({ ...fields });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败，请重试！');
      return false;
    }
  };

  const handleRemove = async (selectedRows: API.RuleListItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await removeRule({
        key: selectedRows.map((row) => row.key),
      });
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: <FormattedMessage id="pages.authorzationTable.ruleName.nameLabel" defaultMessage="user name" />,
      dataIndex: 'username',
      tip: '主键',
      render: (dom, entity) => (
        <a
          onClick={() => {
            setCurrentRow(entity);
            setShowDetail(true);
          }}
        >
          {dom}
        </a>
      ),
    },
    {
      title: <FormattedMessage id="pages.authorzationTable.userInfo" defaultMessage="Info" />,
      dataIndex: 'user_id',
      tip: '用户信息',
      render: (_, info) => {
        console.log('dom info',info);
        
        return (
          <>
            <ModalForm<API.User>
              title="主要信息"
              form={form}
              initialValues={info}
              trigger={<a>查看详情</a>}
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('Modal closed'),
              }}
              onOpenChange={(open) => {
                if (open) {
                  form.setFieldsValue({...info, sex: !!info.sex ? '女' : '男'});
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
                  <ProFormText width="sm" name="birthday" label="出生日期" disabled />
                  <ProFormText width="sm" name="email" label="邮箱" disabled />
                </ProForm.Group>
              </Space>
            </ModalForm>
          </>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.authorzationTable.role" defaultMessage="Role" />,
      dataIndex: 'role',
      hideInForm: true,
      valueEnum: {
        '-1': { text: '待处理人员', status: 'default' },
        '0': { text: '非在册队员', status: 'default' },
        '1': { text: '申请队员', status: 'Processing' },
        '2': { text: '岗前培训', status: 'Processing' },
        '3': { text: '见习队员', status: 'Processing' },
        '4': { text: '正式队员', status: 'Success' },
        '5': { text: '督导老师', status: 'Success' },
        '6': { text: '树洞之友', status: 'Success' },
        '40': { text: '普通队员', status: 'Success' },
        '41': { text: '核心队员', status: 'Success' },
        '42': { text: '区域负责人', status: 'Processing' },
        '43': { text: '组委会成员', status: 'Processing' },
        '44': { text: '组委会主任', status: 'Processing' },
      },
    },
    {
      title: <FormattedMessage id="pages.authorzationTable.changeRole" defaultMessage="Change Role" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const roleOptions = [
          { label: '待处理人员', value: '-1' },
          { label: '非在册队员', value: '0' },
          { label: '申请队员', value: '1' },
          { label: '岗前培训', value: '2' },
          { label: '见习队员', value: '3' },
          { label: '正式队员', value: '4' },
          { label: '督导老师', value: '5' },
          { label: '树洞之友', value: '6' },
          { label: '普通队员', value: '40' },
          { label: '核心队员', value: '41' },
          { label: '区域负责人', value: '42' },
          { label: '组委会成员', value: '43' },
          { label: '组委会主任', value: '44' },
        ];

        const managerRole = localStorage.getItem('manageInfo');
        console.log('manage',managerRole);
        

        if (managerRole) {
            const parsedRole = JSON.parse(managerRole);
            console.log('', parsedRole);
        
            if (parsedRole[0].status) {
              roleOptions.push({ label: '视频管理员', value: '45' });
            }
        }

        const defaultRole = roleOptions.find(option => option.value === String(record.highest_role))?.value || '-1';

        return [
          <Select
            key="select-role"
            defaultValue={defaultRole}
            style={{ width: 160 }}
            onChange={(value) => {
              record.highest_role = Number(value);
              setCurrentRow({ ...record });
            }}
            options={roleOptions}
          />,
          <Button
            key="submit-role-change"
            type="link"
            onClick={async () => {
              console.log('record',record);
              if(record.highest_role < 45){
                const success = await updateRole({
                  user_id: record.id,
                  new_role: record.highest_role,
                  new_rigion: []
                });
                if (success) {
                  console.log('success');
                  message.success('角色变更成功');
                  actionRef.current?.reload();
                } else {
                  console.log('error');
                  message.error('角色变更失败，请重试');
                }
              }else{
                const success = await updateManage({
                  user_id: record.id,
                });
              }

            }}
          >
            提交变更
          </Button>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserListItem, API.PageParams>
        headerTitle={intl.formatMessage({ id: 'pages.searchTable.title', defaultMessage: 'Enquiry form' })}
        actionRef={actionRef}
        rowKey="username"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          const { current, pageSize, ...filters } = params;
          const res = await userinfo({ current, pageSize }).then((res) => res.data.list);
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
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
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
                <FormattedMessage id="pages.searchTable.totalServiceCalls" defaultMessage="Total number of service calls" />{' '}
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
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="Batch Deletion" />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({ id: 'pages.searchTable.createForm.newRule', defaultMessage: 'New rule' })}
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
              message: <FormattedMessage id="pages.searchTable.ruleName" defaultMessage="Rule name is required" />,
            },
          ]}
          placeholder="请输入角色名"
        />
      </ModalForm>
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.UserListItem>
            column={2}
            title={currentRow?.username}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.UserListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
