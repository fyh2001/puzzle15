<template>
  <GlobalProvider>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </GlobalProvider>
</template>

<script setup>
import GlobalProvider from "./components/GlobalProvider.vue";
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>