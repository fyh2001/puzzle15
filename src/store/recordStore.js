import { defineStore } from "pinia";
import { getAverageOf5, getAverageOf12 } from "@/utils/record";
import {
  formatTimestampByformatedDurationInGame,
  formatTimestampByformatedDurationInRecord,
  formatDurationInRecord,
} from "@/utils/time";
export const useRecordStore = defineStore("record", {
  persist: true,

  state: () => ({
    record: [],
    unUploadRecord: [],
    bestSingleRecord: [],
    bestAverage5Record: [],
    bestAverage12Record: [],
    bestStepCountRecord: [],

    recordDetailParams: {},
  }),
  getters: {
    getRecord() {
      return this.record.map((item, itemIndex) => {
        const ao5 = getAverageOf5(this.record.slice(itemIndex, itemIndex + 5));
        const ao12 = getAverageOf12(this.record.slice(itemIndex, itemIndex + 12));
        const duration = formatDurationInRecord(item.duration);

        return {
          ...item,
          duration,
          ao5,
          ao12,
        };
      }).slice(0,10)
    },

    getUnUploadRecord() {
      return this.unUploadRecord.map((item, itemIndex) => {
        const index = itemIndex + 1;
        const ao5 = getAverageOf5(this.unUploadRecord.slice(0, index));
        const ao12 = getAverageOf12(this.unUploadRecord.slice(0, index));
        const duration = formatDurationInRecord(item.post.duration);

        return {
          ...item,
          index,
          duration,
          ao5,
          ao12,
          stepCount: item.post.stepCount,
        };
      });
    },

    getBestSingleRecord() {
      return this.bestSingleRecord?.map((item, itemIndex) => {
        const rank = itemIndex + 1;
        const duration = formatDurationInRecord(item.bestSingleDuration);
        const stepCount = item.bestSingleStepCount;
        return {
          ...item,
          rank,
          duration,
          stepCount
        };
      });
    },

    getBestAverage5Record() {
      return this.bestAverage5Record?.map((item, itemIndex) => {
        const rank = itemIndex + 1;
        const duration = formatDurationInRecord(item.bestAverageDuration);
        return {
          ...item,
          rank,
          duration,
        };
      });
    },

    getBestAverage12Record() {
      return this.bestAverage12Record?.map((item, itemIndex) => {
        const rank = itemIndex + 1;
        const duration = formatDurationInRecord(item.bestAverageDuration);
        return {
          ...item,
          rank,
          duration,
        };
      });
    },

    getBestStepCountRecord() {
      return this.bestStepCountRecord?.map((item, itemIndex) => {
        const rank = itemIndex + 1;
        const stepCount = item.bestStepCount;
        return {
          ...item,
          rank,
          stepCount,
        };
      });
    }
  },
  actions: {
    setRecord(record) {
      this.record = record;
    },
    addRecord(record) {
      this.record.push(record);
    },
    clearRecord() {
      this.record = [];
    },
    deleteRecordById(id) {
      this.record = this.record.filter((item) => item.id !== id);
    },
    updateRecord(record) {
      const index = this.record.findIndex((item) => item.id === record.id);
      for (const key in record) {
        this.record[index][key] = record[key];
      }
    },

    setUnUploadRecord(record) {
      this.unUploadRecord = record;
    },
    addUnUploadRecord(record) {
      this.unUploadRecord.push(record);
    },
    clearUnUploadRecord() {
      this.unUploadRecord = [];
    },
    deleteUnUploadRecordByDateTime(dateTime) {
      this.unUploadRecord = this.unUploadRecord.filter(
        (item) => item.dateTime !== dateTime
      );
    },
    updateUnUploadRecord(record) {
      const index = this.unUploadRecord.findIndex(
        (item) => item.id === record.id
      );
      for (const key in record) {
        this.unUploadRecord[index][key] = record[key];
      }
    },

    setBestSingleRecord(record) {
      this.bestSingleRecord = record;
    },
    setBestAverage5Record(record) {
      this.bestAverage5Record = record;
    },
    setBestAverage12Record(record) {
      this.bestAverage12Record = record;
    },
    setBestStepCountRecord(record) {
      this.bestStepCountRecord = record;
    },

    setRecordDetailParams(params) {
      this.recordDetailParams = params;
    }
  },
});
