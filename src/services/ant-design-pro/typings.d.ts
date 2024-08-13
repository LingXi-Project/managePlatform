// @ts-ignore
/* eslint-disable */

declare namespace API {

  type Qiniu = {
    token: string
    [property: string]: any;
  }

  type checkManagerRole = {
    managerRoles: manageItem[];
    [property: string]: any;
  }

  type manageItem = {
    label: string,
    status: boolean
  }

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
    highest_role?: number
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
* 相关病史
*/
interface MedicineHistory {
  medicine: string;
  medicineHistory: string;
  outpatientHistory: string;
  [property: string]: any;
}

/**
* 人员简历
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

  type UserListItem = {
    id: number;
    username: string;
    email: string;
    mobile: string;
    address: string;
    sex: number;
    status: number;
    createdAt: string;
    updatedAt: string;
    role: number;
    highest_role: number;
    region: string[];
    birthday: string;
    avator: string;
    [property: string]: any;
  };

  type UserList = {
    list: UserListItem[];
    total: number;
    [property: string]: any;
  };

  export interface User {
    address: string;
    birthday: string;
    email: string;
    id: number;
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

  type FolderList = {
    folder: FolderListItem[],
    total: number,
    [property: string]: any;
  }

  type FolderListItem = {
    id: number,
    folder_name: string,
    role: number,
    [property: string]: any;
  }

  type FolderItem = {
    folder_id: number,
    folder_name: string,
    role: number
    [property: string]: any;
  }

  type VideoItem = {
    folder_id: number,
    file_name: string,
    video_id: number
    [property: string]: any;
  }

  type VideoList = {
    list: VideoListItem[],
    total: number,
    [property: string]: any;
  }

  type AddVideo = {
    video_id: number,
    url: string,
    [property: string]: any;
  }

  type AddFolder = {
    folder_name:string,
    role:number;
    [property: string]: any;
  }
}