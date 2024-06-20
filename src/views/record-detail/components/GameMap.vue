<template>
  <div v-if="props.gameMap.length > 0">
    <div class="grid gap-2 p-1 rounded-md">
      <div
        class="grid grid-cols-4 gap-2"
        v-for="(row, rowIndex) in props.gameMap"
        :key="rowIndex"
      >
        <div
          class="aspect-square flex items-center justify-center rounded-md text-center text-5 font-bold"
          :class="getCellClass(item)"
          v-for="(item, itemIndex) in row"
          :key="itemIndex"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCellClass } from "@/common/game.js";

const props = defineProps({
  gameMap: Array,
});

</script>
