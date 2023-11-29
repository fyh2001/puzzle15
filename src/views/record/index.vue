<template>
  <div class="p-4">
    <!-- 标题与功能按钮 -->
    <div class="flex justify-between items-center">
      <title-bar title="记录及排名" />

      <Dropdown
        :options="options"
        @select="switchDataTableHandler"
        :content="curDataTableLabel"
      />
    </div>

    <!-- 我的成绩 -->
    <n-data-table
      class="mt-5"
      :loading="isRecordLoading"
      :columns="recordDataTableColumns"
      :data="recordDataTableList"
      :paginate-single-page="false"
      :pagination="recordDataTablePagination"
      :bordered="false"
      v-if="curDataTable === 'record'"
    />

    <!-- 最佳单次 -->
    <n-data-table
      class="mt-5"
      :loading="isBestSingleLoading"
      :columns="bestSingleDataTableColumns"
      :data="bestSingleTableList"
      :paginate-single-page="false"
      :pagination="bestSingleTablePagination"
      :bordered="false"
      :summary="bestSingleSummary"
      v-if="curDataTable === 'bestSingle'"
    />

    <!-- 最佳5次平均 -->
    <n-data-table
      class="mt-5"
      :loading="isBestAverage5Loading"
      :columns="bestAverage5DataTableColumns"
      :data="bestAverage5TableList"
      :paginate-single-page="false"
      :pagination="bestAverage5TablePagination"
      :bordered="false"
      :summary="bestAverage5Summary"
      v-if="curDataTable === 'bestAverage5'"
    />

    <!-- 最佳12次平均 -->
    <n-data-table
      class="mt-5"
      :loading="isBestAverage12Loading"
      :columns="bestAverage12DataTableColumns"
      :data="bestAverage12TableList"
      :paginate-single-page="false"
      :pagination="bestAverage12TablePagination"
      :bordered="false"
      :summary="bestAverage12Summary"
      v-if="curDataTable === 'bestAverage12'"
    />

    <!-- 最佳最步数 -->
    <n-data-table
      class="mt-5"
      :loading="isBestStepCountLoading"
      :columns="bestStepCountTableColumns"
      :data="bestStepCountTableList"
      :paginate-single-page="false"
      :pagination="bestStepCountTablePagination"
      :bordered="false"
      :summary="bestStepCountSummary"
      v-if="curDataTable === 'bestStepCount'"
    />
  </div>
</template>

<script setup>
import { h, onMounted, render } from "vue";
import TitleBar from "../../components/TitleBar.vue";
import recordRequest from "@/api/methods/record";
import recordBestSingleRequest from "@/api/methods/recordBestSingle";
import recordBestAverage5Request from "@/api/methods/recordBestAverage5";
import recordBestAverage12Request from "@/api/methods/recordBestAverage12";
import recordBestStepCountRequest from "@/api/methods/recordBestStepCount";
import Dropdown from "../../components/Dropdown.vue";
import { useRecordStore } from "@/store/recordStore.js";
import { useUserStore } from "@/store/userStore.js";
import {
  RocketLaunchOutlined,
  WorkspacePremiumRound,
  Looks5Outlined,
  TimerOutlined,
  SwipeLeftRound,
} from "@vicons/material";
const recordStore = useRecordStore();
const userStore = useUserStore();

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
// 记录是否加载中
const isRecordLoading = ref(false);
// 最佳单次排名是否加载中
const isBestSingleLoading = ref(false);
// 最佳5次平均排名是否加载中
const isBestAverage5Loading = ref(false);
// 最佳12次平均排名是否加载中
const isBestAverage12Loading = ref(false);
// 最佳步数排名是否加载中
const isBestStepCountLoading = ref(false);

// 功能下拉框选项
const options = [
  {
    label: "我的记录",
    key: "record",
    icon: () => {
      return h(NIcon, {
        size: 18,
        class: "text-indigo-500",
        component: RocketLaunchOutlined,
      });
    },
  },
  {
    label: "排名",
    key: "rank",
    icon: () => {
      return h(NIcon, {
        size: 18,
        class: "text-indigo-500",
        component: WorkspacePremiumRound,
      });
    },
    children: [
      {
        label: "最佳单次",
        key: "bestSingle",
        icon: () => {
          return h(NIcon, {
            size: 18,
            class: "text-indigo-500",
            component: TimerOutlined,
          });
        },
      },
      {
        label: "最佳5次平均",
        key: "bestAverage5",
        icon: () => {
          return h(NIcon, {
            size: 18,
            class: "text-indigo-500",
            component: Looks5Outlined,
          });
        },
      },
      {
        label: "最佳12次平均",
        key: "bestAverage12",
        icon: () => {
          return h(NIcon, {
            size: 18,
            class: "text-indigo-500",
            component: Looks5Outlined,
          });
        },
      },
      {
        label: "最佳步数",
        key: "bestStepCount",
        icon: () => {
          return h(NIcon, {
            size: 18,
            class: "text-indigo-500",
            component: SwipeLeftRound,
          });
        },
      },
    ],
  },
];

/**
 * 切换表格
 * @param {string} newTable 新表格的key
 */
const switchDataTableHandler = async (newTable) => {
  curDataTable.value = newTable;

  if (newTable === "record") {
    recordDataTableList.value = recordStore.getRecord;
  } else {
    if (newTable === "bestSingle") {
      isBestSingleLoading.value = true;

      await getSingleRank();
      await getUserBestSingleRecord();
      bestSingleTableList.value = recordStore.getBestSingleRecord;

      isBestSingleLoading.value = false;
    } else if (newTable === "bestAverage5") {
      isBestAverage5Loading.value = true;

      await getAverage5Rank();
      await getUserBestAverage5Record();
      bestAverage5TableList.value = recordStore.getBestAverage5Record;

      isBestAverage5Loading.value = false;
    }else if (newTable === "bestAverage12") {
      isBestAverage12Loading.value = true;

      await getAverage12Rank();
      await getUserBestAverage12Record();

      console.log(recordStore.getBestAverage12Record);
      bestAverage12TableList.value = recordStore.getBestAverage12Record;
      
      isBestAverage12Loading.value = false;
    }
    else if (newTable === "bestStepCount") {
      isBestStepCountLoading.value = true;

      await getStepCountRank();
      await getUserBestStepCountRecord();
      bestStepCountTableList.value = recordStore.getBestStepCountRecord;

      isBestStepCountLoading.value = false;
    }
  }
};

// 记录列表字段
const recordDataTableColumns = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    defaultSortOrder: "descend",
    sorter: "default",
    width: "65",
  },
  {
    title: "时长",
    dataIndex: "duration",
    key: "duration",
    // sorter: (row1, row2) => {
    //   return recordStore.record[row1.index-1].duration - recordStore.record[row2.index-1].duration;
    // }
  },
  {
    title: "步数",
    dataIndex: "stepCount",
    key: "stepCount",
    // sorter: (row1, row2) => {
    //   return row1.stepCount - row2.stepCount;
    // }
  },
  {
    title: "ao5",
    dataIndex: "ao5",
    key: "ao5",
  },
  {
    title: "ao12",
    dataIndex: "ao12",
    key: "ao12",
  },
];

// 记录列表
const recordDataTableList = ref([]);

// 记录列表分页
const recordDataTablePagination = ref({
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
});

/**
 * 获取记录
 */
const getRecord = async () => {
  // isRecordLoading.value = true;

  const { data } = await recordRequest.getByUserId();

  if (data.code === 200) {
    recordStore.setRecord(data.data);
  } else if (data.code === 400) {
    window.$message.error("数据更新失败");
  }

  // isRecordLoading.value = false;
};

// 最佳单次表格字段
const bestSingleDataTableColumns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    defaultSortOrder: "ascend",
    sorter: "default",
    width: "80",
  },
  {
    title: "用户",
    dataIndex: "nickname",
    key: "nickname",
  },
  {
    title: "成绩",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "步数",
    dataIndex: "stepCount",
    key: "stepCount",
  },
];

// 最佳单次表格
const bestSingleTableList = ref([]);

// 最佳单次表格分页
const bestSingleTablePagination = ref({
  pageSize: 9,
  pageSizes: [9, 18, 27, 36],
});

/**
 * 最佳单次表格汇总
 * @param {object} pageData 当前页数据
 */
const bestSingleSummary = (pageData) => {
  if (userStore.userBestSingleRecord === null) {
    return {
      rank: {
        value: h("span", { style: { color: "red" } }, "-"),
      },
      nickname: {
        value: h(
          "span",
          { style: { color: "black" } },
          userStore.user.nickname
        ),
      },
      duration: {
        value: h("span", { style: { color: "red" } }, "00:00.000"),
      },
      stepCount: {
        value: h("span", { style: { color: "red" } }, "0"),
      },
    };
  } else {
    return {
      rank: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.getBestSingleRecord.curRank
        ),
      },
      nickname: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.user.nickname
        ),
      },
      duration: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.getBestSingleRecord.duration
        ),
      },
      stepCount: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.getBestSingleRecord.stepCount
        ),
      },
    };
  }
};

/**
 * 获取最佳单次排名
 */
const getSingleRank = async () => {
  const { data } = await recordBestSingleRequest.getTop50ByEvent("p15");

  if (data.code === 200) recordStore.setBestSingleRecord(data.data);
  else if (data.code === 400) window.$message.error("获取排名失败");
};

/**
 * 获取用户最佳单次记录
 */
const getUserBestSingleRecord = async () => {
  const { data } = await recordBestSingleRequest.getByUserIdAndEvent("p15");

  if (data.code === 200) userStore.setUserBestSingleRecord(data.data);
  else if (data.code === 400) window.$message.error("数据更新失败");
};

// 最佳5次平均表格字段
const bestAverage5DataTableColumns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    defaultSortOrder: "ascend",
    sorter: "default",
    width: "80",
  },
  {
    title: "用户",
    dataIndex: "nickname",
    key: "nickname",
  },
  {
    title: "成绩",
    dataIndex: "duration",
    key: "duration",
  },
];

// 最佳5次平均表格
const bestAverage5TableList = ref([]);

// 最佳5次平均表格分页
const bestAverage5TablePagination = ref({
  pageSize: 9,
  pageSizes: [9, 18, 27, 36],
});

/**
 * 最佳5次平均表格汇总
 * @param {object} pageData 当前页数据
 */
const bestAverage5Summary = (pageData) => {
  if (userStore.userBestSingleRecord === null) {
    return {
      rank: {
        value: h("span", { style: { color: "red" } }, "-"),
      },
      nickname: {
        value: h(
          "span",
          { style: { color: "black" } },
          userStore.user.nickname
        ),
      },
      duration: {
        value: h("span", { style: { color: "red" } }, "00:00.000"),
      },
    };
  } else {
    return {
      rank: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.getBestAverage5Record.curRank
        ),
      },
      nickname: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.user.nickname
        ),
      },
      duration: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.getBestAverage5Record.duration
        ),
      },
    };
  }
};

/**
 * 获取最佳5次平均排名
 */
const getAverage5Rank = async () => {
  const { data } = await recordBestAverage5Request.getTop50ByEvent("p15");

  if (data.code === 200) recordStore.setBestAverage5Record(data.data);
  else if (data.code === 400) window.$message.error("获取排名失败");
};

/**
 * 获取用户最佳5次平均记录
 */
const getUserBestAverage5Record = async () => {
  const { data } = await recordBestAverage5Request.getByUserIdAndEvent("p15");

  if (data.code === 200) userStore.setUserBestAverage5Record(data.data);
  else if (data.code === 400) window.$message.error("数据更新失败");
};


// 最佳12次平均表格字段
const bestAverage12DataTableColumns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    defaultSortOrder: "ascend",
    sorter: "default",
    width: "80",
  },
  {
    title: "用户",
    dataIndex: "nickname",
    key: "nickname",
  },
  {
    title: "成绩",
    dataIndex: "duration",
    key: "duration",
  },
];

// 最佳12次平均表格
const bestAverage12TableList = ref([]);

// 最佳12次平均表格分页
const bestAverage12TablePagination = ref({
  pageSize: 9,
  pageSizes: [9, 18, 27, 36],
});

/**
 * 最佳12次平均表格汇总
 * @param {object} pageData 当前页数据
 */
const bestAverage12Summary = (pageData) => {
  if (userStore.userBestSingleRecord === null) {
    return {
      rank: {
        value: h("span", { style: { color: "red" } }, "-"),
      },
      nickname: {
        value: h(
          "span",
          { style: { color: "black" } },
          userStore.user.nickname
        ),
      },
      duration: {
        value: h("span", { style: { color: "red" } }, "00:00.000"),
      },
    };
  } else {
    return {
      rank: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.getBestAverage12Record.curRank
        ),
      },
      nickname: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.user.nickname
        ),
      },
      duration: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.getBestAverage12Record.duration
        ),
      },
    };
  }
};

/**
 * 获取最佳12次平均排名
 */
const getAverage12Rank = async () => {
  const { data } = await recordBestAverage12Request.getTop50ByEvent("p15");

  if (data.code === 200) recordStore.setBestAverage12Record(data.data);
  else if (data.code === 400) window.$message.error("获取排名失败");
};

/**
 * 获取用户最佳12次平均记录
 */
const getUserBestAverage12Record = async () => {
  const { data } = await recordBestAverage12Request.getByUserIdAndEvent("p15");

  if (data.code === 200) userStore.setUserBestAverage12Record(data.data);
  else if (data.code === 400) window.$message.error("数据更新失败");
};

// 最佳步数表格字段
const bestStepCountTableColumns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    defaultSortOrder: "ascend",
    sorter: "default",
    width: "80",
  },
  {
    title: "用户",
    dataIndex: "nickname",
    key: "nickname",
  },
  {
    title: "步数",
    dataIndex: "stepCount",
    key: "stepCount",
  },
];

// 最佳步数表格
const bestStepCountTableList = ref([]);

// 最佳步数表格分页
const bestStepCountTablePagination = ref({
  pageSize: 9,
  pageSizes: [9, 18, 27, 36],
});

/**
 * 最佳步数表格汇总
 * @param {object} pageData 当前页数据
 */
const bestStepCountSummary = (pageData) => {
  if (userStore.userBestSingleRecord === null) {
    return {
      rank: {
        value: h("span", { style: { color: "red" } }, "-"),
      },
      nickname: {
        value: h(
          "span",
          { style: { color: "black" } },
          userStore.user.nickname
        ),
      },
      stepCount: {
        value: h("span", { style: { color: "red" } }, "0"),
      },
    };
  } else {
    return {
      rank: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.getBestStepCountRecord.curRank
        ),
      },
      nickname: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.user.nickname
        ),
      },
      stepCount: {
        value: h(
          "span",
          { style: { color: "#8b5cf6" } },
          userStore.getBestStepCountRecord.stepCount
        ),
      },
    };
  }
};

/**
 * 获取最佳步数排名
 */
const getStepCountRank = async () => {
  const { data } = await recordBestStepCountRequest.getTop50ByEvent("p15");

  if (data.code === 200) recordStore.setBestStepCountRecord(data.data);
  else if (data.code === 400) window.$message.error("获取排名失败");
};

/**
 * 获取用户最佳步数记录
 */
const getUserBestStepCountRecord = async () => {
  const { data } = await recordBestStepCountRequest.getByUserIdAndEvent("p15");

  if (data.code === 200) userStore.setUserBestStepCountRecord(data.data);
  else if (data.code === 400) window.$message.error("数据更新失败");
};

onMounted(async () => {
  // 未登录
  if (userStore.token === "") {
    recordDataTableList.value = recordStore.getUnUploadRecord;
    return;
  }
  await getRecord();
  recordDataTableList.value = recordStore.getRecord;
});
</script>

<style>
.n-data-table-th__title {
  text-align: center;
}

td.n-data-table-td.n-data-table-td {
  text-align: center;
}

.n-data-table .n-data-table-td.n-data-table-td--summary {
  @apply bg-indigo-50 border border-indigo-200;
}
</style>
