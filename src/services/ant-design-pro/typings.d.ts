// @ts-ignore
/* eslint-disable */

declare namespace API {

  type LoginResult =
    | {
        access_expire: number;
        access_token: string;
        highest_role: number;
        refresh_after: number;
        [property: string]: any;
      }
    | string;
  type PageParams = {
    current?: number;
    pageSize?: number;
  };
  type resType = {
    data: any,
    msg: string,
    code: number
  }
  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
    date?: string;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    mobile: string;
    password?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

/**
* ApplicationForm
*/
export interface ApplicationForm {
  address: string;
  answers: Answer[];
  birthday: string;
  create_time: string;
  degree: string;
  email: string;
  id: number;
  identificationNumber: string;
  identity: Identitification;
  medicalHistory: MedicineHistory;
  mobile: string;
  nation: string;
  native: string;
  organizing_committee_id: number;
  outWork: string;
  policialOutlook: string;
  regional_head_id: number;
  resumes: Resume[];
  sex: number;
  speciality: string;
  status: number;
  submission_time: number;
  update_time: string;
  user_id: number;
  username: string;
  work: string;
  [property: string]: any;
}

/**
* 问题类型
*/
type Answer = {
  answer: string;
  index: number;
  [property: string]: any;
}

/**
* 身份验证
*/
interface Identitification {
  backIdCard: string;
  files: string[];
  frontIdCard: string;
  [property: string]: any;
}

/**
* 救助历史
*/
interface MedicineHistory {
  medicine: string;
  medicineHistory: string;
  outpatientHistory: string;
  [property: string]: any;
}

/**
* 救助信息
*/
interface Resume {
  duty: string;
  place: string;
  time: string;
  [property: string]: any;
}
  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type CurrentUserResult = {
    user_info: User;
    [property: string]: any;
  }

  type CurrentUser = {
    address: string;
    avatar: string;
    birthday: string;
    email: string;
    /**
     * 最高权限
     */
    highest_role: number;
    id: number;
    mobile: string;
    /**
     * 管辖区域
     */
    region: string[];
    role: number;
    sex: number;
    username: string;
    [property: string]: any;
  }
}
