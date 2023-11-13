<template>
  <div class="flex justify-center items-center h-screen p-4">
    <div class="px-5 py-6 w-full bg-white rd-3 shadow -translate-y-1/3">
      <title-bar class="mb-4" title="注册" />
      <!-- 表单 -->
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
        <n-form-item path="username" style="--n-label-height: 0px">
          <n-input
            v-model:value="formValue.username"
            style="--n-height: 50px; --n-border-radius: 0.5rem"
            placeholder="用于注册的用户名"
            size="large"
            round
          />
        </n-form-item>

        <n-form-item path="password" style="--n-label-height: 10px">
          <n-input
            v-model:value="formValue.password"
            style="--n-height: 50px"
            placeholder="用于注册的密码"
            size="large"
            round
          />
        </n-form-item>
      </n-form>

      <!-- 按钮 -->
      <div class="">
        <n-button
          type="primary"
          class="w-full h-12 rounded-xl text-5 shadow"
          :disabled="registerButtonDisabled"
          @click="registerHandler"
          >注册</n-button
        >
      </div>

      <div class="flex justify-center items-center mt-4 text-gray gap-2">
        <div>手机号登录</div>
        <div>|</div>
        <div @click="$router.replace('login')">立刻登录</div>
        <div>|</div>
        <div>忘记密码?</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleBar from "../../../components/TitleBar.vue";
import userRequest from "@/api/methods/user";
import router from "@/router/index";
import { useUserStore } from "@/store/userStore"


const formRef = ref(null); // 表单实例
const formValue = ref({
  // 表单数据
  username: "",
  password: "",
});

// 登录按钮是否禁用
const registerButtonDisabled = computed(() => {
  return !(formValue.value.username && formValue.value.password);
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    {
      // pattern: /^\d{10}$/,
      message: "请输入正确的用户名",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

/**
 * 注册
 */
const registerHandler = async () => {
  // 表单验证
  if (!formValue.value.username || !formValue.value.password) return;

  const { data } = await userRequest.registerByUsernameAndPassword(formValue.value); // 注册

  if (data.code === 200) {
    window.$message.success("注册成功"); // 提示注册成功
    setTimeout(() => router.replace("/login"), 1000); // 1秒后返回上一页

    return;
  }

  window.$message.error(data.msg); // 提示注册失败
};

onMounted(() => {});
</script>

<style>
.n-input .n-input__border,
.n-input .n-input__state-border {
  border-radius: 0.75rem;
}
</style>
