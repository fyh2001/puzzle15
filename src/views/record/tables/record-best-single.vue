<script setup lang="jsx">
import recordBestSingleRequest from "@/api/methods/recordBestSingle";
import { useRecordStore } from "@/store/recordStore.js";
import { useUserStore } from "@/store/userStore.js";

const userStore = useUserStore();
const recordStore = useRecordStore();

// 最佳单次排名是否加载中
const isBestSingleLoading = ref(false);

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

// 最佳单次表格分页
const bestSingleTablePagination = ref({
  pageSize: 9,
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
        value: (
          <n-el style="color: var(--rank-summary-font-color)">
            {userStore.getBestSingleRecord.curRank}
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
      duration: {
        value: (
          <n-el style="color: var(--rank-summary-font-color)">
            {userStore.getBestSingleRecord.duration}
          </n-el>
        ),
      },
      stepCount: {
        value: (
          <n-el style="color: var(--rank-summary-font-color)">
            {userStore.getBestSingleRecord.stepCount}
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
const bestSingleRowProps = (row) => {
  return {
    onclick: (e) => {
      recordStore.setRecordDetailParams({
        ...row,
        type: "bestSingle",
      });
      router.push({
        name: "RecordDetail",
      });
    },
  };
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

onMounted(async () => {
  await getSingleRank();
  await getUserBestSingleRecord();
});
</script>

<template>
  <div>
    <!-- 最佳单次 -->
    <n-data-table
      class="mt-5"
      :row-props="bestSingleRowProps"
      :loading="isBestSingleLoading"
      :columns="bestSingleDataTableColumns"
      :data="recordStore.getBestSingleRecord"
      :paginate-single-page="false"
      :pagination="bestSingleTablePagination"
      :bordered="false"
      :summary="bestSingleSummary"
    />
  </div>
</template>
