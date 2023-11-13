import { defineStore } from "pinia";
import {
  formatTimestampByformatedDurationInGame,
  formatTimestampByformatedDurationInRecord,
  formatDurationInRecord,
} from "@/utils/time";

export const useUserStore = defineStore("user", {
  persist: true,

  state: () => ({
    user: null,
    userBestRecord: null,
    token: "",
  }),
  getters: {
    getBestSingleRecord() {
      if (this.userBestRecord) {
        return formatDurationInRecord(
          this.userBestRecord.bestSingle
        );
      }
      return null;
    },
    getBestAverageRecord() {
      if (this.userBestRecord) {
        return formatDurationInRecord(
          this.userBestRecord.bestAverage
        );
      }
      return null;
    }
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    setUserBestRecord(userBestRecord) {
      this.userBestRecord = userBestRecord;
    },
    setToken(token) {
      this.token = token;
    }
  },
});
