import { defineStore } from "pinia";
import axios, { type AxiosResponse } from "axios";

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
          });
      } catch (error) {
        console.log(error);
      }
    },
    async logout(): Promise<void> {
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
    isauthencated(): boolean {
      return !!this.client;
    },
  },
});
