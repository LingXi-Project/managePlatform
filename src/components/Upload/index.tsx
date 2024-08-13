import React, { useState } from 'react';
import { Button, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const UploadVideo: React.FC = () => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [videoname, setVideoname] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // 获取七牛云的 Token
  const getQiniuToken = async () => {
    try {
      const response = await axios.get('/api/qiniu/token');
      return response.data.token;
    } catch (error) {
      message.error('获取上传 Token 失败，请重试！');
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!fileList.length || !videoname) {
      message.error('请选择一个视频文件和输入视频名称');
      return;
    }

    const file = fileList[0];
    const timestamp = new Date().getTime();
    const key = `${timestamp}_${videoname}`;

    try {
      setUploading(true);
      setUploadProgress(0);

      const token = await getQiniuToken();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token);
      formData.append('key', key);

      const response = await axios.post('https://upload-cn-east-2.qiniup.com', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        },
      });

      const videoUrl = `https://img-bed.shudong814.com/${response.data.key}`;

      // 将视频 URL 和其它信息保存到服务器
      await axios.post('/api/videos', {
        fileName: videoname,
        url: videoUrl,
      });

      message.success('上传成功！');
      setFileList([]);
      setVideoname('');
      setUploadProgress(0);
    } catch (error) {
      message.error('上传失败，请重试！');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Input
        placeholder="请输入视频名称"
        value={videoname}
        onChange={(e) => setVideoname(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Upload
        beforeUpload={(file) => {
          setFileList([file]);
          return false;
        }}
        fileList={fileList}
      >
        <Button icon={<UploadOutlined />}>选择视频</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        上传
      </Button>
      <div>上传进度：{uploadProgress}%</div>
    </div>
  );
};

export default UploadVideo;
