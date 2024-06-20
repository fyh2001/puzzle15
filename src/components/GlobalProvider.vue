<template>
  <div>
    <n-config-provider :theme="theme" :theme-overrides="themeColor">
      <n-global-style />
      <n-message-provider :max="2">
        <n-dialog-provider>
          <slot />
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script>
import { createDiscreteApi } from "naive-ui";
import { useMessage } from "naive-ui";
const { message, notification, dialog, loadingBar } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
  "loadingBar",
]);

window.$message = message;
window.$notification = notification;
window.$dialog = dialog;
window.$loadingBar = loadingBar;
</script>

<script setup>
import { computed, defineComponent, nextTick, onMounted, ref } from "vue";
import { darkTheme, lightTheme } from "naive-ui";
import { greenLightTheme, greenDarkTheme } from "@/theme/green.js";
import { indigoLightTheme, indigoDarkTheme } from "@/theme/indigo.js";
import { roseLightTheme, roseDarkTheme } from "@/theme/rose.js";
import { amberLightTheme, amberDarkTheme } from "@/theme/amber.js";
import { skyLightTheme, skyDarkTheme } from "@/theme/sky.js";
import { useThemeStore } from "@/store/themeStore.js";
//      preflight-style-disabled

const themeStore = useThemeStore();

const theme = computed(() => {
  return themeStore.darkMode ? darkTheme : lightTheme;
});
const themeColor = computed(() => {
  switch (themeStore.themeColor) {
    case "green":
      return themeStore.darkMode ? greenDarkTheme : greenLightTheme;
    case "indigo":
      return themeStore.darkMode ? indigoDarkTheme : indigoLightTheme;
    case "rose":
      return themeStore.darkMode ? roseDarkTheme : roseLightTheme;
    case "amber":
      return themeStore.darkMode ? amberDarkTheme : amberLightTheme;
    case "sky":
      return themeStore.darkMode ? skyDarkTheme : skyLightTheme;
    default:
      break;
  }
});
</script>
