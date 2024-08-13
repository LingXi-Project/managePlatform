import React, { useRef, useState } from 'react';
import { addfolder, getfolder, getvideo, addvideo, getqiniutoken, changefolder, changevideo, removeFile, removefolder } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import axios from 'axios';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { AxiosResponse, FormattedMessage, useIntl } from '@umijs/max';
import { Button, Select, Upload, Form, Input, Modal, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [folderNameToAdd, setFolderNameToAdd] = useState<string>(''); 
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState<boolean>(false);
  const [playVideoUrl, setPlayVideoUrl] = useState<string | null>(null); // 播放视频的 URL
  const [currentRow, setCurrentRow] = useState<API.FolderListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.FolderListItem[]>([]);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const [isfileModalOpen, setIsfileModalOpen] = useState<boolean>(false);
  const [folderNameToEdit, setFolderNameToEdit] = useState<string>('');
  const [fileNameToEdit, setfileNameToEdit] = useState<string>('');
  const [fileList, setFileList] = useState<File[]>([]);
  const [videoname, setVideoname] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<API.VideoItem>();
  const [uploading, setUploading] = useState<boolean>(false); // 控制上传状态
  const [uploadProgress, setUploadProgress] = useState<number>(0); // 记录上传进度
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  // const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string>('');

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


  const handleAddFolder = async () => {
    try {
      const res = await addfolder({
        folder_name: folderNameToAdd,
        // role: selectedRoles.join(','),
        role: Number(selectedRoles)
      });
      if (res?.code === 200) {
        message.success('文件夹添加成功');
        actionRef.current?.reloadAndRest?.(); // 刷新表格数据
      } else {
        message.error('文件夹添加失败');
      }
    } catch (error) {
      console.error('添加文件夹失败', error);
      message.error('文件夹添加失败，请重试');
    } finally {
      setFolderNameToAdd(''); // 重置输入框
      setSelectedRoles(''); // 重置选中的角色
      handleModalOpen(false); // 关闭模态框
    }
  };

  const uploadVideo = async () => {
    if (fileList.length === 0) {
      message.error('请选择一个视频文件');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const qiniutoken = await getqiniutoken();
      const file = fileList[0];
      const timestamp = new Date().getTime();
      const key = `${timestamp}_${videoname}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', qiniutoken.data.token);
      formData.append('key', key);

      const response = await axios.post('https://upload-cn-east-2.qiniup.com', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      console.log('res',response);
      

      const data = response.data;
      console.log('file',file);
      

      const res = await addvideo({
        file: file,
        fileName: videoname,
        folderId: String(currentRow?.id),
      });
      console.log('ress',res);
      

      message.success('上传成功!');
      getVideo();
      setShowAddVideoModal(false);
      setFileList([]);
      setVideoname('');
      setUploadProgress(0);
    } catch (error) {
      console.error('上传失败:', error.response?.data || error.message);
      message.error('上传失败，请重试！');
    } finally {
      setUploading(false);
    }
  };
  

  const handleRename = async () => {
    if (!currentRow) {
      message.error('文件夹信息丢失');
      return;
    }
  
    const hide = message.loading('正在重命名...');
  
    try {
      const folder_id = currentRow.id; // 从当前行中获取文件夹 ID
      const folder_name = folderNameToEdit; // 从输入框中获取新的文件夹名称
      const role = currentRow.role; // 假设角色不变，您可以根据需要修改
      
  
      const res = await changefolder({ folder_id, folder_name, role });
      console.log('res',res);
      
  
      if (res?.data) {
        message.success('重命名成功');
        actionRef.current?.reloadAndRest?.(); // 刷新表格数据
      }
    } catch (error) {
      console.error('重命名失败', error);
      message.error('重命名失败，请重试');
    } finally {
      hide(); // 确保在任何情况下隐藏 loading 状态
      setIsRenameModalOpen(false); // 关闭模态框
    }
  };

  const handleFileRename = async () => {
    if (!currentFile) {
      message.error('文件丢失');
      return;
    }

    const hide = message.loading('正在重命名...');

    try {
      const video_id = currentFile.id; // 从当前行中获取文件 ID
      const file_name = fileNameToEdit; // 从输入框中获取新的文件夹名称
      const folder_id = currentRow?.id;

      const res = await changevideo({ folder_id, file_name, video_id });
      console.log('res', res);

      if (res?.data) {
        message.success('重命名成功');
        actionRef.current?.reloadAndRest?.(); // 刷新表格数据
      }
    } catch (error) {
      console.error('重命名失败', error);
      message.error('重命名失败，请重试');
    } finally {
      hide(); // 确保在任何情况下隐藏 loading 状态
      setIsfileModalOpen(false); // 关闭模态框
    }
  };

  const getVideo = async () => {
    if (!currentRow) {
      message.error('当前文件夹信息丢失');
      return;
    }

    console.log('current', currentRow);
    
  
    const params = {
      folder_id: currentRow.id,
      page: 1,
      page_size: 10,
    };
  
    try {
      const response = await getvideo(params);
      console.log('video', response.data.list);
      // 处理获取的视频列表
    } catch (error) {
      console.error('获取视频失败', error);
      message.error('获取视频失败，请重试！');
    }
  };


  const columns: ProColumns<API.FolderListItem>[] = [
    {
      title: intl.formatMessage({ id: 'pages.videoTable.ruleName.nameLabel', defaultMessage: 'foldername' }),
      dataIndex: 'folder_name',
      tip: '主键',
      render: (dom, entity) => (
        <div>
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
          <Button
            type="link"
            onClick={() => {
              setCurrentRow(entity)
              setFolderNameToEdit(entity.foldername);
              setIsRenameModalOpen(true);
            }}
            style={{ marginLeft: 8 }}
          >
            修改
          </Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.videoTable.videoList', defaultMessage: 'videolist' }),
      dataIndex: 'videolist',
      tip: '视频列表',
      render: (_, info) => (
        <ModalForm
          title="查看视频"
          initialValues={info}
          trigger={
            <a
              onClick={() => {
                console.log('info',info);
                
                setCurrentRow(info); // 设置当前行信息，指向当前文件夹
              }}
            >
              查看视频
            </a>
          }
          modalProps={{
            destroyOnClose: true,
            onCancel: () => console.log('Modal closed'),
          }}
          onOpenChange={(open) => {
            if (open && currentRow) {
              getVideo(); // 获取视频列表
            }
          }}
          submitTimeout={2000}
          onFinish={async () => {
            return true;
          }}
        >
          <ProTable<API.VideoItem>
            rowKey="id" // 使用视频的唯一标识作为 rowKey
            columns={[
              { title: '视频名称', dataIndex: 'file_name' },
              {
                title: '操作',
                dataIndex: 'operation',
                render: (_, record) => (
                  <>
                    <Button
                    type="link"
                    onClick={() => {
                      console.log('record',record);
                    setPlayVideoUrl(record.url); // 假设 videoUrl 是视频的播放地址
                    }}
                    >
                    播放
                    </Button>

                    <Button
                      type="link"
                      onClick={() => {
                          setCurrentFile(record)
                          setfileNameToEdit(record.file_name);
                          setIsfileModalOpen(true);
                        console.log('修改视频名称：', record.file_name);
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      修改
                    </Button>
                    <Button
                    type='link'
                    onClick={async () => {
                        if (record.id) {
                        try {
                         const res = await removeFile({ id: record.id }); // 假设 removefolder 函数接受一个对象参数
                         console.log('res',res);
                         if(res.code === 200){
                          message.success(res.data);
                          if (actionRef.current?.reloadAndRest) {
                            await actionRef.current.reloadAndRest();
                          }
                         }else{
                          message.error(res.msg);
                         }
                        // 刷新数据或执行其他操作
                        } catch (error) {
                          console.log('error',error);
                        message.error('删除失败，请重试！');
                        }
                        } else {
                          message.error('文件 ID 不存在');
                        }
                        }}
                      >
                      删除
                    </Button>
                  </>
                ),
              }
            ]}
            request={async () => {
              if (!currentRow) return { data: [], success: false };
              // 从当前文件夹中获取视频列表
              return getvideo({
                folder_id: parseInt(currentRow.id, 10),
                page: 1,
                page_size: 10,
              }).then(res => ({
                data: res.data.list,
                success: true,
              })).catch(() => ({ data: [], success: false }));
            }}
          />
        </ModalForm>
      ),
    },    
    {
      title: intl.formatMessage({ id: 'pages.videoTable.visible', defaultMessage: 'Visible Roles' }),
      dataIndex: 'role',
      valueType: 'option',
      render: (_, record) => {
        // 定义角色选项
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
  
        // 将 record.role 作为默认选中值
        const defaultRoles = record.role ? String(record.role).split(',') : [];
  
        return (
          <Select
            // mode="multiple"
            defaultValue={defaultRoles}
            style={{ width: 300 }}
            onChange={async (value) => {
              console.log('val',value);
              
              // record.role = value.join(','); // 更新记录的 role  多选
              setCurrentRow({ ...record }); // 更新当前行
              const res = await changefolder({folder_id: record.id, folder_name: record.folder_name, role: Number(value)})
              if(!res.msg){
                message.success(res.data)
              }
            }}
            options={roleOptions}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.searchTable.titleOption', defaultMessage: '操作' }),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              setShowAddVideoModal(true)
              setCurrentRow(record)
            }}
          >
            添加视频
          </Button>
          <Button
            onClick={async () => {
              if (record.id) {
                try {
                 const res = await removefolder({ id: record.id }); // 假设 removefolder 函数接受一个对象参数
                 console.log('res',res);
                 if(res.code === 200){
                  message.success(res.data);
                 }else{
                  message.error(res.msg);
                 }
                  // 刷新数据或执行其他操作
                } catch (error) {
                  console.log('error',error);
                  message.error('删除失败，请重试！');
                }
              } else {
                message.error('文件夹 ID 不存在');
              }
            }}
          >
            删除
          </Button>
        </>
      ),
    }
  ]

  return (
    <PageContainer>
      <ProTable<API.FolderListItem, API.PageParams>
        headerTitle={intl.formatMessage({ id: 'pages.searchTable.title', defaultMessage: 'Enquiry form' })}
        actionRef={actionRef}
        rowKey="foldername"
        search={{ labelWidth: 120 }}
        request={async (params) => {
          const { current, pageSize, ...filters } = params;
          try {
            const response = await getfolder({ current, pageSize });
            const res = response.data.folder;
            console.log('dom',res);

            if (!Array.isArray(res)) {
              throw new Error('Expected an array, but got a non-array value');
            }

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
          } catch (error) {
            console.error('Failed to fetch folders:', error);
            return { data: [], success: false, total: 0 };
          }
        }}

        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <Button
        type="primary"
        onClick={() => handleModalOpen(true)}
      >
        添加文件夹
      </Button>
      <Modal
  title="添加文件夹"
  open={createModalOpen}
  onCancel={() => handleModalOpen(false)}
  onOk={handleAddFolder}
>
  <Form.Item label="文件夹名称" required>
    <Input
      value={folderNameToAdd}
      onChange={(e) => setFolderNameToAdd(e.target.value)}
      placeholder="请输入文件夹名称"
    />
  </Form.Item>
  <Form.Item label="设置可见人员">
    <Select
      // mode="multiple"   多选
      value={selectedRoles}
      onChange={(value) => setSelectedRoles(value)}
      options={roleOptions}
      placeholder="请选择可见人员"
    />
  </Form.Item>
</Modal>

      <Modal
        title="上传视频"
        open={showAddVideoModal}
        onCancel={() => setShowAddVideoModal(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item
            label="选择视频文件"
            valuePropName="fileList"
          >
            <Upload
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList.map(file => file.originFileObj as File))}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="视频名称"
            name="videoname"
            rules={[{ required: true, message: '请输入视频名称' }]}
          >
            <Input value={videoname} onChange={(e) => setVideoname(e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={uploadVideo}
              loading={uploading}
              disabled={uploading}
            >
              {uploading ? '上传中' : '开始上传'}
            </Button>
            {uploading && (
              <Progress percent={uploadProgress} />
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="修改文件名称"
        open={isfileModalOpen}
        onOk={handleFileRename}
        onCancel={() => setIsfileModalOpen(false)}
      >
        <Input value={fileNameToEdit} onChange={(e) => setfileNameToEdit(e.target.value)} />
      </Modal>
      <Modal
        title="修改文件夹名称"
        open={isRenameModalOpen}
        onOk={handleRename}
        onCancel={() => setIsRenameModalOpen(false)}
      >
        <Input value={folderNameToEdit} onChange={(e) => setFolderNameToEdit(e.target.value)} />
      </Modal>
      <Modal
        title="播放视频"
        open={!!playVideoUrl}
        onCancel={() => setPlayVideoUrl(null)}
        footer={null}
      >
        {playVideoUrl && (
        <video controls style={{ width: '100%' }}>
          <source src={playVideoUrl} type="video/mp4" />
          您的浏览器不支持播放该视频。
        </video>
       )}
      </Modal>

    </PageContainer>
  );
};

export default TableList;
