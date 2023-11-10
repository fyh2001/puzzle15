<template>
  <GlobalProvider>
    <router-view v-slot="{ Component }">
      <transition :name="'fade'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </GlobalProvider>
</template>

<script setup>
import GlobalProvider from "./components/GlobalProvider.vue";
</script>

<style>
</style>