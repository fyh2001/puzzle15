import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

import Index from "@/views/index/index.vue";
import Home from "@/views/home/index.vue";
import MatchRoom from "@/views/match-room/index.vue";
import Record from "@/views/record/index.vue";
import RecordDetail from "@/views/record-detail/index.vue";
import User from "@/views/user/index.vue";
import Login from "@/views/login/index.vue";
import Register from "@/views/register/index.vue";
import UserEditProfile from "@/views/user-edit-profile/index.vue";
import UpdateLog from "@/views/update-log/index.vue";
import Test from "@/views/test/index.vue";

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
        meta: {
          index: 0,
        },
      },
      {
        path: "/record",
        name: "Record",
        component: Record,
        meta: {
          index: 1,
        },
      },
      {
        path: "/user",
        name: "User",
        component: User,
        meta: {
          index: 2,
        },
      },
    ],
  },
  {
    path: "/match-room/:roomId",
    name: "MatchRoom",
    component: MatchRoom,
    props: true,
  },
  {
    path: "/record-detail",
    name: "RecordDetail",
    component: RecordDetail,
    props: true,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/user-edit-profile",
    name: "UserEditProfile",
    component: UserEditProfile,
  },
  {
    path: "/update-log",
    name: "UpdateLog",
    component: UpdateLog,
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
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
