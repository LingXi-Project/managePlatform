import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: '华中师范大学',
          title: '华中师范大学',
          href: 'https://www.ccnu.edu.cn/',
          blankTarget: true,
        },
        {
          key: '华中师范大学木犀互联网技术团队',
          title: <GithubOutlined />,
          href: 'https://github.com/Muxi-X',
          blankTarget: true,
        },
        {
          key: 'muxi',
          title: '木犀团队',
          href: 'https://github.com/Muxi-X',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
