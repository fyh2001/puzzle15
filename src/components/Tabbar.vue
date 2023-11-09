<template>
  <div class="w-full py-3 bg-[#99CC33] rounded-4 overflow-hidden">
    <!-- 选择框 -->
    <div
      class="absolute left-0 h-10 rounded-xl bg-[#669933] transition-all duration-300"
      :style="{
        width: boxRect.width + 'px',
        transform: 'translateX(' + boxRect.left + 'px)',
      }"
    />
    <!-- 图标与标题 -->
    <div ref="tabItemRef" class="flex justify-around items-center">
      <div
        class="flex items-center px-3 py-1 gap-2 text-white font-bold z-100"
        v-for="(data, index) in tabsContent"
        :key="index"
        @click="tabIndex = index"
      >
        <div class="text-3xl" :class="data.icon" />
        <div
          class="text-sm transition-all duration-300"
          :class="
            tabIndex === index ? 'opacity-100' : 'opacity-0 -translate-x-1/2'
          "
        >
          {{ tabIndex === index ? data.text : "" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  tabsContent: Array, // tabbar的内容
});

// tabbar的dom节点
const tabItemRef = ref(null);

// 盒子位置
const boxRect = ref({
  width: 0,
  left: 0,
});

// 当前下标
const tabIndex = computed({
  get: () => props.tabsContent.findIndex((item) => item.path === route.path),
  set: (value) => router.replace(props.tabsContent[value].path),
});

onMounted(() =>
  // 监听tabIndex的变化，更新盒子位置
  watch(
    tabIndex,
    () =>
      nextTick(() => {
        const tabItem = tabItemRef.value?.children[tabIndex.value]; // 获取选中的tab
        boxRect.value = {
          width: tabItem?.offsetWidth, // 获取选中的tab的宽度
          left: tabItem?.offsetLeft, // 获取选中的tab的偏移量
        };
      }),
    { immediate: true }
  )
);
</script>
