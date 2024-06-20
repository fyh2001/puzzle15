<template>
  <div>
    <personal-record v-if="recordStore.recordDetailParams.type == 'personalRecord'"/>
    <best-single v-if="recordStore.recordDetailParams.type == 'bestSingle'"/>
    <best-step-count v-if="recordStore.recordDetailParams.type == 'bestStepCount'"/>
  </div>
</template>

<script setup>
import personalRecord from "@/views/record-detail/form/personal-record.vue";
import bestSingle from "@/views/record-detail/form/best-single.vue";
import bestStepCount from "@/views/record-detail/form/best-step-count.vue";
import { useRecordStore } from "@/store/recordStore";

const recordStore = useRecordStore();

</script>