import {
  formatTimestampByformatedDurationInGame,
  formatTimestampByformatedDurationInRecord,
  formatDurationInRecord
} from "./time.js";

export const getAverageOf5 = (list) => {
  if (list.length < 5) return "";
  const last5 = list.slice(-5);
  const sum = last5.reduce((acc, cur) => {
    return acc + cur.duration;
  }, 0);
  return formatDurationInRecord((sum / 5).toFixed(0));
};

export const getAverageOf12 = (list) => {
  if (list.length < 12) return "";
  const last12 = list.slice(-12);
  const sum = last12.reduce((acc, cur) => {
    return acc + cur.duration;
  }, 0);
  return formatDurationInRecord((sum / 12).toFixed(0));
};
