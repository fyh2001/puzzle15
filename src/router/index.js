import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

import Index from "../views/index/index.vue";
import Home from "../views/home/index.vue";
import Record from "../views/record/index.vue";

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
      }
    ],
  },
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
