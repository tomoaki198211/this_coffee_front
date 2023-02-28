import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useMessageStore } from "@/stores/message";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import SignupView from "@/views/SignupView.vue";
import ListReview from "@/views/ListReview.vue";
import ListCoffee from "@/views/ListCoffee.vue";
import ListUser from "@/views/ListUser.vue";
import ListAdminCoffee from "@/views/ListAdminCoffee.vue";
import PostCoffee from "@/views/PostCoffee.vue";
import NotFound from "@/views/NotFound.vue";
import MyAccount from "../views/MyAccount.vue";
import ShowCoffee from "@/views/ShowCoffee.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/auth/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/auth/signup",
      name: "signup",
      component: SignupView,
    },
    {
      path: "/auth/account",
      name: "my_account",
      component: MyAccount,
    },
    {
      path: "/users/admin/edit/:id",
      name: "edit_user",
      component: () => {
        return import("../views/EditUser.vue");
      },
      props: (routes) => {
        const idNum = Number(routes.params.id);
        return {
          id: idNum,
        };
      },
    },
    {
      path: "/users/admin/index",
      name: "index_user",
      component: ListUser,
    },
    {
      path: "/coffees/:id",
      name: "coffee",
      component: ShowCoffee,
      props: (routes) => {
        const idNum = Number(routes.params.id);
        return {
          id: idNum,
        };
      },
    },
    {
      path: "/coffees",
      name: "coffees",
      component: ListCoffee,
    },
    {
      path: "/coffees/admin/index",
      name: "index_coffee",
      component: ListAdminCoffee,
    },
    {
      path: "/coffees/admin/post",
      name: "post_coffee",
      component: PostCoffee,
    },
    {
      path: "/coffees/admin/edit/:id",
      name: "edit_coffee",
      component: () => {
        return import("../views/EditCoffee.vue");
      },
      props: (routes) => {
        const idNum = Number(routes.params.id);
        return {
          id: idNum,
        };
      },
    },
    {
      path: "/reviews",
      name: "reviews",
      component: ListReview,
    },
    {
      path: "/review/post/:id",
      name: "post_review",
      component: () => {
        return import("../views/PostReview.vue");
      },
      props: (routes) => {
        const idNum = Number(routes.params.id);
        return {
          id: idNum,
        };
      },
    },
    {
      path: "/review/:id",
      name: "review",
      component: () => {
        return import("../views/ShowReview.vue");
      },
      props: (routes) => {
        const idNum = Number(routes.params.id);
        return {
          id: idNum,
        };
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  if (to.name == "my_account" && !authStore.isAuthencated()) {
    messageStore.flash("ログインしていないとマイカウントに移動出来ません");
    next({ name: "login" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  if (to.name == "post_review" && !authStore.isAuthencated()) {
    messageStore.flash("ログインしていないユーザーはレビューを投稿出来ません");
    next({ name: "login" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const messageStore = useMessageStore();
  if (
    to.name === "review" &&
    !(from.name === "reviews" || from.name === "my_account")
  ) {
    messageStore.flash("レビューは直接開く事が出来ません");
    next({ name: "reviews" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const messageStore = useMessageStore();
  if (to.name === "post_review" && from.name !== "coffees") {
    messageStore.flash("レビュー投稿画面はコーヒー覧画面から選択して下さい");
    next({ name: "coffees" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const messageStore = useMessageStore();
  if (to.name === "edit_user" && from.name !== "index_user") {
    messageStore.flash(
      "他ユーザーの編集は管理者かつ、一覧画面から移動出来ます"
    );
    next({ name: "home" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const messageStore = useMessageStore();
  if (to.name === "edit_coffee" && from.name !== "index_coffee") {
    messageStore.flash(
      "コーヒーマスターの編集は管理者かつ、一覧画面から移動出来ます"
    );
    next({ name: "home" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const messageStore = useMessageStore();
  if (to.name === "post_coffee" && from.name !== "index_coffee") {
    messageStore.flash(
      "コーヒーマスターの投稿は管理者かつ、一覧画面から移動出来ます"
    );
    next({ name: "home" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  if (
    authStore.isAuthencated() &&
    (to.name === "login" || to.name === "signup")
  ) {
    messageStore.flash(
      "ログイン中は、ログイン・アカウント登録画面に移動出来ません"
    );
    next({ name: "my_account" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  if (to.name === "index_coffee" && authStore.admin !== true) {
    messageStore.flash("管理者以外はアクセス出来ません");
    next({ name: "home" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  if (to.name === "index_user" && authStore.admin !== true) {
    messageStore.flash("管理者以外はアクセス出来ません");
    next({ name: "home" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  if (to.name === "post_coffee" && authStore.admin !== true) {
    messageStore.flash("管理者以外はアクセス出来ません");
    next({ name: "home" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  if (to.name === "edit_coffee" && authStore.admin !== true) {
    messageStore.flash("管理者以外はアクセス出来ません");
    next({ name: "home" });
  } else next();
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  if (to.name === "edit_user" && authStore.admin !== true) {
    messageStore.flash("管理者以外はアクセス出来ません");
    next({ name: "home" });
  } else next();
});

export default router;
