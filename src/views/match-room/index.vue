<script setup>
import titleBar from "@/components/TitleBar.vue";
import game from "./map/game.vue";
import { defalutAvatar } from "@/config/index.js";
import { useUserStore } from "@/store/userStore";
import { baseURL } from "@/api/index.js";
import userRequest from "@/api/methods/user";
import websocketRequest from "@/api/methods/websocket";
import router from "../../router";

const userStore = useUserStore();

const props = defineProps({
  roomId: {
    type: String,
    default: "",
  },
});

// websocket实例
const websocket = ref(null);
// 游戏是否开始
const start = ref(false);
// 打乱信息
const scrambleInfo = ref({
  scramble: "",
  idx: "",
});

// 玩家列表
const players = ref([
  {
    id: userStore.user.id,
    username: userStore.user.username,
    nickname: userStore.user.nickname,
    avatar: userStore.user.avatar,
    isReady: false,
  },
  {
    id: "",
    username: "",
    nickname: "等待玩家加入",
    avatar: "",
  },
]);

const checkRoom = async (roomId) => {
  const { data } = await websocketRequest.checkRoom(roomId);

  if (data.code !== 200) {
    new WebSocket(
      `ws://${baseURL.replace("http://", "")}/websocket/ws?roomId=${
        props.roomId
      }&userId=${userId}`
    );

    window.$message.error(data.msg);
    router.push("/");
  }
};

const initializeWebSocket = (ws, userId) => {
  ws.value = new WebSocket(
    `ws://${baseURL.replace("http://", "")}/websocket/ws?roomId=${
      props.roomId
    }&userId=${userId}`
  );

  ws.value.onopen = (event) => {
    ws.value.send(
      JSON.stringify({
        type: "join",
        msg: "加入",
      })
    );
  };

  ws.value.onmessage = async (msg) => {
    const parseMsg = JSON.parse(msg.data);

    // 有玩家加入
    if (parseMsg.type === "join") {
      const player = parseMsg.userList.find(
        (user) => user.userId !== userStore.user.id
      );

      await getUserInfoByUserId(player?.userId);
      updatePlayer(parseMsg.userList);

      const joinPlayer = players.value.find(
        (player) => player.id === parseMsg.userList.slice(-1)[0].userId
      );

      window.$message.success("玩家 " + joinPlayer.nickname + " 加入房间");
    }

    // 有玩家准备
    if (parseMsg.type === "ready") {
      const readyPlayer = players.value.find(
        (player) => player.id === parseMsg.userList[0].userId
      );

      readyPlayer.isReady = true;

      window.$message.success("玩家 " + readyPlayer.nickname + " 准备");
    }

    // 有玩家取消准备
    if (parseMsg.type === "unready") {
      const unreadyPlayer = players.value.find(
        (player) => player.id === parseMsg.userList[0].userId
      );

      unreadyPlayer.isReady = false;

      window.$message.success("玩家 " + unreadyPlayer.nickname + " 取消准备");
    }

    if (parseMsg.type === "getScramble") {
      console.log(parseMsg);
      scrambleInfo.value = parseMsg.scrambleInfo;
    }
  };

  ws.value.onclose = (event) => {
    console.log("ws close: ", event);
  };

  ws.value.onerror = (err) => {
    console.log("ws error: ", err);
  };
};

const getUserInfoByUserId = async (id) => {
  const { data } = await userRequest.getById(id);

  console.log(data);

  if (data.code === 200) {
    players.value[1] = {
      id: data.data.id,
      username: data.data.username,
      nickname: data.data.nickname,
      avatar: data.data.avatar,
      isReady: false,
    };
  }
};

const ready = () => {
  websocket.value.send(
    JSON.stringify({
      type: "ready",
      msg: "ready",
    })
  );
};

const unready = () => {
  websocket.value.send(
    JSON.stringify({
      type: "unready",
      msg: "unready",
    })
  );
};

const updatePlayer = (userList) => {
  userList.forEach((user) => {
    const player = players.value.find((player) => player.id === user.userId);

    player.isReady = user.isReady;
  });
};

onMounted(async () => {
  await checkRoom(props.roomId);

  initializeWebSocket(websocket, players.value[0].id);

  watch(
    () => players.value,
    (newVal) => {
      if (newVal[0].isReady && newVal[1].isReady) {
        window.$message.success("3秒后游戏开始");
        websocket.value.send(
          JSON.stringify({
            type: "start",
            msg: "start",
          })
        );
        setTimeout(() => {
          start.value = true;
          websocket.value.send(
            JSON.stringify({
              type: "getScramble",
              msg: "getScramble",
            })
          );
        }, 3000);
      }
    },
    {
      deep: true,
    }
  );
});

onBeforeUnmount(() => {
  websocket.value.close();
});
</script>

<template>
  <div class="p-4 h-screen">
    <div class="flex items-center gap-4 mb-6">
      <title-bar title="对战" />
      <n-tag :bordered="false" type="success">
        房间号: {{ props.roomId }}
      </n-tag>
    </div>

    <div class="flex flex-col justify-around" v-if="!start">
      <n-el
        class="py-10 mt-4 w-full rounded-2xl shadow bg-cover overflow-hidden"
        :class="{ 'ring-3': data.isReady }"
        style="background: var(--user-card-background-color)"
        v-for="(data, index) in players"
        :key="index"
        @click="index === 0 && (data.isReady ? unready() : ready())"
      >
        <div class="relative flex justify-around items-center z-100">
          <!-- 头像与昵称 -->
          <div class="text-center">
            <n-avatar
              class="mb-6 shadow"
              object-fit="cover"
              round
              :size="100"
              :src="data.avatar !== '' ? data.avatar : defalutAvatar"
              :fallback-src="defalutAvatar"
            />
            <div class="text-5">{{ data.nickname }}</div>
          </div>
        </div>
      </n-el>
    </div>

    <game
      :scramble-str="scrambleInfo.scramble"
      :scramble-idx="scrambleInfo.idx"
      v-if="start"
    />
  </div>
</template>
