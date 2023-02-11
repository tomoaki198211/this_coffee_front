import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import SignupView from "../views/SignupView.vue";
import ListReview from "../views/ListReview.vue";
import ListCoffee from "@/views/ListCoffee.vue";
import ListUser from "@/views/ListUser.vue";
import CoffeeMaster from "@/views/CoffeeMaster.vue";

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
      path: "/users",
      name: "users",
      component: ListUser,
    },
    {
      path: "/coffees",
      name: "coffees",
      component: ListCoffee,
    },
    {
      path: "/coffees/master",
      name: "coffees_master",
      component: CoffeeMaster,
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
      path: "/coffees/master/:id",
      name: "master_edit",
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
    // {
    //   path: "/review/edit/:id",
    //   name: "edit_review",
    //   //動的インポート
    //   component: () => {
    //     return import("../views/EditReview.vue");
    //   },
    //   props: (routes) => {
    //     const idNum = Number(routes.params.id);
    //     return {
    //       id: idNum,
    //     };
    //   },
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name !== "login" && to.name !== "signup" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (
    to.name == "review" &&
    from.name !== "reviews" &&
    !authStore.isAuthencated()
  )
    next({ name: "reviews" });
  else next();
});

export default router;
