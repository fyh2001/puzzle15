<template>
  <div class="fixed inset-0 p-4 h-screen">
    <div class="flex justify-between items-center mb-6">
      <title-bar title="练习" />
      <dropdown :options="options" />
    </div>
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

<script setup lang="jsx">
import { computed, onMounted, ref } from "vue";
import router from "../../router";
import TitleBar from "@/components/TitleBar.vue";
import Dropdown from "@/components/Dropdown.vue";
import { useRecordStore } from "@/store/recordStore";
import { useUserStore } from "@/store/userStore";
import { useScrambleStore } from "@/store/scrambleStore";
import { formatDurationInGame } from "@/utils/time.js";
import {
  clickRules,
  getCellClass,
  createHashMap,
  isSolvable,
  getScramble,
  setNPerm,
} from "@/common/game.js";
import {
  encryptNum,
  decryptStr,
  generateRandomIdx,
} from "@/utils/encipherment.js";
import {
  ContentCopyRound,
  ContentPasteRound,
  CableRound,
  AddBoxRound,
  SensorDoorRound,
} from "@vicons/material";
import ClipboardJS from "clipboard";
import recordRequest from "@/api/methods/record";
import websocketRequest from "@/api/methods/websocket";

const recordStore = useRecordStore();
const userStore = useUserStore();
const scrambleStore = useScrambleStore();

// 4 * 4
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

const options = [
  // 复制打乱
  {
    label: "复制打乱",
    key: "copyScramble",
    disabled: false,
    icon: () => {
      return (
        <n-el class="flex items-center" style="color: var(--primary-color)">
          <n-icon size="18" component={ContentCopyRound} />
        </n-el>
      );
    },
    props: {
      onClick: () => {
        const clipboardText =
          scrambleStore.scramble.scrambleStr !== ""
            ? scrambleStore.scramble.scrambleStr
            : scrambleStore.scrambleByShare.scrambleStr;

        if (clipboardText !== "") {
          const res = ClipboardJS.copy(clipboardText);

          if (res) {
            window.$message.success("复制成功");
          } else {
            window.$message.error("复制失败");
          }
        } else {
          window.$message.error("打乱顺序为空");
        }
      },
    },
  },
  // 粘贴打乱
  {
    label: "粘贴打乱",
    key: "pasteScramble",
    disabled: false,
    icon: () => {
      return (
        <n-el class="flex items-center" style="color: var(--primary-color)">
          <n-icon size="18" component={ContentPasteRound} />
        </n-el>
      );
    },
    props: {
      onClick: () => {
        const clipboardText = ref("");

        window.$dialog.success({
          title: "粘贴打乱",
          content: () => {
            return (
              <div class="flex flex-col">
                <n-input
                  class="mt-2"
                  type="textarea"
                  rows={4}
                  placeholder="请将打乱顺序粘贴到下方"
                  v-model:value={clipboardText.value}
                />
              </div>
            );
          },
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: () => {
            if (clipboardText.value === "") {
              return window.$message.error("打乱顺序为空");
            }

            const { t, idx } = decryptStr(clipboardText.value);

            if (generateRandomIdx(t) !== idx) {
              return window.$message.error("识别有误,请注意输入");
            }

            scrambleMap = setNPerm(gameMap.value.flat(), idx, 16, true); // 保存打乱顺序
            formData.ri = idx;

            // 重新赋值
            for (let i = 0; i < gameMap.value.length; i++) {
              for (let j = 0; j < gameMap.value[i].length; j++) {
                gameMap.value[i][j] = scrambleMap[i * 4 + j];
                gameHashMap.value.set(scrambleMap[i * 4 + j], {
                  row: i,
                  column: j,
                });
              }
            }

            isScramble.value = true;
          },
        });
      },
    },
  },
  {
    label: "对战",
    key: "match",
    disabled: false,
    icon: () => {
      return (
        <n-el class="flex items-center" style="color: var(--primary-color)">
          <n-icon size="18" component={CableRound} />
        </n-el>
      );
    },
    children: [
      {
        label: "创建房间",
        key: "createRoom",
        disabled: false,
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={AddBoxRound} />
            </n-el>
          );
        },
        props: {
          onClick: async () => {
            const { data } = await websocketRequest.createRoom();

            if (data.code === 200) {
              const roomId = data.data;
              console.log("create room success: ", roomId);

              window.$message.success("创建成功");
              router.push({
                name: "MatchRoom",
                params: { roomId },
              });
            } else {
              window.$message.error("创建失败");
            }
          },
        },
      },
      {
        label: "加入房间",
        key: "joinRoom",
        disabled: false,
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={SensorDoorRound} />
            </n-el>
          );
        },
        props: {
          onClick: () => {
            const roomId = ref("");

            window.$dialog.success({
              title: "加入房间",
              content: () => {
                return (
                  <div class="flex flex-col">
                    <n-input
                      class="mt-2"
                      placeholder="请输入房间号"
                      v-model:value={roomId.value}
                    />
                  </div>
                );
              },
              positiveText: "确定",
              negativeText: "取消",
              onPositiveClick: async () => {
                if (roomId.value === "") {
                  return window.$message.error("房间号不能为空");
                }

                const { data } = await websocketRequest.checkRoom(roomId.value);

                if (data.code === 200) {
                  window.$message.success("加入成功");
                  router.push({
                    name: "MatchRoom",
                    params: { roomId: roomId.value },
                  });
                } else {
                  window.$message.error(data.msg);
                }
              },
            });
          },
        },
      },
    ],
  },
];

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
  if (scrambleStore.scramble.scrambleStr !== "") {
    return window.$message.error("请先完成本次还原");
  }

  clearInterval(timer);
  isStart.value = false;
  isWin.value = false;
  stepCount.value = 0;
  scrambleMap = [];
  solution = [];

  // 打乱
  let numsMap = gameMap.value.flat();

  const timestamp = Date.now();

  const { scramble, randomIdx } = getScramble(numsMap, timestamp);
  formData.ri = randomIdx;
  scrambleStore.setScramble(encryptNum(timestamp, randomIdx), randomIdx);
  scrambleMap = scramble; // 保存打乱顺序

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
    interval.value = Date.now() - startTime;
  }, 10);
};

/**
 * 保存记录
 */
const saveRecord = async () => {
  // 保存到 store 中的未上传记录
  const dateTime = Date.now();
  const record = {
    post: {
      event: "p15",
      duration: endTime.value - startTime,
      stepCount: stepCount.value,
      scramble: scrambleMap.toString(),
      solution: solution.toString(),
    },
    params: {
      ...formData,
      // ri: formData.ri,
    },
  };

  recordStore.addUnUploadRecord({
    ...record,
    dateTime,
  });

  if (userStore.token === "") return;

  // 保存到数据库
  const { data } = await recordRequest.create(record);
  if (data.code === 200) {
    recordStore.deleteUnUploadRecordByDateTime(dateTime);
    window.$message.success("保存成功");
  } else {
    window.$message.error("保存失败");
  }
};

/**
 * 初始化游戏地图
 */
const initGameMap = () => {
  if (scrambleStore.scramble.scrambleStr === "") return;

  const scramble = setNPerm(
    gameMap.value.flat(),
    parseInt(scrambleStore.scramble.scrambleIdx),
    16,
    true
  );

  scrambleMap = scramble; // 保存打乱顺序
  formData.ri = scrambleStore.scramble.scrambleIdx;

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
  initGameMap();
});
</script>
