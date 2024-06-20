import {
  generateRandomNum,
  generateSecretKey,
  generateRandomIdx,
} from "../utils/encipherment.js";
import { useThemeStore } from "../store/themeStore.js";
// 表格分组
const redGroup = new Set([1, 2, 3, 4, 5, 9, 13]);
const blueGroup = new Set([6, 7, 8, 10, 14]);
const yellowGroup = new Set([11, 12, 15]);

/**
 * 获取单元格样式
 * @param {number} itemValue 单元格值
 * @returns {string} 样式类名
 */
export const getCellClass = (itemValue) => {
  const themeStore = useThemeStore();

  const darkMode = themeStore.darkMode;

  if (darkMode) {
    if (redGroup.has(itemValue)) return "bg-red-4 shadow";
    if (blueGroup.has(itemValue)) return "bg-blue-4 shadow";
    if (yellowGroup.has(itemValue)) return "bg-yellow-4 shadow";
    return "";
  }

  if (redGroup.has(itemValue)) return "bg-red-4 shadow";
  if (blueGroup.has(itemValue)) return "bg-blue-4 shadow";
  if (yellowGroup.has(itemValue)) return "bg-yellow-4 shadow";
  return "";
};

/**
 * 创建游戏地图哈希表
 * @param {number[][]} arr 二维数组
 * @returns {Map<number, {row: number, column: number}>} 哈希表
 */
export const createHashMap = (arr) => {
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
};

/**
 * 根据打乱字符串获取游戏地图
 * @param {string} scramble 打乱字符串
 * @returns {number[][]} 游戏地图
 */
export const getGameMapByScramble = (scramble) => {
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
 * 点击规则
 * @param {Ref<number[][]>} gameMap 游戏地图
 * @param {Ref<Map<number, { row: number; column: number }>>} gameHashMap 游戏地图哈希表
 * @param {number} row 点击的单元格的行
 * @param {number} column 点击的单元格的列
 * @param {number} value 点击的单元格的值
 */
export const clickRules = (
  gameMap,
  gameHashMap,
  row = -1,
  column = -1,
  value = -1
) => {
  let newSolution = "";
  let newStepCount = 0;
  const newGameMap = gameMap;
  const newGameHashMap = gameHashMap;

  // 获取点击单元格的坐标
  if (row === -1 && column === -1 && value !== -1) {
    row = gameHashMap.get(value).row;
    column = gameHashMap.get(value).column;
  }

  // 获取点击单元格的值
  const item = newGameMap[row][column];
  // 点击的是空白单元格
  if (item === null)
    return {
      newSolution,
      newStepCount,
      newGameMap,
      newGameHashMap,
    };

  // 获取空白单元格的坐标
  const nullRow = newGameHashMap.get(null).row;
  const nullColumn = newGameHashMap.get(null).column;

  // 同一行
  if (row == nullRow) {
    // 点击的单元格在空白单元格的右边
    if (column > nullColumn) {
      // 保存移动的单元格
      newSolution = item;
      // 步数加一
      newStepCount++;
      for (let i = nullColumn; i < column; i++) {
        newGameMap[row][i] = newGameMap[row][i + 1];
        newGameHashMap.set(newGameMap[row][i + 1], {
          row: row,
          column: i,
        });
      }
    }
    // 点击的单元格在空白单元格的左边
    else if (column < nullColumn) {
      // 保存移动的单元格
      newSolution = item;
      // 步数加一
      newStepCount++;
      for (let i = nullColumn; i > column; i--) {
        newGameMap[row][i] = newGameMap[row][i - 1];
        newGameHashMap.set(newGameMap[row][i - 1], {
          row: row,
          column: i,
        });
      }
    }
    newGameMap[row][column] = null;
    newGameHashMap.set(null, { row: row, column: column });
  }

  // 同一列
  if (column == nullColumn) {
    // 点击的单元格在空白单元格的下边
    if (row > nullRow) {
      // 保存移动的单元格
      newSolution = item;
      // 步数加一
      newStepCount++;
      for (let i = nullRow; i < row; i++) {
        newGameMap[i][column] = newGameMap[i + 1][column];
        newGameHashMap.set(newGameMap[i + 1][column], {
          row: i,
          column: column,
        });
      }
    }
    // 点击的单元格在空白单元格的上边
    else if (row < nullRow) {
      // 保存移动的单元格
      newSolution = item;
      // 步数加一
      newStepCount++;
      for (let i = nullRow; i > row; i--) {
        newGameMap[i][column] = newGameMap[i - 1][column];
        newGameHashMap.set(newGameMap[i - 1][column], {
          row: i,
          column: column,
        });
      }
    }
    newGameMap[row][column] = null;
    newGameHashMap.set(null, { row: row, column: column });
  }

  return {
    newSolution,
    newStepCount,
    newGameMap,
    newGameHashMap,
  };
};

/**
 * 判断是否可解
 * @param {number[][]} numsMap 二维数组
 * @returns {boolean} 是否可解
 */
export const isSolvable = (numsMap) => {
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
 * 根据idx获取n阶排列
 * @param {*} arr 需要排列的数组
 * @param {*} idx 需要指定的idx - idx范围为[0,(n-1)!]
 * @param {*} n 需要指定的n
 * @param {*} ensureEven 是否保证偶数
 * @returns {number[]} 返回排列后的数组
 * @description 该函数用于生成n阶排列，idx为排列的序号，n为阶数，ensureEven为是否保证偶数
 */
export const setNPerm = (arr, idx, n, ensureEven) => {
  const even = ensureEven ? 1 : 0;
  let parity = 0;

  arr[n - 1] = even;

  if (ensureEven) {
    arr[n - 2] = null;
  }

  for (let i = n - 2 - even; i >= 0; i--) {
    arr[i] = idx % (n - i) === 0 ? null : idx % (n - i);
    parity ^= arr[i];
    idx = Math.floor(idx / (n - i));

    for (let j = i + 1; j < n; j++) {
      if (arr[j] >= arr[i]) {
        arr[j]++;
      }
    }
  }

  if (ensureEven && (parity & 1) !== 0) {
    const temp = arr[n - 1];
    arr[n - 1] = arr[n - 2];
    arr[n - 2] = temp;
  }

  // 判断是否可解
  if (!isSolvable(arr)) {
    // 如果不可解, 交换最后两个元素, 保证可解.但若其中一个元素为null, 则交换倒数第三个元素
    if (arr[n - 1] === null) {
      const temp = arr[n - 2];
      arr[n - 2] = arr[n - 3];
      arr[n - 3] = temp;
    }

    const temp = arr[n - 1];
    arr[n - 1] = arr[n - 2];
    arr[n - 2] = temp;
  }

  return arr;
};

/**
 * 获取打乱数组
 * @param {*} arr 需要打乱的数组
 * @param {*} timestamp 时间戳
 * @returns {number[]} 返回打乱后的数组
 */
export const getScramble = (arr, timestamp) => {
  // const randomNum = generateRandomNum(timestamp);
  // const secretKey = generateSecretKey(timestamp);

  const randomIdx = generateRandomIdx(timestamp);

  return {
    scramble: setNPerm(arr, randomIdx, 16, true),
    randomIdx,
  };
};
