<template>
  <div>
    <top-bar class="my-4 ml-2"  title="注册" />
    <by-username />
  </div>
</template>

<script setup>
import TopBar from "@/components/TopBar.vue";
import byUsername from '@/views/register/form/by-username.vue';
</script>