import {
  formatTimestampByformatedDurationInGame,
  formatTimestampByformatedDurationInRecord,
  formatDurationInRecord,
} from "./time.js";

export const getAverageOf5 = (list) => {
  if (list.length < 5) return "";
  const last5 = list.slice(-5);
  // 计算五次成绩的去头尾平均
  last5.sort((a, b) => {
    return a.duration - b.duration;
  });
  last5.shift();
  last5.pop();

  const sum = last5.reduce((acc, cur) => {
    return acc + cur.duration;
  }, 0);
  return formatDurationInRecord((sum / 3).toFixed(0));
};

export const getAverageOf12 = (list) => {
  if (list.length < 12) return "";
  const last12 = list.slice(-12);

  // 计算十二次成绩的去头尾平均
  last12.sort((a, b) => {
    return a.duration - b.duration;
  });
  last12.shift();
  last12.pop();

  const sum = last12.reduce((acc, cur) => {
    return acc + cur.duration;
  }, 0);
  return formatDurationInRecord((sum / 10).toFixed(0));
};
