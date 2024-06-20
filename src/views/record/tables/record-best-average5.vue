<script setup lang="jsx">
import recordBestAverage5Request from "@/api/methods/recordBestAverage5";
import { useRecordStore } from "@/store/recordStore.js";
import { useUserStore } from "@/store/userStore.js";

const userStore = useUserStore();
const recordStore = useRecordStore();

// 最佳5次平均排名是否加载中
const isBestAverage5Loading = ref(false);

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
          userStore.user?.nickname
        ),
      },
      duration: {
        value: h("span", { style: { color: "red" } }, "00:00.000"),
      },
    };
  } else {
    return {
      rank: {
        value: (
          <n-el style="color: var(--rank-summary-font-color)">
            {userStore.getBestAverage5Record?.curRank}
          </n-el>
        ),
      },
      nickname: {
        value: (
          <n-el style="color: var(--rank-summary-font-color)">
            {userStore.user?.nickname}
          </n-el>
        ),
      },
      duration: {
        value: (
          <n-el style="color: var(--rank-summary-font-color)">
            {userStore.getBestAverage5Record?.duration}
          </n-el>
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

onMounted(async () => {
  await getAverage5Rank();
  await getUserBestAverage5Record();
});
</script>

<template>
  <div>
    <!-- 最佳5次平均 -->
    <n-data-table
      class="mt-5"
      :loading="isBestAverage5Loading"
      :columns="bestAverage5DataTableColumns"
      :data="recordStore.getBestAverage5Record"
      :paginate-single-page="false"
      :pagination="bestAverage5TablePagination"
      :bordered="false"
      :summary="bestAverage5Summary"
    />
  </div>
</template>
