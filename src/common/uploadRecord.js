import recordRequest from "@/api/methods/record";
import { useRecordStore } from "@/store/recordStore";
import { useUserStore } from "@/store/userStore";


export const saveUnUploadRecords = async () => {
  const recordStore = useRecordStore();
  const userStore = useUserStore();

  const unUploadRecords = recordStore.unUploadRecord;

  // 如果没有未上传记录或者用户未登录，直接返回
  if (unUploadRecords.length === 0 || userStore.user === null) {
    return;
  }

  console.log("unUploadRecords", unUploadRecords)

  for (let i = 0; i < unUploadRecords.length; i++) {
    const record = unUploadRecords[i];

    const { data } = await recordRequest.create({
      event: "p15",
      duration: record.duration,
      stepCount: record.stepCount,
      scramble: record.scramble,
      solution: record.solution,
    });

    if (data.code === 200) {
      recordStore.deleteUnUploadRecordByDateTime(record.dateTime);
    } else {
      window.$message.error("数据上传失败");
    }
  }
};