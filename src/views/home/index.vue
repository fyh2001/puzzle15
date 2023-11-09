<template>
  <div class="p-4">
    <title-bar class="mb-6" title="练习" />

    <div ref="gameMapRef" class="grid grid-cols-1 gap-2 p-1 rounded-md">
      <div
        class="grid grid-cols-4 gap-2"
        v-for="(row, rowIndex) in gameMap"
        :key="rowIndex"
      >
        <div
          class="p-6 rounded-md text-center text-5 font-bold"
          :class="getCellClass(item)"
          v-for="(item, itemIndex) in row"
          :key="itemIndex"
          @click="onTouch(rowIndex, itemIndex)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <div class="flex justify-around items-center mt-10">
      <div class="text-center">
        <div class="text-10 font-bold">{{ time }}</div>
        <div class="text-4">步数: {{ step }}</div>
      </div>

      <n-button
        class="w-30 h-15 text-5 shadow"
        strong
        secondary
        type="primary"
        @click="scramble"
      >
        打乱
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import TitleBar from "../../components/TitleBar.vue";

const gameMapRef = ref(null);

// 4 * 4
const gameMap = ref([
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, null],
]);

// 哈希表
const gameHashMap = ref(createHashMap(gameMap.value));

// 分组
const redGroup = [1, 2, 3, 4, 5, 9, 13];
const blueGroup = [6, 7, 8, 10, 14];
const yellowGroup = [11, 12, 15];

// 步数
const step = ref(0);
// 时间
let timer = null;
let startTime = 0; // 开始时间
let endTime = 0; // 结束时间
const interval = ref(0); // 间隔时间
const time = computed(() => {
  if (isStart.value) {
    const millisecond = interval.value % 1000;
    console.log(millisecond);
    const second = parseInt(interval.value / 1000) % 60;
    const minute = parseInt(interval.value / 1000 / 60) % 60;

    return `${minute < 10 ? "0" + minute : minute}:${
      second < 10 ? "0" + second : second
    }:${
      millisecond < 100
        ? millisecond < 10
          ? "00" + millisecond
          : "0" + millisecond
        : millisecond
    }`;
  }

  if (isWin.value) {
    const millisecond = (endTime - startTime) % 1000;
    const second = parseInt((endTime - startTime) / 1000) % 60;
    const minute = parseInt((endTime - startTime) / 1000 / 60) % 60;

    return `${minute < 10 ? "0" + minute : minute}:${
      second < 10 ? "0" + second : second
    }:${
      millisecond < 100
        ? millisecond < 10
          ? "00" + millisecond
          : "0" + millisecond
        : millisecond
    }`;
  }

  return "00:00:000";
});

// 是否开始
const isStart = ref(false);
// 是否打乱
const isScramble = ref(false);
// 是否胜利
const isWin = computed(() => {
  if (
    gameMap.value
      .flat()
      .slice(0, 15)
      .every((item, index) => item === index + 1) &&
    isStart.value
  ) {
    clearInterval(timer);
    return true;
  }

  return false;
});

/**
 * 获取单元格样式
 * @param {number} itemValue 单元格值
 * @returns {string} 样式类名
 */
const getCellClass = (itemValue) => {
  if (redGroup.includes(itemValue)) {
    return "bg-red-4 shadow";
  } else if (blueGroup.includes(itemValue)) {
    return "bg-blue-4 shadow";
  } else if (yellowGroup.includes(itemValue)) {
    return "bg-yellow-4 shadow";
  }
  return "";
};

/**
 * 点击规则
 * @param {number} row 行
 * @param {number} column 列
 */
const clickRules = (row, column) => {
  const item = gameMap.value[row][column];
  if (item === null) {
    return;
  }

  // 获取点击的单元格的坐标
  const itemRow = row;
  const itemColumn = column;

  // 获取空白单元格的坐标
  const nullRow = gameHashMap.value.get(null).row;
  const nullColumn = gameHashMap.value.get(null).column;

  // 同一行
  if (itemRow == nullRow) {
    // 点击的单元格在空白单元格的右边
    if (itemColumn > nullColumn) {
      for (let i = nullColumn; i < itemColumn; i++) {
        gameMap.value[itemRow][i] = gameMap.value[itemRow][i + 1];
        gameHashMap.value.set(gameMap.value[itemRow][i + 1], {
          row: itemRow,
          column: i,
        });
      }
    }
    // 点击的单元格在空白单元格的左边
    else if (itemColumn < nullColumn) {
      for (let i = nullColumn; i > itemColumn; i--) {
        gameMap.value[itemRow][i] = gameMap.value[itemRow][i - 1];
        gameHashMap.value.set(gameMap.value[itemRow][i - 1], {
          row: itemRow,
          column: i,
        });
      }
    }
    gameMap.value[itemRow][itemColumn] = null;
    gameHashMap.value.set(null, { row: itemRow, column: itemColumn });
  }

  // 同一列
  if (itemColumn == nullColumn) {
    // 点击的单元格在空白单元格的下边
    if (itemRow > nullRow) {
      for (let i = nullRow; i < itemRow; i++) {
        gameMap.value[i][itemColumn] = gameMap.value[i + 1][itemColumn];
        gameHashMap.value.set(gameMap.value[i + 1][itemColumn], {
          row: i,
          column: itemColumn,
        });
      }
    }
    // 点击的单元格在空白单元格的上边
    else if (itemRow < nullRow) {
      for (let i = nullRow; i > itemRow; i--) {
        gameMap.value[i][itemColumn] = gameMap.value[i - 1][itemColumn];
        gameHashMap.value.set(gameMap.value[i - 1][itemColumn], {
          row: i,
          column: itemColumn,
        });
      }
    }
    gameMap.value[itemRow][itemColumn] = null;
    gameHashMap.value.set(null, { row: itemRow, column: itemColumn });
  }

  if (isStart.value) {
    step.value++;
  }
};

/**
 * 创建哈希表
 * @param {number[][]} arr 二维数组
 * @returns {Map<number, {row: number, column: number}>} 哈希表
 */
function createHashMap(arr) {
  const hashMap = new Map();
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      hashMap.set(arr[i][j], {
        row: i,
        column: j,
      });
    }
  }
  return hashMap;
}

/**
 * 触摸
 * @param {number} rowIndex 行
 * @param {number} itemIndex 列
 */
const onTouch = (rowIndex, itemIndex) => {
  if (isScramble.value) {
    isScramble.value = false;
    isStart.value = true;
    startTime = new Date().getTime();
    timeStart();
  }

  clickRules(rowIndex, itemIndex);

  if (isWin.value) {
    isStart.value = false;
    endTime = new Date().getTime();
    clearInterval(timer);
  }
};

/**
 * 判断是否可解
 * @param {number[][]} numsMap 二维数组
 * @returns {boolean} 是否可解
 */
const isSolvable = (numsMap) => {
  // 判断是否可解,计算逆序数,偶数可解
  // let count = 0;
  // for (let i = 0; i < numsMap.length; i++) {
  //   for (let j = i + 1; j < numsMap.length; j++) {
  //     if (numsMap[i] > numsMap[j]) {
  //       count++;
  //     }
  //   }
  // }
  let sum = 0;
  for (let i = 0; i < 16; i++) {
    if (numsMap[i] === null) {
      sum += parseInt(i / 4) + ((i + 1) % 4);
      continue;
    }
    for (let j = 0; j < 16 - i; j++) {
      if (numsMap[j + i] < numsMap[i]) {
        sum++;
      }
    }
  }
  return sum % 2 === 0;
};

/**
 * 打乱
 */
const scramble = () => {
  if (isStart.value || isWin.value) {
    clearInterval(timer);
    isStart.value = false;
    step.value = 0;
  }

  // 打乱
  const numsMap = gameMap.value.flat();

  do {
    numsMap.sort(() => Math.random() - 0.5);
  } while (!isSolvable(numsMap));

  // 重新赋值
  for (let i = 0; i < gameMap.value.length; i++) {
    for (let j = 0; j < gameMap.value[i].length; j++) {
      gameMap.value[i][j] = numsMap[i * 4 + j];
      gameHashMap.value.set(numsMap[i * 4 + j], { row: i, column: j });
    }
  }

  isScramble.value = true;
};

/**
 * 开始计时
 */
const timeStart = () => {
  timer = setInterval(() => {
    interval.value = new Date().getTime() - startTime;
  }, 10);
};

onMounted(() => {});
</script>
