<template>
  <div>
    <top-bar title="编辑资料" class="my-4 ml-2" />

    <div class="p-4">
      <n-el class="px-6 py-2 bg-white rounded-xl"
      style="background: var(--edit-card-background-color)"
      >
        <!-- 头像 -->
        <div
          class="flex justify-between items-center py-3 rounded-xl"
          @click="editAvatarHandler"
        >
          <div class="text-4.2">头像</div>
          <div class="flex items-center">
            <div class="text-center mr-4">
              <n-avatar
                class="shadow"
                :size="50"
                round
                object-fit="cover"
                :src="
                  userStore.user.avatar !== ''
                    ? userStore.user.avatar
                    : defalutAvatar
                "
                :fallback-src="defalutAvatar"
              />
            </div>
            <n-icon class="text-6 text-gray" :component="ChevronRightRound" />
          </div>
        </div>

        <!-- 分割线 -->
        <div class="w-full h-0.1 bg-gray-400" />

        <!-- 昵称 -->
        <div
          class="flex justify-between items-center py-3 mt-2 rounded-xl"
          @click="editNicknameHandler"
        >
          <div class="text-4.2">昵称</div>
          <div class="flex items-center">
            <div class="mr-4 text-4.2 text-gray">
              {{ userStore.user.nickname }}
            </div>
            <n-icon class="text-6 text-gray" :component="ChevronRightRound" />
          </div>
        </div>

        <!-- 个性签名 -->
        <div
          class="flex justify-between items-center py-3 mt-2 rounded-xl"
        >
          <div class="text-4.2">个性签名</div>
          <div class="flex items-center">
            <div class="mr-4 text-4.2 text-gray">暂未开放</div>
            <n-icon class="text-6 text-gray" :component="ChevronRightRound" />
          </div>
        </div>

        <!-- 手机号 -->
        <div
          class="flex justify-between items-center py-3 mt-2  rounded-xl"
        >
          <div class="text-4.2">手机号</div>
          <div class="flex items-center">
            <div class="mr-4 text-4.2 text-gray">暂未开放</div>
            <n-icon class="text-6 text-gray" :component="ChevronRightRound" />
          </div>
        </div>

        <!-- 邮箱 -->
        <div
          class="flex justify-between items-center py-3 mt-2 rounded-xl"
        >
          <div class="text-4.2">邮箱</div>
          <div class="flex items-center">
            <div class="mr-4 text-4.2 text-gray">暂未开放</div>
            <n-icon class="text-6 text-gray" :component="ChevronRightRound" />
          </div>
        </div>
      </n-el>
    </div>
  </div>
</template>

<script setup lang="jsx">
import TopBar from "@/components/TopBar.vue";
import ChevronRightRound from "@vicons/material/ChevronRightRound";
import userRequest from "@/api/methods/user";
import { defalutAvatar } from "@/config/index.js";
import { baseURL } from "@/api/index.js";
import { useUserStore } from "../../store/userStore";

const userStore = useUserStore();

// 上传按钮
const uploadRef = ref(null);

const fileList = ref([]);

const formData = ref({
  nickname: "",
  signature: "",
  avatar: "",
  phone: "",
  email: "",
});

// 验证规则
const regulation = {
  username: {
    label: "用户名",
    expression: /^[a-zA-Z0-9]{6,12}$/,
    message: "用户名只允许是6-12位字母或数字的组合",
  },
  password: {
    label: "密码",
    expression: /^[a-zA-Z0-9]{6,12}$/,
    message: "密码只允许是6-12位字母或数字的组合",
  },
  nickname: {
    label: "昵称",
    expression: /^[^@# ,.?，。？]{2,15}$/,
    message: "昵称不允许出现除了@# ,.?，。？以外的字符，且长度为2-15位",
  },
};

/**
 * 预览头像
 */
const handleUpdateAvatar = (file) => {
  // 判断文件是否超过5Mb
  if (file.file.size > 5 * 1024 * 1024) {
    return window.$message.error("文件大小不能超过5Mb", { max: 1 });
  }

  fileList.value = [file];

  const reader = new FileReader();
  reader.onload = () => (formData.value.avatar = reader.result);
  reader.readAsDataURL(file.file);
};

/**
 * 修改头像
 */
const editAvatarHandler = async () => {
  formData.value.avatar = userStore.user.avatar;

  const header = {
    Authorization: userStore.token,
  };

  const uploadFinishHandler = (file) => {
    if (file.file.status !== "finished") return;

    $message.success("修改成功");
    userStore.updateUser({
      avatar: formData.value.avatar,
    });
  };

  const uploadErrorHanlder = (err) => {
    console.log(err);
    window.$message.error("修改失败，请稍后重试");
  };

  window.$dialog.warning({
    title: "修改头像",
    content: () => {
      return (
        <div class="flex flex-col items-center">
          <div class="mb-5 text-4.2 font-bold">当前头像</div>
          <n-avatar
            class="w-30 h-30 mb-6 shadow"
            size="10"
            round
            object-fit="cover"
            src={
              formData.value.avatar !== ""
                ? formData.value.avatar
                : defalutAvatar
            }
            fallback-src={defalutAvatar}
          />
          <div>
            <n-upload
              ref={uploadRef}
              accept="image/*,.png,.jpg,.jpeg,.svg"
              name="avatar"
              headers={header}
              action={baseURL + "/user/updateUserAvatar"}
              file-list={fileList.value}
              on-update:file-list={(files) => handleUpdateAvatar(files.pop())}
              on-finish={(file) => uploadFinishHandler(file)}
              on-error={(err) => uploadErrorHanlder(err)}
              default-upload={false}
              show-file-list={false}
              multiple={false}
            >
              <n-button>选择文件</n-button>
            </n-upload>
          </div>
        </div>
      );
    },
    positiveText: "确认修改",
    negativeText: "取消修改",
    onPositiveClick: async () => {
      console.log("onPositiveClick");
      uploadRef.value?.submit();
    },
  });
};

/**
 * 修改昵称
 */
const editNicknameHandler = async () => {
  window.$dialog.warning({
    title: "修改昵称",
    content: () => {
      return (
        <n-input
          v-model:value={formData.value.nickname}
          class="my-2"
          placeholder="输入要修改的昵称"
        >
          修改昵称
        </n-input>
      );
    },
    positiveText: "确认修改",
    negativeText: "取消修改",
    onPositiveClick: async () => {
      if (!regulation.nickname.expression.test(formData.value.nickname)) {
        window.$message.error("不允许@# ,.?，。？以外的字符，且长度为2-15位");

        formData.value.nickname = "";
        return;
      }

      const { data } = await userRequest.update({
        nickname: formData.value.nickname,
      });

      if (data.code === 200) {
        window.$message.success("修改成功");
        userStore.updateUser({
          nickname: formData.value.nickname,
        });
      } else {
        window.$message.error("修改失败，请稍后重试");
      }
    },
    onNegativeClick: () => {},
  });
};
</script>
