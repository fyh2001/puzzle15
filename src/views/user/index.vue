<template>
  <div class="p-4 w-screen">
    <title-bar title="主页" />

    <div class="py-10 mt-4 w-full bg-white rounded-2xl shadow">
      <!-- 已登录 -->
      <div
        class="flex justify-around items-center"
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
          <div class="grid grid-cols-1 gap-2 text-4" v-if="userStore.userBestRecord">
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
      <div class="flex justify-around items-center" v-else>
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
import { onMounted } from "vue";

const userStore = useUserStore();

const getUserInfo = async () => {
  const { data } = await userRequest.findByLoggedInUser();

  if (data.code === 200) userStore.setUser(data.data);
  else window.$message.error("数据更新失败");
};

const getUserBestRecord = async () => {
  const { data } = await userRequest.findBestRecordByLoggedInUser();

  if (data.code === 200) userStore.setUserBestRecord(data.data);
  else window.$message.error("数据更新失败");
};

onMounted(() => {
  if (userStore.token === "") return;
  getUserInfo();
  getUserBestRecord();
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
