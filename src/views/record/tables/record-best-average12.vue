<script setup lang="jsx">
import recordBestAverage12Request from "@/api/methods/recordBestAverage12";
import { useRecordStore } from "@/store/recordStore.js";
import { useUserStore } from "@/store/userStore.js";

const userStore = useUserStore();
const recordStore = useRecordStore();

// 最佳12次平均排名是否加载中
const isBestAverage12Loading = ref(false);

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
            {userStore.getBestAverage12Record?.curRank}
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
            {userStore.getBestAverage12Record?.duration}
          </n-el>
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

onMounted(async () => {
  await getAverage12Rank();
  await getUserBestAverage12Record();
});
</script>

<template>
  <div>
    <!-- 最佳12次平均 -->
    <n-data-table
      class="mt-5"
      :loading="isBestAverage12Loading"
      :columns="bestAverage12DataTableColumns"
      :data="recordStore.getBestAverage12Record"
      :paginate-single-page="false"
      :pagination="bestAverage12TablePagination"
      :bordered="false"
      :summary="bestAverage12Summary"
    />
  </div>
</template>
