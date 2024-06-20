// 引入 CryptoJS 库
import CryptoJS from "crypto-js";
import { encryptedVersion, privateKey } from "../config/index.js";

// 辅助函数：计算阶乘
function factorial(num) {
  if (num === 0 || num === 1) {
    return 1;
  }
  return num * factorial(num - 1);
}

/**
 * 生成随机数的函数
 * @param {*} timestamp 时间戳
 * @returns 返回一个随机数
 */
export const generateRandomNum = (timestamp) => {
  return timestamp % factorial(10);
};

/**
 * 生成密钥的函数
 * @param {*} timestamp 时间戳
 * @returns 返回一个密钥
 */
export const generateSecretKey = (timestamp) => {
  // 生成密钥
  const timestampStr = timestamp.toString() + privateKey[encryptedVersion];

  return CryptoJS.SHA256(timestampStr).toString(CryptoJS.enc.Hex);
};

/**
 * 生成随机值的函数
 * @param {*} key 指定的密钥
 * @param {*} randomNum 随机值
 * @returns 返回一个随机值
 */
export const generateRandomIdx_old = (key, randomNum) => {
  // 构造一个字符串，包含时间戳和(n-i)!至(n-1)!的相关信息
  const inputString = `${key}_${randomNum}`;

  // 进行SHA-256加密
  const sha256Result = CryptoJS.SHA256(inputString);

  // 截取前13个字符
  const truncatedHash = sha256Result
    .toString(CryptoJS.enc.Hex)
    .substring(0, 13);

  // 将加密后的结果转为整数
  const encryptedInteger = parseInt(truncatedHash, 16);

  return encryptedInteger;
};

/**
 * 生成随机值的函数
 * @param {*} timestamp 时间戳
 * @returns 返回一个随机值
 */
export const generateRandomIdx = (timestamp) => {
  const inputString = timestamp.toString() + privateKey[encryptedVersion];

  // 进行SHA-256加密
  const sha256Result = CryptoJS.SHA256(inputString);

  // 进行SHA-256加密
  const sha256Result2 = CryptoJS.SHA256(sha256Result);

  // 截取前13个字符
  const truncatedHash = sha256Result2
    .toString(CryptoJS.enc.Hex)
    .substring(0, 13);

  // 将加密后的结果转为整数(16进制)
  const encryptedInteger = parseInt(truncatedHash, 16);

  return encryptedInteger;
};

/**
 * 将数字和字符串进行一个可解密的加密, 结果不能包含数字
 * @param {number} t 需要加密的数字1
 * @param {number} idx 需要加密的数字2
 * @returns {string} 返回加密后的字符串
 */
export const encryptNum = (t, idx) => {
  const numStr = t.toString();
  const numStr2 = idx.toString();

  let result = "";

  for (let i = 0; i < numStr.length; i++) {
    const t = parseInt(numStr[i]);

    result += String.fromCharCode(t + 41);
  }

  result += "_"

  for (let i = 0; i < numStr2.length; i++) {
    const idx = parseInt(numStr2[i]);

    result += String.fromCharCode(idx + 61);
  }

  return result;
};

/**
 * 将字符串进行解密
 * @param {string} str 需要解密的字符串
 * @returns {number, number} 返回解密后t和idx
 */
export const decryptStr = (str) => {

  console.log(str)

  let t = "";
  let idx = "";

  str.split("_").forEach((item, index) => {
    if (index === 0){
      for (let i = 0; i < item.length; i++) {
        const t1 = item.charCodeAt(i) - 41;

        t += t1.toString();
      }
    }else if (index === 1){
      for (let i = 0; i < item.length; i++) {
        const idx1 = item.charCodeAt(i) - 61;

        idx += idx1.toString();
      }
    }
  })

  return {
    t: parseInt(t),
    idx: parseInt(idx)
  }
};