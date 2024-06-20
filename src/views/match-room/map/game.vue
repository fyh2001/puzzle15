<script setup>
import {
  clickRules,
  getCellClass,
  createHashMap,
  isSolvable,
  getScramble,
  setNPerm,
} from "@/common/game.js";
import { formatDurationInGame } from "@/utils/time.js";
import {
  encryptNum,
  decryptStr,
  generateRandomIdx,
} from "@/utils/encipherment.js";

import { useRecordStore } from "@/store/recordStore";
import { useUserStore } from "@/store/userStore";
import { useScrambleStore } from "@/store/scrambleStore";
import { watch } from "vue";

const recordStore = useRecordStore();
const userStore = useUserStore();
const scrambleStore = useScrambleStore();

const props = defineProps({
  scrambleStr: {
    type: String,
    default: "",
  },
  scrambleIdx: {
    type: String,
    default: "",
  },
});

const gameMap = ref([
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, null],
]);

// 打乱顺序
let scrambleMap = [];
// 解法
let solution = [];
// 哈希表
const gameHashMap = ref(createHashMap(gameMap.value));
// 步数
const stepCount = ref(0);
// 时间
let timer = null; // 定时器
let startTime = 0; // 开始时间
let endTime = ref(0); // 结束时间
const interval = ref(0); // 间隔时间
const time = computed(() => {
  if (isStart.value) return formatDurationInGame(interval.value);
  if (isWin.value) return formatDurationInGame(endTime.value - startTime);
  return "00:00:000";
});
// 是否开始
const isStart = ref(false);
// 是否打乱
const isScramble = ref(false);
// 是否胜利
const isWin = ref(false);

// 加密表单
const formData = {
  ri: 0, // 随机idx
};

/**
 * 触摸
 * @param {number} rowIndex 行
 * @param {number} itemIndex 列
 */
const onTouch = (rowIndex, itemIndex) => {
  if (isScramble.value) {
    isScramble.value = false;
    isStart.value = true;
    startTime = Date.now();
    timeStart();
  }

  const { newGameMap, newGameHashMap, newStepCount, newSolution } = clickRules(
    gameMap.value,
    gameHashMap.value,
    rowIndex,
    itemIndex
  );

  gameMap.value = newGameMap;
  gameHashMap.value = newGameHashMap;
  stepCount.value += newStepCount;
  newSolution == "" ? "" : solution.push(newSolution);

  // 判断是否胜利
  if (
    gameMap.value
      .flat()
      .slice(0, 15)
      .every((item, index) => item === index + 1) &&
    isStart.value
  ) {
    clearInterval(timer);
    isStart.value = false;
    endTime.value = Date.now();
    isWin.value = true;

    scrambleStore.clearScramble();
    scrambleStore.clearScrambleByShare();

    // 保存记录
    saveRecord();
  }
};

/**
 * 打乱
 */
const scramble = () => {
  clearInterval(timer);
  isStart.value = false;
  isWin.value = false;
  stepCount.value = 0;
  scrambleMap = [];
  solution = [];

  isScramble.value = true;
};

/**
 * 开始计时
 */
const timeStart = () => {
  timer = setInterval(() => {
    interval.value = Date.now() - startTime;
  }, 10);
};

/**
 * 初始化游戏地图
 */
const initGameMap = () => {
  if (props.scrambleStr === "") return;

  const scramble = props.scrambleStr.split(",").map((item) => {
    return item === "" ? null : Number(item);
  });

  // 重新赋值
  for (let i = 0; i < gameMap.value.length; i++) {
    for (let j = 0; j < gameMap.value[i].length; j++) {
      gameMap.value[i][j] = scramble[i * 4 + j];
      gameHashMap.value.set(scramble[i * 4 + j], { row: i, column: j });
    }
  }

  isScramble.value = true;
};

onMounted(() => {
  watch(
    () => props.scrambleStr,
    () => {
      initGameMap();
    },
    {
      deep: true,
    }
  );
});
</script>

<template>
  <div>
    <div class="grid gap-2 p-1 rounded-md">
      <div
        class="grid grid-cols-4 gap-2"
        v-for="(row, rowIndex) in gameMap"
        :key="rowIndex"
      >
        <div
          class="aspect-square flex items-center justify-center rounded-md text-center text-5 font-bold"
          :class="getCellClass(item)"
          v-for="(item, itemIndex) in row"
          :key="itemIndex"
          @click="onTouch(rowIndex, itemIndex)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="flex justify-around items-center w-full mt-10">
      <div class="w-42 text-center tabular-nums">
        <div class="text-8 font-bold">{{ time }}</div>
        <div class="text-4">步数: {{ stepCount }}</div>
      </div>

      <n-button
        class="w-34 h-15 text-5 shadow"
        strong
        secondary
        type="primary"
        @click="scramble"
      >
        申请打乱
      </n-button>
    </div>
  </div>
</template>
