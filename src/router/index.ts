import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import SignupView from "../views/SignupView.vue";
import ListReview from "../views/ListReview.vue";
import PostReview from "../views/PostReview.vue";

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
      path: "/reviews",
      name: "reviews",
      component: ListReview,
    },
    {
      path: "/review/post",
      name: "post_review",
      component: PostReview,
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
