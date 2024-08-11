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
  return Promise.resolve(localStorage.removeItem('token'))
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
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}
