import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  persist: true,

  state: () => ({
    // 深色模式/浅色模式
    darkMode: false,
    // 主题色
    themeColor: "green",
  }),

  getters: {
    // 深色模式/浅色模式
    getDarkMode() {
      return this.darkMode;
    },

    // 主题色
    getThemeColor() {
      return this.themeColor;
    },
  },

  actions: {
    // 打开深色模式
    openDarkMode() {
      this.darkMode = true;
    },

    // 关闭深色模式
    closeDarkMode() {
      this.darkMode = false;
    },

    // 切换主题色
    changeThemeColor(color) {
      this.themeColor = color;
    }
  },
});
