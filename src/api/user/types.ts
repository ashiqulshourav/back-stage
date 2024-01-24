declare namespace UserAPI {
  type Login_Role = {
    id: number;
    name: string;
    resources?: any;
  }

  type Login_User = {
    id: number;
    email: string;
    roles: Login_Role[];
  }

  type Login_Data = {
    token: string;
    user: Login_User;
  }

  type Login = {
    code: number;
    msg: string;
    data: Login_Data;
  }

  type Meta = {
    title?: string;
    icon?: string;
    rank?: number;
    roles?: string[];
  }


  type RouterChildren = {
    path: string;
    name: string;
    meta: Meta;
  }

  type RouterData = {
    path: string;
    meta: Meta;
    children: RouterChildren[];
  }


  type GetRouterTyperes = COMMON.BASE_RES_TYPE<RouterData[]>
}