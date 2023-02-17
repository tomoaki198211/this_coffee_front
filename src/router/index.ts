import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
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
      //動的インポート
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
      //動的インポート
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
      //動的インポート
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
      //動的インポート
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

// ログインしていない状態ではloginとsignupにしか移動出来ない;
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   if (to.name !== "login" && to.name !== "signup" && !authStore.isAuthencated())
//     next({ name: "login" });
//   else next();
// });

//ログインしていないとマイアカウントにいけない
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "myaccount" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});

//ログインしていないとレビューを投稿出来ない。
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "post_review" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});

//レビューは直接閲覧出来ない。レビュー一覧からのみ移動出来る
router.beforeEach((to, from, next) => {
  if (to.name === "review" && from.name !== "reviews")
    next({ name: "reviews" });
  else next();
});

//レビュー投稿は直接入力では投稿画面に行けない。
router.beforeEach((to, from, next) => {
  if (to.name === "post_review" && from.name !== "coffees")
    next({ name: "coffees" });
  else next();
});

//他ユーザーを管理するadminユーザーは一覧からのみエディット画面に行くことが出来る。
router.beforeEach((to, from, next) => {
  if (to.name === "edit_user" && from.name !== "index_user")
    next({ name: "reviews" });
  else next();
});

//コーヒーマスターの編集はコーヒーマスター一覧からのみいくことが出来る
router.beforeEach((to, from, next) => {
  if (to.name === "edit_coffee" && from.name !== "index_coffee")
    next({ name: "coffees" });
  else next();
});

//コーヒーマスターの投稿はコーヒーマスター一覧からのみいくことが出来る
router.beforeEach((to, from, next) => {
  if (to.name === "post_coffee" && from.name !== "index_coffee")
    next({ name: "coffees" });
  else next();
});

// ログイン中はログイン、アカウント登録画面に行けない(未完成)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (
    authStore.isAuthencated() &&
    (to.name === "login" || to.name === "signup")
  )
    next({ name: "my_account" });
  else next();
});

export default router;
