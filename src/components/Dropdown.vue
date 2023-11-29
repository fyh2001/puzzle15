<template>
  <div>
    <n-dropdown
      placement="bottom-start"
      trigger="click"
      size="large"
      :options="options"
      @select="selectHandler"
    >
      <n-button strong secondary color="#4f46e5" type="primary">
        {{ props.content }}
      </n-button>
    </n-dropdown>
  </div>
</template>

<script setup>
import { WbSunnyRound, SettingsRound, EventNoteRound, DarkModeRound } from "@vicons/material";
import { NIcon } from "naive-ui";
const emit = defineEmits(["select"]);

const props = defineProps({
  content: {
    type: String,
    default: "功能",
  },
  showDivider: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const options = [
  ...props.options,
  {
    key: "divider",
    show: props.options.length > 0 && props.showDivider,
    type: "divider",
  },
  {
    label: "深色模式",
    key: "dark",
    // disabled: true,
    icon: () => {
      return h(NIcon, {
        size: 18,
        class: "text-indigo-500",
        component: DarkModeRound,
      });
    },
    children: [
      {
        label: "开启",
        key: "darkOn",
        disabled: true,
        icon: () => {
          return h(NIcon, {
            size: 18,
            class: "text-blue-500",
            component: DarkModeRound,
          });
        },
      },
      {
        label: "关闭",
        key: "darkOff",
        disabled: true,

        icon: () => {
          return h(NIcon, {
            size: 18,
            class: "text-yellow-500",
            component: WbSunnyRound,
          });
        },
      },
    ],
  },
  {
    label: "设置",
    key: "setting",
    disabled: true,
    icon: () => {
      return h(NIcon, {
        size: 18,
        class: "text-indigo-500",
        component: SettingsRound,
      });
    },
  },
  {
    label: "更新日志",
    key: "updateLog",
    disabled: true,
    icon: () => {
      return h(NIcon, {
        size: 18,
        class: "text-indigo-500",
        component: EventNoteRound,
      });
    },
  },
];

const selectHandler = (key) => {
  switch (key) {
    case "darkOn":
      document.documentElement.setAttribute("data-theme", "dark");
      break;
    case "darkOff":
      document.documentElement.setAttribute("data-theme", "light");
      break;
    default:
      emit("select", key);
      break;
  }
};
</script>
