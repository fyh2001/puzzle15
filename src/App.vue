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
import { saveUnUploadRecords } from "@/common/uploadRecord.js"
import { onMounted } from "vue";

onMounted(() => {
  saveUnUploadRecords();
});

</script>

<style></style>
