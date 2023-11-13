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
  }),
  getters: {
    getRecord() {
      return this.record.map((item, itemIndex) => {
        const index = itemIndex + 1;
        const ao5 = getAverageOf5(this.record.slice(0, index));
        const ao12 = getAverageOf12(this.record.slice(0, index));
        const duration = formatDurationInRecord(item.duration);

        return {
          ...item,
          index,
          duration,
          ao5,
          ao12,
        };
      });
    },
    getUnUploadRecord() {
      return this.unUploadRecord.map((item, itemIndex) => {
        const index = itemIndex + 1;
        const ao5 = getAverageOf5(this.unUploadRecord.slice(0, index));
        const ao12 = getAverageOf12(this.unUploadRecord.slice(0, index));
        const duration = formatDurationInRecord(item.duration);

        return {
          ...item,
          index,
          duration,
          ao5,
          ao12,
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
  },
});
