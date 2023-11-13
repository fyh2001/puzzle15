<template>
  <div class="p-4">
    <title-bar title="记录及排名" />

    <n-data-table
      class="mt-5"
      :columns="dataTableColumns"
      :data="dataTableList"
      :pagination="dataTablePagination"
      :bordered="false"
    />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import TitleBar from "../../components/TitleBar.vue";
import recordRequest from "@/api/methods/record";
import { useRecordStore } from "@/store/recordStore.js";
import { useUserStore } from "@/store/userStore.js";
const recordStore = useRecordStore();
const userStore = useUserStore();

const dataTableColumns = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    defaultSortOrder: "descend",
    sorter: "default",
    width: "70",
  },
  {
    title: "时长",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "步数",
    dataIndex: "steps",
    key: "steps",
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

const dataTableList = ref([]);

const dataTablePagination = ref({
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
});

const getRecord = async () => {
  const { data } = await recordRequest.findByUserId();

  if (data.code === 200) {
    console.log(data.data);
    recordStore.setRecord(data.data);
  } else {
    window.$message.error("数据更新失败");
  }
};

console.log(recordStore.unUploadRecord)

onMounted(async () => {
  // 未登录
  if (userStore.token === "") {
    dataTableList.value = recordStore.getUnUploadRecord;
    return
  }
  await getRecord();
  dataTableList.value = recordStore.getRecord;
});
</script>

<style>
.n-data-table-th__title {
  text-align: center;
}

td.n-data-table-td.n-data-table-td {
  text-align: center;
}
</style>
