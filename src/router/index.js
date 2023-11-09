import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

import Index from "../views/index/index.vue";
import Home from "../views/home/index.vue";
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
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory("/puzzle15/"),
  routes,
});

export default router;
