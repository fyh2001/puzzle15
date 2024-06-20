<template>
  <div>
    <div class="h-100vh overflow-auto">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="default">
          <component :is="Component" class="w-screen" />
        </transition>
      </router-view>
    </div>
    <!-- 底部tabbar -->
    <div
      class="fixed bottom-0 w-full p-3 transition-all duration-300 z-10"
      :class="tabbarVisible ? 'translate-y-0' : 'translate-y-100'"
    >
      <Tabbar :tabsContent="tabsContent" />
    </div>
  </div>
</template>

<script setup>
import { useMessage } from "naive-ui";
import { onBeforeMount, onBeforeUnmount, onMounted } from "vue";
import Tabbar from "../../components/Tabbar.vue";

const message = useMessage();

const tabsContent = [
  {
    text: "练习",
    icon: "i-material-symbols:videogame-asset-outline",
    path: "/",
  },
  {
    text: "记录",
    icon: "i-material-symbols:insert-chart-outline-rounded",
    path: "/record",
  },
  {
    text: "我的",
    icon: "i-material-symbols:person",
    path: "/user",
  },
];

// 是否显示底部tabbar
const tabbarVisible = ref(true);
let oldScrollTop = 0; //上一次滚动的距离

/**
 * 监听滚动事件，控制tabbar的显示与隐藏
 * @param {*} event
 */
const handleContainerScroll = (event) => {
  console.log(event.target);
  if (!event.target) return;
  const curScrollTop = event.target.scrollTop;
  tabbarVisible.value = curScrollTop < oldScrollTop;
  oldScrollTop = curScrollTop;
};

const initInnerHeight = window.innerHeight;
onMounted(() => {
  window.onresize = () => {
    if(window.innerHeight < initInnerHeight) {
      tabbarVisible.value = false;
    } else if(window.innerHeight > initInnerHeight) 
      tabbarVisible.value = true;
  };
});

onBeforeUnmount(() => {
  window.onresize = null;
});
</script>
