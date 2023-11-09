<template>
  <div>
    <div :style="{ fontSize: textSize, color: textColor }">{{ title }}</div>
  </div>
</template>

<script setup>

const props = defineProps({
  title: String, //标题
  /**
   * 标题字体大小
   * @default 26px
   */
  textSize: {
    type: String,
    default: "26px"
  },

  /**
   * 标题字体颜色
   * @default #000
   */
  textColor: {
    type: String,
    default: "#000"
  }
});
</script>
