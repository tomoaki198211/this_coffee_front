import { defineStore } from "pinia";
import axios, { type AxiosResponse } from "axios";
import { useMessageStore } from "@/stores/message";
import router from "../router";

type User = {
  uid?: string | null;
  access_token?: string | null;
  client?: string | null;
};

export const useAuthStore = defineStore({
  id: "auth",
  state: (): User => ({
    uid: localStorage.getItem("uid"),
    access_token: localStorage.getItem("access-token"),
    client: localStorage.getItem("client"),
  }),
  actions: {
    async signup(
      email: string,
      password: string,
      password_confirmation: string,
      name: string
    ): Promise<void> {
      const messageStore = useMessageStore();
      try {
        await axios
          .post("http://localhost:3000/api/v1/auth", {
            email: email,
            password: password,
            password_confirmation: password_confirmation,
            name: name,
          })
          .then((response: AxiosResponse<any>) => {
            localStorage["client"] = response.headers["client"];
            localStorage["uid"] = response.headers["uid"];
            localStorage["access-token"] = response.headers["access-token"];
            this.access_token = response.headers["access-token"];
            this.client = response.headers["client"];
            this.uid = response.headers["uid"];
            console.log("status:", response.status);
          });
      } catch (error: any) {
        console.log(error);
        console.log(error.response.status);
        messageStore.flash(error.response.data.errors.full_messages);
      }
    },
    async login(email: string, password: string): Promise<void> {
      const messageStore = useMessageStore();
      try {
        await axios
          .post("http://localhost:3000/api/v1/auth/sign_in", {
            email: email,
            password: password,
          })
          .then((response) => {
            localStorage["client"] = response.headers["client"];
            localStorage["uid"] = response.headers["uid"];
            localStorage["access-token"] = response.headers["access-token"];
            this.access_token = response.headers["access-token"];
            this.client = response.headers["client"];
            this.uid = response.headers["uid"];
            console.log("status:", response.status);
            console.log(response.data);
            messageStore.flash("ログインしました");
            router.push({ path: "/reviews" });
          });
      } catch (error: any) {
        console.log(error.response.status);
        messageStore.flash(error.response.data.errors[0]);
      }
    },
    async logout(): Promise<void> {
      const messageStore = useMessageStore();
      await axios.delete("http://localhost:3000/api/v1/auth/sign_out", {
        headers: {
          uid: this.uid,
          "access-token": this.access_token,
          client: this.client,
        },
      });
      localStorage.removeItem("access-token");
      localStorage.removeItem("uid");
      localStorage.removeItem("client");
      this.access_token = null;
      this.client = null;
      this.uid = null;
      messageStore.flash("ログアウトしました");
    },
    isAuthencated(): boolean {
      return !!this.client;
    },
  },
});
