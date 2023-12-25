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
}