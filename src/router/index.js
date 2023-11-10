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

  console.log(toIndex, fromIndex);

  if (toIndex > fromIndex) {
    to.meta.transition = "slide-left";
  }

  if (toIndex < fromIndex) {
    to.meta.transition = "slide-right";
  }

  if (toIndex === fromIndex) {
    to.meta.transition = "fade";
  }

});

export default router;
