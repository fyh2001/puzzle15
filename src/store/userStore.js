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
    userBestSingleRecord: null,
    userBestAverage5Record: null,
    userBestAverage12Record: null,
    userBestStepCountRecord: null,
    token: "",
  }),
  getters: {
    getBestSingleRecord() {
      if (this.userBestSingleRecord) {
        const duration = formatDurationInRecord(this.userBestSingleRecord.bestSingleDuration);
        const stepCount = this.userBestSingleRecord.bestSingleStepCount;
        return {
          ...this.userBestSingleRecord,
          duration,
          stepCount
        };
      }
      return null;
    },
    getBestAverage5Record() {
      if (this.userBestAverage5Record) {
        const duration = formatDurationInRecord(this.userBestAverage5Record.bestAverageDuration);
        return {
          ...this.userBestAverage5Record,
          duration,
        };
      }
      return null;
    },
    getBestAverage12Record() {
      if (this.userBestAverage12Record) {
        const duration = formatDurationInRecord(this.userBestAverage12Record.bestAverageDuration);
        return {
          ...this.userBestAverage12Record,
          duration,
        };
      }
      return null;
    },
    getBestStepCountRecord() {
      if (this.userBestStepCountRecord) {
        const stepCount = this.userBestStepCountRecord.bestStepCount;
        return {
          ...this.userBestStepCountRecord,
          stepCount,
        };
      }
      return null;
    }
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    setUserBestSingleRecord(userBestSingleRecord) {
      this.userBestSingleRecord = userBestSingleRecord;
    },
    setUserBestAverage5Record(userBestAverageRecord) {
      this.userBestAverage5Record = userBestAverageRecord;
    },
    setUserBestAverage12Record(userBestAverageRecord) {
      this.userBestAverage12Record = userBestAverageRecord;
    },
    setUserBestStepCountRecord(userBestStepCountRecord) {
      this.userBestStepCountRecord = userBestStepCountRecord;
    },
    setToken(token) {
      this.token = token;
    }
  },
});
