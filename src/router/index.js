import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

import Index from "@/views/index/index.vue";
import Home from "@/views/home/index.vue";
import Record from "@/views/record/index.vue";
import User from "@/views/user/index.vue";
import Login from "@/views/login/index.vue";
import Register from "@/views/register/index.vue";

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
        meta:{
          index: 0
        }
      },
      {
        path: "/record",
        name: "Record",
        component: Record,
        meta:{
          index: 1
        }
      },
      {
        path: "/user",
        name: "User",
        component: User,
        meta:{
          index: 2
        }
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name:"Register",
    component: Register
  }
];

const router = createRouter({
  history: createWebHashHistory("/puzzle15/"),
  routes,
});

router.afterEach((to, from) => {
  const toIndex = to.meta.index;
  const fromIndex = from.meta.index;

  to.meta.transition = toIndex > fromIndex ? "slide-left" : "slide-right";
});

export default router;
