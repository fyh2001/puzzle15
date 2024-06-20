<template>
  <div class="flex justify-center items-center p-4">
    <n-el class="px-5 py-6 w-full rd-3 shadow translate-y-1/4"
      style="background: var(--login-panel-background-color)"
    >
      <title-bar class="mb-4" title="登录" />
      <!-- 表单 -->
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
        <n-form-item path="username" style="--n-label-height: 0px">
          <n-input
            v-model:value="formValue.username"
            style="--n-height: 50px; --n-border-radius: 0.75rem"
            placeholder="邮箱/手机号码/用户名"
            size="large"

          />
        </n-form-item>

        <n-form-item path="password" style="--n-label-height: 10px">
          <n-input
            v-model:value="formValue.password"
            type="password"
            show-password-on="click"
            style="--n-height: 50px; --n-border-radius: 0.75rem"
            placeholder="请输入密码"
            size="large"
          />
        </n-form-item>
      </n-form>

      <!-- 按钮 -->
      <div class="">
        <n-button
          type="primary"
          class="w-full h-12 rounded-xl text-5 shadow"
          :disabled="loginButtonDisabled"
          @click="loginHandler"
          >登录</n-button
        >
      </div>

      <div class="flex justify-center items-center mt-4 text-gray gap-2">
        <div>手机号登录</div>
        <div>|</div>
        <div @click="$router.replace('register')">立刻注册</div>
        <div>|</div>
        <div>忘记密码?</div>
      </div>
    </n-el>
  </div>
</template>

<script setup>
import TitleBar from "../../../components/TitleBar.vue";
import userRequest from "@/api/methods/user";
import router from "../../../router";
import md5 from "js-md5";
import { salt } from "@/config/index";
import { useUserStore } from "@/store/userStore";
import { saveUnUploadRecords } from "@/common/uploadRecord.js";

const userStore = useUserStore();

const formRef = ref(null); // 表单实例
const formValue = ref({
  // 表单数据
  username: "",
  password: "",
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
};

// 登录按钮是否禁用
const loginButtonDisabled = computed(() => {
  return !(
    regulation.username.expression.test(formValue.value.username) &&
    regulation.password.expression.test(formValue.value.password)
  );
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    {
      pattern: regulation.username.expression,
      message: regulation.username.message,
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: regulation.password.expression,
      message: regulation.password.message,
      trigger: "blur",
    },
  ],
};

/**
 * 登录
 */
const loginHandler = async () => {
  // 表单验证
  if (
    !(
      regulation.username.expression.test(formValue.value.username) &&
      regulation.password.expression.test(formValue.value.password)
    )
  ) {
    window.$message.error("请按照规则填写");
    return;
  }

  const { data } = await userRequest.login({
    username: formValue.value.username,
    password: md5(formValue.value.password + salt),
  }); // 登录

  if (data.code === 200) {
    console.log(data.data)
    userStore.setUser(data.data.user); // 更新本地用户信息
    userStore.setToken(data.data.token); // 更新本地token

    await saveUnUploadRecords(); // 保存未上传的记录

    window.$message.success("登录成功"); // 提示登录成功
    setTimeout(() => router.replace("/user"), 1000); // 1秒后返回上一页

    return;
  }

  window.$message.error(data.msg); // 提示登录失败
};

onMounted(() => {});
</script>

<style scoped>
.n-input >>> .n-input__border,
.n-input >>> .n-input__state-border {
  border-radius: 0.75rem;
}
</style>
