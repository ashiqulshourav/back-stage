import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/multiTags";
import { type DataInfo, removeStorage, sessionKey, TokenKey } from "@/utils/auth";
import { message } from "@/utils/message";

export const useUserStore = defineStore('USERSTATE', {
  state: (): userType => ({
    roles: storageSession().getItem<DataInfo<{ id: number; name: string; resources: null }>>(sessionKey)?.roles.map(_ => _.name) ?? [],
    userInfo: {} as UserAPI.Login_User,
    token: '',
  }),
  actions: {
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    async loginByUsername(_data) {

    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.roles = [];
      removeStorage();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      this.userInfo = {};
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(_) {
      // return new Promise<RefreshTokenResult>((resolve, reject) => {
      //   refreshTokenApi(data)
      //     .then(data => {
      //       if (data) {
      //         // setToken(data.data);
      //         resolve(data);
      //       }
      //     })
      //     .catch(error => {
      //       reject(error);
      //     });
      // });
    },
    setUserInfo(_: UserAPI.Login_Data) {
      this.userInfo = Object.assign(this.userInfo, _.user)
      this.token = _.token;
      storageSession().setItem(sessionKey, this.userInfo);
      storageSession().setItem(TokenKey, this.token);
    },
    async s_check_user() {
      try {
        const res = await API.me()
        this.userInfo = Object.assign(this.userInfo, res);
      } catch (error) {
        message(error.message, { type: 'error' });
        console.log('user.ts文件 73==============行打印=', error)
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage }
    ]
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
