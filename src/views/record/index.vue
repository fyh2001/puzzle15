<template>
  <div class="p-4">
    <!-- 标题与功能按钮 -->
    <div class="flex justify-between items-center">
      <title-bar title="记录及排名" />

      <dropdown
        :options="options"
        @select="($event) => (curDataTable = $event)"
        :content="curDataTableLabel"
      />
    </div>
    <div>
      <View />
    </div>
  </div>
</template>

<script setup lang="jsx">
import TitleBar from "../../components/TitleBar.vue";
import Dropdown from "../../components/Dropdown.vue";
import recordPerson from "@/views/record/tables/record-person.vue";
import recordBestSingle from "@/views/record/tables/record-best-single.vue";
import recordBestAverage5 from "@/views/record/tables/record-best-average5.vue";
import recordBestAverage12 from "@/views/record/tables/record-best-average12.vue";
import recordBestStep from "@/views/record/tables/record-best-step.vue";
import {
  RocketLaunchOutlined,
  WorkspacePremiumRound,
  Looks5Outlined,
  TimerOutlined,
  SwipeLeftRound,
  CalendarMonthRound,
} from "@vicons/material";

// 当前表格
const curDataTable = ref("record");
// 当前表格标签
const curDataTableLabel = computed(() => {
  if (curDataTable.value === "record") {
    return options[0].label;
  } else {
    return (
      options[1].label +
      " - " +
      options[1].children.find((item) => item.key === curDataTable.value).label
    );
  }
});
// 功能下拉框选项
const options = [
  // 我的记录
  {
    label: "我的记录",
    key: "record",
    icon: () => {
      return (
        <n-el class="flex items-center" style="color: var(--primary-color)">
          <n-icon size="18" component={RocketLaunchOutlined} />
        </n-el>
      );
    },
  },
  // 总排名
  {
    label: "总排名",
    key: "rank",
    icon: () => {
      return (
        <n-el class="flex items-center" style="color: var(--primary-color)">
          <n-icon size="18" component={WorkspacePremiumRound} />
        </n-el>
      );
    },
    children: [
      {
        label: "最佳单次",
        key: "bestSingle",
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={TimerOutlined} />
            </n-el>
          );
        },
      },
      {
        label: "最佳5次平均",
        key: "bestAverage5",
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={Looks5Outlined} />
            </n-el>
          );
        },
      },
      {
        label: "最佳12次平均",
        key: "bestAverage12",
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={Looks5Outlined} />
            </n-el>
          );
        },
      },
      {
        label: "最佳步数",
        key: "bestStepCount",
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={SwipeLeftRound} />
            </n-el>
          );
        },
      },
    ],
  },
  // 周排名
  {
    label: "周排名",
    key: "weekRank",
    disabled: true,
    icon: () => {
      return (
        <n-el class="flex items-center" style="color: var(--primary-color)">
          <n-icon size="18" component={CalendarMonthRound} />
        </n-el>
      );
    },
    children: [
      {
        label: "最佳单次",
        key: "weekBestSingle",
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={TimerOutlined} />
            </n-el>
          );
        },
      },
      {
        label: "最佳5次平均",
        key: "weekBestAverage5",
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={Looks5Outlined} />
            </n-el>
          );
        },
      },
      {
        label: "最佳12次平均",
        key: "weekBestAverage12",
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={Looks5Outlined} />
            </n-el>
          );
        },
      },
      {
        label: "最佳步数",
        key: "weekBestStepCount",
        icon: () => {
          return (
            <n-el class="flex items-center" style="color: var(--primary-color)">
              <n-icon size="18" component={SwipeLeftRound} />
            </n-el>
          );
        },
      },
    ],
  },
];
// 当前表格视图
const View = computed(
  () =>
    ({
      record: recordPerson,
      bestSingle: recordBestSingle,
      bestAverage5: recordBestAverage5,
      bestAverage12: recordBestAverage12,
      bestStepCount: recordBestStep,
    }[curDataTable.value])
);
</script>

<style>
.n-data-table-th__title {
  text-align: center;
}

td.n-data-table-td.n-data-table-td {
  text-align: center;
}

/**
.n-data-table .n-data-table-td.n-data-table-td--summary {
  @apply bg-indigo-50 border border-indigo-200;
  background-color: v-bind(--rank-summary-background-color);
}
*/
</style>
