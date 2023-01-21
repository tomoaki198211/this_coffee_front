//コンポジションAPIで書き直し
import { ref } from "vue";
import { defineStore } from "pinia";
import axios, { type AxiosResponse } from "axios";
import { useMessageStore } from "@/stores/message";

export const useAuthStore = defineStore("auth", () => {
  const uid = ref(localStorage.getItem("uid"));
  const access_token = ref(localStorage.getItem("access-token"));
  const client = ref(localStorage.getItem("client"));
  const messageStore = useMessageStore();

  async function signup(
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
      console.log(error.response.status);
      messageStore.flash(error.response.data.errors[0]);
    }
  }

  async function login(email: string, password: string): Promise<void> {
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
          messageStore.flash("ログインしました");
          // console.log(response.data.erros);
        });
    } catch (error) {
      console.log(error.response.status);
      messageStore.flash(error.response.data.errors[0]);
    }
  }

  async function logout(): Promise<void> {
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
    this.access_token = "";
    this.client = "";
    this.uid = "";
    messageStore.flash("ログアウトしました");
  }
  function isAuthencated(): boolean {
    return !!this.client;
  }
  return { uid, access_token, client, signup, login, logout, isAuthencated };
});
