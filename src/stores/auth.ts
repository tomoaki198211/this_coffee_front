import { defineStore } from "pinia";
import axios, { type AxiosResponse } from "axios";
import { useMessageStore } from "@/stores/message";
import router from "../router";
import { URL } from "../url";

type User = {
  uid?: string | null;
  access_token?: string | null;
  client?: string | null;
  user_id?: string | null;
  user_name?: string | null;
  admin?: string | null;
};

export const useAuthStore = defineStore({
  id: "auth",
  state: (): User => ({
    uid: localStorage.getItem("uid"),
    access_token: localStorage.getItem("access-token"),
    client: localStorage.getItem("client"),
    user_id: localStorage.getItem("user-id"),
    user_name: localStorage.getItem("user-name"),
    admin: localStorage.getItem("admin"),
  }),

  actions: {
    //アカウント登録
    async signup(
      email: string,
      password: string,
      password_confirmation: string,
      name: string
    ): Promise<void> {
      const messageStore = useMessageStore();
      try {
        await axios
          .post(`${URL.ADDRESS}/api/v1/auth`, {
            email: email,
            password: password,
            password_confirmation: password_confirmation,
            name: name,
          })
          .then((response: AxiosResponse<any>) => {
            localStorage["client"] = response.headers["client"];
            localStorage["uid"] = response.headers["uid"];
            localStorage["access-token"] = response.headers["access-token"];
            localStorage["user-id"] = response.data.data.id;
            localStorage["user-name"] = response.data.data.name;
            this.access_token = response.headers["access-token"];
            this.client = response.headers["client"];
            this.uid = response.headers["uid"];
            this.user_id = response.data.data.id;
            this.user_name = response.data.data.name;
            messageStore.flash("アカウントを作成してログインしました");
            router.push({ path: "/reviews" });
          });
      } catch (error: any) {
        messageStore.flash(error.response.data.errors.full_messages);
      }
    },

    //ログイン
    async login(email: string, password: string): Promise<void> {
      const messageStore = useMessageStore();
      try {
        await axios
          .post(`${URL.ADDRESS}/api/v1/auth/sign_in`, {
            email: email,
            password: password,
          })
          .then((response) => {
            localStorage["client"] = response.headers["client"];
            localStorage["uid"] = response.headers["uid"];
            localStorage["access-token"] = response.headers["access-token"];
            localStorage["user-id"] = response.data.data.id;
            localStorage["user-name"] = response.data.data.name;
            localStorage["admin"] = response.data.data.admin;
            this.access_token = response.headers["access-token"];
            this.client = response.headers["client"];
            this.uid = response.headers["uid"];
            this.user_id = response.data.data.id;
            this.user_name = response.data.data.name;
            this.admin = response.data.data.admin;
            messageStore.flash("ログインしました");
            router.push({ path: "/reviews" });
          });
      } catch (error: any) {
        messageStore.flash(error.response.data.errors[0]);
      }
    },

    //ゲストログイン
    async guest_login(): Promise<void> {
      const messageStore = useMessageStore();
      try {
        await axios
          .post(`${URL.ADDRESS}/api/v1/auth/guest_sign_in`, {})
          .then((response) => {
            localStorage["client"] = response.headers["client"];
            localStorage["uid"] = response.headers["uid"];
            localStorage["access-token"] = response.headers["access-token"];
            localStorage["user-id"] = response.data.data.id;
            localStorage["user-name"] = response.data.data.name;
            this.access_token = response.headers["access-token"];
            this.client = response.headers["client"];
            this.uid = response.headers["uid"];
            this.user_id = response.data.data.id;
            this.user_name = response.data.data.name;
            messageStore.flash("ログインしました");
            router.push({ path: "/reviews" });
          });
      } catch (error: any) {
        messageStore.flash(error.response.data.errors[0]);
      }
    },

    //ゲスト管理者ログイン
    async guest_admin_login(): Promise<void> {
      const messageStore = useMessageStore();
      try {
        await axios
          .post(`${URL.ADDRESS}/api/v1/auth/guest_admin_sign_in`, {})
          .then((response) => {
            localStorage["client"] = response.headers["client"];
            localStorage["uid"] = response.headers["uid"];
            localStorage["access-token"] = response.headers["access-token"];
            localStorage["user-id"] = response.data.data.id;
            localStorage["user-name"] = response.data.data.name;
            localStorage["admin"] = response.data.data.admin;
            this.access_token = response.headers["access-token"];
            this.client = response.headers["client"];
            this.uid = response.headers["uid"];
            this.user_id = response.data.data.id;
            this.user_name = response.data.data.name;
            this.admin = response.data.data.admin;
            messageStore.flash("ログインしました");
            router.push({ path: "/reviews" });
          });
      } catch (error: any) {
        messageStore.flash(error.response.data.errors[0]);
      }
    },

    //ログアウト
    async logout(): Promise<void> {
      const messageStore = useMessageStore();
      await axios.delete(`${URL.ADDRESS}/api/v1/auth/sign_out`, {
        headers: {
          uid: this.uid,
          "access-token": this.access_token,
          client: this.client,
        },
      });
      localStorage.removeItem("access-token");
      localStorage.removeItem("uid");
      localStorage.removeItem("client");
      localStorage.removeItem("user-id");
      localStorage.removeItem("user-name");
      localStorage.removeItem("admin");
      this.access_token = null;
      this.client = null;
      this.uid = null;
      this.user_id = null;
      this.user_name = null;
      this.admin = null;
      messageStore.flash("ログアウトしました");
    },

    //アカウント削除
    async sign_out(): Promise<void> {
      const messageStore = useMessageStore();
      await axios.delete(`${URL.ADDRESS}/api/v1/auth`, {
        headers: {
          uid: this.uid,
          "access-token": this.access_token,
          client: this.client,
        },
      });
      localStorage.removeItem("access-token");
      localStorage.removeItem("uid");
      localStorage.removeItem("client");
      localStorage.removeItem("user-id");
      localStorage.removeItem("user-name");
      localStorage.removeItem("admin");
      this.access_token = null;
      this.client = null;
      this.uid = null;
      this.user_id = null;
      this.user_name = null;
      this.admin = null;
      messageStore.flash("アカウントを削除しました");
    },

    async account_update(
      email: string,
      password: string,
      name: string
    ): Promise<void> {
      const messageStore = useMessageStore();
      try {
        await axios
          .put(`${URL.ADDRESS}/api/v1/auth`, {
            uid: this.uid,
            "access-token": this.access_token,
            client: this.client,
            email: email,
            password: password,
            name: name,
          })
          .then((response: AxiosResponse<any>) => {
            localStorage["client"] = response.headers["client"];
            localStorage["uid"] = response.headers["uid"];
            localStorage["access-token"] = response.headers["access-token"];
            localStorage["user-id"] = response.data.data.id;
            localStorage["user-name"] = response.data.data.name;
            this.access_token = response.headers["access-token"];
            this.client = response.headers["client"];
            this.uid = response.headers["uid"];
            this.user_id = response.data.data.id;
            this.user_name = response.data.data.name;
            messageStore.flash("アカウントを更新しました");
            router.push({ path: "/reviews" });
          });
      } catch (error: any) {
        messageStore.flash(error.response.data.errors.full_messages);
      }
    },

    isAuthencated(): boolean {
      return !!this.client;
    },
  },
});
