import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import SignupView from "../views/SignupView.vue";

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
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name !== "login" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});

export default router;
