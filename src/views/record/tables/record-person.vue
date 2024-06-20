<script setup lang="jsx">
import recordRequest from "@/api/methods/record";
import { useRecordStore } from "@/store/recordStore.js";

const recordStore = useRecordStore();

// 记录是否加载中
const isRecordLoading = ref(false);

// 记录列表字段
const recordDataTableColumns = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    // defaultSortOrder: "descend",
    // sorter: "default",
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

// 记录列表分页
const recordDataTablePagination = ref({
  page: 1,
  pageSize: 10,
  onChange: async (page) => {
    recordDataTablePagination.value.page = page;
    await getRecord();
    recordDataTableList.value = recordStore.getRecord;
  },
});

/**
 * 记录列表行属性
 * @param {object} row 当前行数据
 */
const recordRowProps = (row) => {
  return {
    onclick: (e) => {
      recordStore.setRecordDetailParams({
        ...row,
        type: "personalRecord",
      });
      router.push({
        name: "RecordDetail",
      });
    },
  };
};

/**
 * 获取记录
 */
const getRecord = async () => {
  isRecordLoading.value = true;

  const { data } = await recordRequest.getByUserIdWithPaginate({
    page: recordDataTablePagination.value.page,
    pageSize: recordDataTablePagination.value.pageSize,
  });

  if (data.code === 200) {
    recordStore.setRecord(
      data.data.records.map((item, itemIndex) => {
        return {
          ...item,
          index:
            data.data.total -
            (recordDataTablePagination.value.page - 1) *
              recordDataTablePagination.value.pageSize -
            itemIndex,
        };
      })
    );
    recordDataTablePagination.value.itemCount = data.data.total;
  } else if (data.code === 400) {
    window.$message.error("数据更新失败");
  }

  isRecordLoading.value = false;
};

onMounted(async () => {
  await getRecord();
});
</script>

<template>
  <div>
    <n-data-table
      class="mt-5"
      :row-props="recordRowProps"
      :loading="isRecordLoading"
      :columns="recordDataTableColumns"
      :data="recordStore.getRecord"
      :bordered="false"
    />
  </div>
</template>
