import { defineStore } from "pinia";

export const useScrambleStore = defineStore("scramble", {
  persist: true,

  state: () => ({
    scramble: {
      scrambleStr: "",
      scrambleIdx: 0,
    },
    scrambleByShare: {
      scrambleStr: "",
      scrambleIdx: 0,
    },
  }),

  actions: {
    setScramble(str, idx) {
      this.scramble = {
        scrambleStr: str,
        scrambleIdx: idx,
      };
    },

    setScrambleByShare(str, idx) {
      this.scrambleByShare = {
        scrambleStr: str,
        scrambleIdx: idx,
      };
    },

    clearScramble() {
      this.scramble = {
        scrambleStr: "",
        scrambleIdx: 0,
      };
    },

    clearScrambleByShare() {
      this.scrambleByShare = {
        scrambleStr: "",
        scrambleIdx: 0,
      };
    },
  },
});
