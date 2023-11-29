/**
 * 格式化毫秒数为时间字符串(00:00.000) - 首页内使用
 * @param {*} duration 毫秒数
 * @returns {string} 格式化后的时间字符串(00:00.000)
 */
export const formatDurationInGame = (duration) => {
  const millisecond = duration % 1000;
  const second = parseInt(duration / 1000) % 60;
  const minute = parseInt(duration / 1000 / 60) % 60;
  return `${minute < 10 ? "0" + minute : minute}:${
    second < 10 ? "0" + second : second
  }.${
    millisecond < 100
      ? millisecond < 10
        ? "00" + millisecond
        : "0" + millisecond
      : millisecond
  }`;
};

/**
 * 格式化毫秒数为时间字符串(00:00.000) - 记录内使用
 * @param {*} duration 毫秒数
 * @returns {string} 格式化后的时间字符串(00:00.000)
 */
export const formatDurationInRecord = (duration) => {
  const millisecond = duration % 1000;
  const second = parseInt((duration / 1000) % 60);
  const minute = parseInt(duration / 1000 / 60) % 60;

  if (minute == 0) {
    return `${second < 10 ? "0" + second : second}.${
      millisecond < 100
        ? millisecond < 10
          ? "00" + millisecond
          : "0" + millisecond
        : millisecond
    }`;
  }

  return `${minute < 10 ? "0" + minute : minute}:${
    second < 10 ? "0" + second : second
  }:${
    millisecond < 100
      ? millisecond < 10
        ? "00" + millisecond
        : "0" + millisecond
      : millisecond
  }`;
};

/**
 * 格式化首页内时间字符串(00:00.000)为毫秒数
 * @param {*} formatedDuration 格式化后的时间字符串(00:00.000)
 * @returns {number} 毫秒数
 */
export const formatTimestampByformatedDurationInGame = (formatedDuration) => {
  const [minute, second, millisecond] = formatedDuration.split(":");
  return (
    parseInt(minute) * 60 * 1000 +
    parseInt(second) * 1000 +
    parseInt(millisecond)
  );
};

/**
 * 格式化记录内时间字符串(00:00.000)为毫秒数
 * @param {*} formatedDuration 格式化后的时间字符串(00:00.000)
 * @returns {number} 毫秒数
 */
export const formatTimestampByformatedDurationInRecord = (formatedDuration) => {

  const [minute, second, millisecond] = formatedDuration.split(/[:.]/);


  console.log(minute, second, millisecond);
  return (
    parseInt(minute) * 60 * 1000 +
    parseInt(second) * 1000 +
    parseInt(millisecond)
  );
};
