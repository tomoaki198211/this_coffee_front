import { defineStore } from "pinia";
import axios, { type AxiosResponse } from "axios";
import { useMessageStore } from "@/stores/message";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    uid: localStorage.getItem("uid"),
    access_token: localStorage.getItem("access-token"),
    client: localStorage.getItem("client"),
    returnUrl: null,
  }),
  actions: {
    async signup(
      email: string,
      password: string,
      password_confirmation: string,
      name: string
    ): Promise<void> {
      try {
        await axios
          .post("http://localhost:3000/api/v1/auth", {
            email: email,
            password: password,
            password_confirmation: password_confirmation,
            name: name,
          })
          .then((response: AxiosResponse<any>) => {
            localStorage.setItem("client", response.headers["client"]);
            localStorage.setItem("uid", response.headers["uid"]);
            localStorage.setItem(
              "access-token",
              response.headers["access-token"]
            );
            this.access_token = response.headers["access-token"];
            this.client = response.headers["client"];
            this.uid = response.headers["uid"];
            console.log("status:", response.status);
          });
      } catch (error) {
        console.log(error);
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
            localStorage.setItem("client", response.headers["client"]);
            localStorage.setItem("uid", response.headers["uid"]);
            localStorage.setItem(
              "access-token",
              response.headers["access-token"]
            );
            this.access_token = response.headers["access-token"];
            this.client = response.headers["client"];
            this.uid = response.headers["uid"];
            console.log("status:", response.status);
            console.log(response.data);
            messageStore.text = "ログインしました";
            // console.log(response.data.erros);
          });
      } catch (error) {
        console.log(error.response.status);
        messageStore.text = error.response.data.errors[0];
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
      // localStorage.removeItem("user");
      localStorage.removeItem("access-token");
      localStorage.removeItem("uid");
      localStorage.removeItem("client");
      this.access_token = "";
      this.client = "";
      this.uid = "";
    },
    isAuthencated(): boolean {
      return !!this.client;
    },
  },
});
