<template>
  <div class="p-4 w-screen">
    <div class="flex justify-between items-center">
      <title-bar title="用户" />

      <dropdown :options="options" :show-divider="userStore.token != ''" @select="selecthHanlder" />
    </div>

    <div
      class="relative py-10 mt-4 w-full bg-white rounded-2xl shadow bg-cover overflow-hidden"
    >
      <!-- <div class="absolute inset-0 w-full h-full backdrop-blur-sm" /> -->
      <!-- <div class="absolute inset-0 w-full h-full bg-black opacity-30 backdrop-blur-sm"/> -->

      <!-- 已登录 -->
      <div
        class="relative flex justify-around items-center z-100"
        v-if="userStore.user"
      >
        <!-- 头像与昵称 -->
        <transition name="left" appear>
          <div class="text-center">
            <n-avatar
              class="mb-6 shadow"
              :size="100"
              round
              src="http://139.9.7.92/puzzle15/user_avator.jpeg"
            />
            <div class="text-5">{{ userStore.user.nickname }}</div>
          </div>
        </transition>

        <!-- 最佳成绩与排名 -->
        <transition name="right" appear>
          <div
            class="grid grid-cols-1 gap-2 text-4"
            v-if="userStore.userBestRecord"
          >
            <div>
              最佳单次:
              {{
                userStore.userBestRecord.bestSingle == ""
                  ? "暂无"
                  : userStore.getBestSingleRecord
              }}
            </div>
            <div>
              最佳平均:
              {{
                userStore.userBestRecord.bestAverage == ""
                  ? "暂无"
                  : userStore.getBestAverageRecord
              }}
            </div>
            <div>
              最佳排名:
              {{
                userStore.userBestRecord.bestRank == 0
                  ? "暂未开启"
                  : userStore.userBestRecord.bestRank
              }}
            </div>
          </div>
        </transition>
      </div>

      <!-- 未登录 -->
      <div class="flex justify-around items-center z-100" v-else>
        <!-- 头像与昵称 -->
        <transition name="left" appear>
          <div class="text-center" @click="$router.push('login')">
            <n-avatar
              class="mb-6 shadow"
              :size="100"
              round
              src="http://139.9.7.92/puzzle15/016-woman.svg"
            />
            <div class="text-5">点我登录</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleBar from "@/components/TitleBar.vue";
import { useUserStore } from "@/store/userStore";
import userRequest from "@/api/methods/user";
import recordBestSingleRequest from "@/api/methods/recordBestSingle";
import Dropdown from "../../components/Dropdown.vue";
import { onMounted } from "vue";

import {
  HealthAndSafetyRound,
  TransitEnterexitRound,
  AccountCircleRound,
} from "@vicons/material";

const selecthHanlder = (value) => {};

const userStore = useUserStore();

const options = [
  {
    label: "编辑资料",
    key: "editProfile",
    disabled: true,
    show: userStore.token !== "",
    icon: () => {
      return h(NIcon, {
        size: 18,
        class: "text-indigo-500",
        component: AccountCircleRound,
      });
    },
  },
  {
    label: "修改密码",
    key: "changePassword",
    disabled: true,
    show: userStore.token !== "",
    icon: () => {
      return h(NIcon, {
        size: 18,
        class: "text-indigo-500",
        component: HealthAndSafetyRound,
      });
    },
  },
  {
    label: "退出登录",
    key: "logout",
    // disabled: true,
    show: userStore.token !== "",
    icon: () => {
      return h(NIcon, {
        size: 20,
        class: "text-indigo-500",
        component: TransitEnterexitRound,
      });
    },
    props: {
      onClick: () => {
        window.$dialog.warning({
          title: "提示",
          content: "确定退出登录吗？",
          positiveText: "确定",
          negativeText: "取消",
          positiveButtonProps: {
            color: "#4f46e5"
          },
          onPositiveClick: () => {
            localStorage.clear();
            window.$message.success("退出登录成功");

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
        });
      },
    },
  },
];

/**
 * 获取用户信息
 */
const getUserInfo = async () => {
  const { data } = await userRequest.getByLoggedInUser();

  if (data.code === 200) userStore.setUser(data.data);
  else window.$message.error("数据更新失败");
};

/**
 * 获取用户最佳单次记录
 */
const getUserBestSingleRecord = async () => {
  const { data } = await recordBestSingleRequest.getByUserIdAndEvent("p15");

  if (data.code === 200) userStore.setUserBestSingleRecord(data.data);
  else window.$message.error("数据更新失败");
};

// style="background-image: url('../../../public/bg.jpg')"
onMounted(() => {
  if (userStore.token === "") return;
  getUserInfo();
  getUserBestSingleRecord();
});
</script>

<style>
.left-enter-active,
.left-leave-active {
  transition: all 1s;
}

.left-enter-from {
  opacity: 0;
  transform: translateX(50%);
}

.right-enter-active,
.right-leave-active {
  transition: all 1s;
}

.right-enter-from {
  opacity: 0;
  transform: translateX(-50%);
}
</style>
