<script setup lang="jsx">
import recordBestStepCountRequest from "@/api/methods/recordBestStepCount";
import { useRecordStore } from "@/store/recordStore.js";
import { useUserStore } from "@/store/userStore.js";

const userStore = useUserStore();
const recordStore = useRecordStore();

// 最佳步数排名是否加载中
const isBestStepCountLoading = ref(false);

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
        value: (
          <n-el style="color: var(--rank-summary-font-color)">
            {userStore.getBestStepCountRecord.curRank}
          </n-el>
        ),
      },
      nickname: {
        value: (
          <n-el style="color: var(--rank-summary-font-color)">
            {userStore.user.nickname}
          </n-el>
        ),
      },
      stepCount: {
        value: (
          <n-el style="color: var(--rank-summary-font-color)">
            {userStore.getBestStepCountRecord.stepCount}
          </n-el>
        ),
      },
    };
  }
};

/**
 * 最佳单次表格行属性
 * @param {object} row 当前行数据
 */
const bestStepCountRowProps = (row) => {
  return {
    onclick: (e) => {
      recordStore.setRecordDetailParams({
        ...row,
        type: "bestStepCount",
      });
      router.push({
        name: "RecordDetail",
      });
    },
  };
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

onMounted(() => {
  getStepCountRank();
  getUserBestStepCountRecord();
});
</script>

<template>
  <div>
    <!-- 最佳最步数 -->
    <n-data-table
      class="mt-5"
      :row-props="bestStepCountRowProps"
      :loading="isBestStepCountLoading"
      :columns="bestStepCountTableColumns"
      :data="recordStore.getBestStepCountRecord"
      :paginate-single-page="false"
      :pagination="bestStepCountTablePagination"
      :bordered="false"
      :summary="bestStepCountSummary"
    />
  </div>
</template>
