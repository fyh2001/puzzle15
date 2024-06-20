<template>
  <GlobalProvider>
    <router-view v-slot="{ Component }">
      <transition :name="'fade'" mode="out-in">
        <component
          :is="Component"
          :class="{ 'brightness-60': themeStore.darkMode }"
        />
      </transition>
    </router-view>
  </GlobalProvider>
</template>

<script setup>
import GlobalProvider from "./components/GlobalProvider.vue";
import { useThemeStore } from "@/store/themeStore";
import { saveUnUploadRecords } from "@/common/uploadRecord.js";
import { onMounted } from "vue";

const themeStore = useThemeStore();

onMounted(() => {
  saveUnUploadRecords();
});
</script>

<style></style>
