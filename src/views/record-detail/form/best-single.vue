<template>
  <div>
    <top-bar title="最佳单次详情" class="py-4 ml-2">
      <template #right>
        <div>
          <transition name="fade" mode="out-in">
          <!-- 复盘按钮 -->
          <n-button
            class="mr-4 w-15 h-8 text-4 shadow"
            strong
            secondary
            type="primary"
            v-if="reviewButtonVisible"
            @click="reviewButtonVisible = false"
          >
            复盘
          </n-button>

          <!-- 详情按钮 -->
          <n-button
            class="mr-4 w-15 h-8 text-4 shadow"
            strong
            secondary
            type="primary"
            v-else
            @click="reviewButtonVisible = true"
          >
            详情
          </n-button>
          </transition>
        </div>
      </template>
    </top-bar>

    <div class="p-4">
      <!-- 当前记录详情 -->
      <transition name="fade" mode="out-in">
        <n-el
          class="py-10 w-full rounded-2xl shadow bg-cover overflow-hidden"
          style="background: var(--record-card-background-color)"
          v-if="reviewButtonVisible"
        >
          <div class="text-center">
            <n-avatar
              class="mb-6 shadow"
              :size="100"
              round
              object-fit="cover"
              :src="userDetail.avatar !== '' ? userDetail.avatar : defalutAvatar"
              :fallback-src="defalutAvatar"
            />
            <div class="text-5">
              {{ recordStore.recordDetailParams.nickname }}
            </div>
          </div>
          <div class="grid grid-cols-2 gap-y-4 mt-4 text-center">
            <div>
              <div class="text-4">排名</div>
              <div
                class="text-4.5 font-bold"
                :class="[
                  { 'text-red-6': recordStore.recordDetailParams.rank === 1 },
                  { 'text-green-6': recordStore.recordDetailParams.rank === 2 },
                  {
                    'text-indigo-6': recordStore.recordDetailParams.rank === 3,
                  },
                ]"
              >
                {{ recordStore.recordDetailParams.rank }}
              </div>
            </div>
            <div>
              <div class="text-4">用时</div>
              <div
                class="text-4.5 font-bold"
                :class="[
                  {
                    'text-red-6': recordStore.recordDetailParams.duration < 10,
                  },
                  {
                    'text-green-6':
                      recordStore.recordDetailParams.duration > 10 &&
                      recordStore.recordDetailParams.duration < 20,
                  },
                  {
                    'text-indigo-6':
                      recordStore.recordDetailParams.duration > 20 &&
                      recordStore.recordDetailParams.duration < 30,
                  },
                ]"
              >
                {{ recordStore.recordDetailParams.duration }}
              </div>
            </div>
            <div>
              <div class="text-4">步数</div>
              <div
                class="text-4.5 font-bold"
                :class="[
                  {
                    'text-red-6': recordStore.recordDetailParams.stepCount < 50,
                  },
                  {
                    'text-green-6':
                      recordStore.recordDetailParams.stepCount > 50 &&
                      recordStore.recordDetailParams.stepCount < 60,
                  },
                  {
                    'text-indigo-6':
                      recordStore.recordDetailParams.stepCount > 60 &&
                      recordStore.recordDetailParams.stepCount < 70,
                  },
                ]"
              >
                {{ recordStore.recordDetailParams.stepCount }}
              </div>
            </div>

            <div>
              <div class="text-4">创建时间</div>
              <div class="text-4.5 font-bold">
                {{
                  formatDataByTimestamp(
                    parseInt(recordStore.recordDetailParams.updatedAt)
                  )
                }}
              </div>
            </div>
          </div>
        </n-el>
      
      <!-- 复盘复原过程 -->
      <div class="w-full" v-else>
        <game-map :game-map="gameMap" />

        <div class="flex justify-between items-center mt-4">
          <!-- 自动播放 -->
          <n-button
            class="w-24 h-10 text-4 shadow"
            strong
            secondary
            type="primary"
            @click="autoPlayHandler"
            v-if="timer === null && stepCount < totalStepCount"
          >
            自动播放
          </n-button>

          <!-- 取消播放 -->
          <n-button
            class="w-24 h-10 text-4 shadow"
            strong
            secondary
            type="primary"
            @click="pauseAutoPlayHandler"
            v-if="timer !== null && stepCount < totalStepCount"
          >
            取消播放
          </n-button>

          <!-- 重置 -->
          <n-button
            class="w-24 h-10 text-4 shadow"
            strong
            secondary
            type="primary"
            @click="resetHandler"
            v-if="stepCount == totalStepCount"
          >
            重置
          </n-button>

          <!-- 计步器 -->
          <div>{{ stepCount }} / {{ totalStepCount }}</div>

          <!-- 下一步 -->
          <n-button
            class="w-20 h-10 text-4 shadow"
            strong
            secondary
            type="primary"
            :disabled="nextButtonDisabled"
            @click="nextStepHandler"
          >
            下一步
          </n-button>
        </div>
      </div>

    </transition>
    </div>
  </div>
</template>

<script setup>
import TopBar from "@/components/TopBar.vue";
import TitleBar from "@/components/TitleBar.vue";
import GameMap from "@/views/record-detail/components/GameMap.vue";
import recordRequest from "@/api/methods/record";
import userRequest from "@/api/methods/user";
import { defalutAvatar } from "@/config/index.js";
import { clickRules, createHashMap } from "@/common/game.js";
import { formatDataByTimestamp } from "@/utils/time.js";
import { useRecordStore } from "@/store/recordStore";

const recordStore = useRecordStore();

// 用户详情
const userDetail = ref({});
// 复盘按钮是否显示
const reviewButtonVisible = ref(true);
// 记录详情
const recordDetail = ref({});
// 游戏地图
const gameMap = ref([]);
// 游戏地图哈希表
const gameHashMap = ref({});
// 步数
const stepCount = ref(0);
// 总步数
let totalStepCount = ref(0);
// 解法
let solution = [];
// 定时器
const timer = ref(null);
// 下一步按钮是否禁用
const nextButtonDisabled = computed(() => {
  return stepCount.value >= totalStepCount.value;
});

/**
 * 获取记录详情
 */
const getRecordDetail = async () => {
  const { data } = await recordRequest.getById(
    recordStore.recordDetailParams.bestSingleId
  );

  if (data.code === 200) {
    recordDetail.value = data.data;
  }
};

/**
 * 获取用户详情
 */
const getUserDetail = async () => {
  const { data } = await userRequest.getById(
    recordStore.recordDetailParams.userId
  );

  if (data.code === 200) {
    userDetail.value = data.data;
  }
};

/**
 * 根据打乱字符串获取游戏地图
 * @param {string} scramble 打乱字符串
 * @returns {number[][]} 游戏地图
 */
const getGameMapByScrambleHandler = (scramble) => {
  // 将字符串拆分成数组
  var scrambleArray = scramble.split(",");

  // 将一维数组转换为二维数组
  var rows = 4;
  var cols = 4;
  var gameMap = new Array(rows)
    .fill(null)
    .map((row, i) =>
      scrambleArray
        .slice(i * cols, (i + 1) * cols)
        .map((value) => (value !== "" ? parseInt(value) : null))
    );

  return gameMap;
};

/**
 * 获取解法
 * @param {string} solutionStr 解法字符串
 * @returns {number[]} 解法
 */
const getSolutionHandler = (solutionStr) => {
  return solutionStr.split(",");
};

/**
 * 自动播放
 */
const autoPlayHandler = () => {
  if (stepCount.value >= totalStepCount.value) {
    pauseAutoPlayHandler();
    timer.value = null;

    return;
  }

  const { newGameMap, newGameHashMap } = clickRules(
    gameMap.value,
    gameHashMap.value,
    undefined,
    undefined,
    parseInt(solution[stepCount.value])
  );

  stepCount.value++;
  gameMap.value = newGameMap;
  gameHashMap.value = newGameHashMap;

  timer.value = setTimeout(() => {
    autoPlayHandler();
  }, 500);
};

/**
 * 暂停自动播放
 */
const pauseAutoPlayHandler = () => {
  if (timer.value === null) return;

  clearTimeout(timer.value);
  timer.value = null;
};

/**
 * 重置
 */
const resetHandler = () => {
  stepCount.value = 0;
  gameMap.value = getGameMapByScrambleHandler(recordDetail.value.scramble);
  gameHashMap.value = createHashMap(gameMap.value);
};

/**
 * 下一步
 */
const nextStepHandler = () => {
  if (stepCount.value >= totalStepCount) return;

  pauseAutoPlayHandler();

  const { newGameMap, newGameHashMap } = clickRules(
    gameMap.value,
    gameHashMap.value,
    undefined,
    undefined,
    parseInt(solution[stepCount.value])
  );

  stepCount.value++;
  gameMap.value = newGameMap;
  gameHashMap.value = newGameHashMap;
};

onMounted(async () => {
  await getRecordDetail();
  await getUserDetail();
  totalStepCount.value = recordDetail.value.stepCount;
  gameMap.value = getGameMapByScrambleHandler(recordDetail.value.scramble);
  solution = getSolutionHandler(recordDetail.value.solution);
  gameHashMap.value = createHashMap(gameMap.value);
});
</script>

<style scoped>
/* 渐显动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>