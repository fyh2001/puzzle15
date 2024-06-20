<template>
  <div class="p-4">
    <div>
      <div class="flex gap-10">
        <div>玩家1</div>
        <div>{{ playerId }} - {{ playerNickname }}</div>
      </div>
      <div>
        <n-input v-model:value="playerMessage.type" placeholder="消息类型" />
        <n-input v-model:value="playerMessage.msg" placeholder="消息" />
        <n-button @click="sentMessang(ws1, playerMessage.type, playerMessage.msg)">发送</n-button>
      </div>
    </div>
    <div class="mt-4">
      <div class="flex gap-10">
        <div>玩家2</div>
        <div>{{ player2Id }} - {{ player2Nickname }}</div>
      </div>
      <div>
        <n-input v-model:value="player2Message.type" placeholder="消息类型" />
        <n-input v-model:value="player2Message.msg" placeholder="消息" />
        <n-button @click="sentMessang(ws2, player2Message.type, player2Message.msg)">发送</n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from "@/store/themeStore.js";
import axios from "axios";
const themeStore = useThemeStore();

let roomId = null;

let playerId = 1;
let playerNickname = "黄叶";
const ws1 = ref(null);
const playerMessage = ref({
  msg: "",
  type: "",
});

let player2Id = 2;
let player2Nickname = "小明";
const ws2 = ref(null);
const player2Message = ref({
  msg: "",
  type: "",
});

const create = async () => {
  const { data } = await axios.get(
    `http://localhost:8081/api/websocket/createRoom`
  );

  if (data.code === 200) {
    console.log("create room success: ", JSON.stringify(data));

    roomId = data.data;
  }
};

const join = async (playerId, playerNickname) => {
  const { data } = await axios.get(
    `http://localhost:8081/api/websocket/joinRoom?roomId=${roomId}&playerId=${playerId}&playerNickname=${playerNickname}`
  );

  if (data.code === 200) {
    console.log("join room success: ", data);
  }
};

const initializeWebSocket = (ws, roomId, playerId, playerNickname) => {
  ws.value = new WebSocket(
    `ws://localhost:8081/api/websocket/ws?roomId=${roomId}&playerId=${playerId}&playerNickname=${playerNickname}`
  );

  ws.value.onopen = (event) => {
    console.log("ws open: ", event);

    ws.value.send(
      JSON.stringify({
        type: "start",
        msg: "start",
      })
    );
  };

  ws.value.onmessage = (msg) => {
    console.log("ws message: ", JSON.parse(msg.data));
  };

  ws.value.onclose = (event) => {
    console.log("ws close: ", event);
  };

  ws.value.onerror = (err) => {
    console.log("ws error: ", err);
  };
};

const sentMessang = (ws, type, data) => {
  ws.send(
    JSON.stringify({
      type,
      data,
    })
  );
};

(async () => {
  await create();
  // await join(playerId, playerNickname);
  // await join(player2Id, player2Nickname);

  initializeWebSocket(ws1, roomId, playerId, playerNickname);
  initializeWebSocket(ws2, roomId, player2Id, player2Nickname);
})();
</script>
