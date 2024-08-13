// @ts-ignore
/* eslint-disable */
import { history, request, RequestConfig } from '@umijs/max';

const customRequestConfigs: RequestConfig = {
  responseInterceptors: [(res) => {
    const data = res.data as API.resType;
    if(data.code > 400 && data.code < 500) {
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/user/login');
    }
    return res
  }],
  requestInterceptors: [(url, options) => {
    options.headers = {...options.headers, ...generateAuthHeader()}
    return {url, options}
  }]
}
export const realRequst= <T,>(url: string, opts: any) => {
  return request<T>(url, {...opts, ...customRequestConfigs})
}

const generateAuthHeader = () => ({
  'Authorization': localStorage.getItem('token') ?? ''
})
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return realRequst<{
    user_info: API.CurrentUser
  }>('/server/user/info', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  // 清除所有相关的本地存储信息
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('manageInfo');
  localStorage.removeItem('userInfo');
  
  // 如果你有其他需要清除的本地存储项，可以在这里添加
  
  return Promise.resolve();
}


/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return realRequst<API.LoginResult>('/server/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return realRequst<{list: API.ApplicationForm[]}>('/server/application/forms', {
    method: 'POST',
    data: {
      page_size: params.pageSize,
      page: params.current
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/server/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}

//删除文件夹
export async function removefolder(params: { id: number }, options?: { [key: string]: any }) {
  // 获取 token
  const token = localStorage.getItem('token');
  
  return request<Record<string, any>>('/server/file/deletefolder', {
    method: 'POST',
    data: {
      folder_id: params.id,
      ...(options || {}),
    },
    headers: {
      'Authorization': `Bearer ${token}`,  // 将 token 添加到请求头
    }
  });
}

//删除文件
export async function removeFile(params: { id: number }, options?: { [key: string]: any }) {
  // 获取 token
  const token = localStorage.getItem('token');
  
  return request<Record<string, any>>('/server/file/deletefile', {
    method: 'POST',
    data: {
      file_id: params.id,
      ...(options || {}),
    },
    headers: {
      'Authorization': `Bearer ${token}`,  // 将 token 添加到请求头
    }
  });
}

//获取所有用户信息
export async function userinfo(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return realRequst<{list: API.UserList[]}>('/server/user/all', {
    method: 'POST',
    data: {
      page_size: params.pageSize,
      page: params.current
    },
    ...(options || {}),
  });}

  //获取管理员权限
  export async function getManager(options?: { [key: string]: any }) {
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('Authorization token not found in localStorage');
    }
  
    try {
      const response = await realRequst<API.checkManagerRole>('/server/role/checkManagerRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        ...(options || {}),
      });
  
      // 假设response.data包含你需要设置到本地的status数据
      const statusData = response.data; // 具体字段视接口返回的数据结构而定
  
      // 将数据存储到本地状态中
      localStorage.setItem('managerRole', JSON.stringify(statusData));

      return statusData;
    } catch (error) {
      console.error('Failed to fetch manager:', error);
      throw error;
    }
  }
  

  //更新最高权限
  export async function updateRole(
    params: {
      user_id: number,
      new_role: number,
      new_rigion: string[]
    },
    options?: { [key: string]: any },
  ) {
    return realRequst<{list: API.UserList[]}>('/server/role/change', {
      method: 'POST',
      data: {
        user_id: params.user_id,
        new_role: params.new_role,
        new_rigion: []
      },
      ...(options || {}),
    });
}


//获取视频文件夹
export async function getfolder(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return realRequst<{
    folder: any;list: API.FolderList[]
}>('/server/file/getfolder', {
    method: 'POST',
    data: {
      page_size: params.pageSize,
      page: params.current
    },
    ...(options || {}),
  });}

  //添加文件夹
  export async function addfolder(
    params: {
      folder_name:string,
      role:number
    },
    options?: { [key: string]: any },
  ) {
    return realRequst<{list: API.AddFolder}>('/server/file/addfolder', {
      method: 'POST',
      data: {
        folder_name:params.folder_name,
        role: params.role
      },
      ...(options || {}),
    });}


//获取视频列表
  export async function getvideo(
    params: {
      folder_id: number,
      page: number,
      page_size: number
    },
    options?: { [key: string]: any },
  ) {
    return realRequst<{list: API.VideoItem[]}>('/server/file/getvideo', {
      method: 'POST',
      data: {
        folder_id: params.folder_id,
        page_size: params.page_size,
        page: params.page
      },
      ...(options || {}),
    });}

    //修改文件夹信息
    export async function changefolder(
      params: {
        folder_id: number,
        folder_name: string,
        role: number
      },
      options?: { [key: string]: any },
    ) {
      return realRequst<{list: API.FolderListItem}>('/server/file/editfolder', {
        method: 'POST',
        data: {
          folder_id: params.folder_id,
          folder_name: params.folder_name,
          role: params.role
        },
        ...(options || {}),
      });}

    //修改视频信息
    export async function changevideo(
      params: {
        video_id: number,
        file_name: string,
        folder_id: number
      },
      options?: { [key: string]: any },
    ) {
      return realRequst<{list: API.VideoItem}>('/server/file/editvideo', {
        method: 'POST',
        data: {
          video_id: params.video_id,
          file_name: params.file_name,
          folder_id: params.folder_id
        },
        ...(options || {}),
      });}

      export async function updateManage(
        params: {
          user_id: number,
        },
        options?: { [key: string]: any },
      ) {
        return realRequst<{list: API.VideoItem}>('/server/file/editvideo', {
          method: 'POST',
          data: {
            user_id: params.user_id,
            label: 'viewing',
            status: true
          },
          ...(options || {}),
        });}
  

// 获取七牛云Token
export async function getqiniutoken(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authorization token not found in localStorage');
  }

  try {
    return await realRequst<API.Qiniu>('/server/file/getqiniutoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      ...(options || {}),
    });
  } catch (error) {
    console.error('Failed to fetch Qiniu token:', error);
    throw error;
  }
}

// 添加视频
export async function addvideo(
  params: {
    file: File,
    fileName: string,
    folderId: string,
  },
  options?: { [key: string]: any },
) {
  // 构建 FormData 对象
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('fileName', params.fileName);
  formData.append('folderId', params.folderId);

  // 发送 POST 请求
  return realRequst<{ list: API.AddVideo }>('/server/file/uploadvideo', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  });
}


