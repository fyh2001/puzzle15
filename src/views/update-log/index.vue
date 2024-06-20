<template>
  <div>
    <top-bar title="更新日志" class="mt-4 ml-2" />

    <div class="p-4">
      <div class="mt-2">内部测试期间不实行版本号管理</div>

      <div class="mt-4">
        <n-el
          class="p-4 mt-4 rounded-xl shadow-sm"
          style="background: var(--update-card-background-color)"
          v-for="(data, index) in log.reverse()"
          :key="index"
        >
          <div class="flex">
            <div class="text-5 font-bold">{{ data.title }}</div>
            <n-tag
              class="ml-4"
              :bordered="false"
              type="success"
              v-if="data.type === 'daily'"
            >
              日常更新
            </n-tag>
            <n-tag
              class="ml-4"
              :bordered="false"
              type="error"
              v-if="data.type === 'version'"
            >
              重大更新
            </n-tag>
          </div>

          <div class="mt-2">
            <!-- 新增 -->
            <div v-if="data.update.new.length > 0">
              <div class="text-4">🚀 新特性</div>
              <ul class="list-disc">
                <li
                  class="ml-8"
                  v-for="(item, index) in data.update.new"
                  :key="index"
                >
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- 修复 -->
            <div v-if="data.update.fix.length > 0">
              <div class="text-4 mt-2">🐛 修复</div>
              <ul class="list-disc">
                <li
                  class="ml-8"
                  v-for="(item, index) in data.update.fix"
                  :key="index"
                >
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- 优化 -->
            <div v-if="data.update.optimize.length > 0">
              <div class="text-4 mt-2">🔧 优化</div>
              <ul class="list-disc">
                <li
                  class="ml-8"
                  v-for="(item, index) in data.update.optimize"
                  :key="index"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </n-el>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from "@/components/TopBar.vue";

const log = [
  {
    type: "daily", // daily 日常更新 | version 版本更新
    title: "2023-12-10",
    date: "2023-12-10",
    update: {
      new: [
        "新增 [更新日志] 页面",
        "新增 [编辑资料] 页面 - 目前仅开放昵称的修改",
      ],
      fix: [],
      optimize: [
        "优化 [我的记录] 页面的加载速度",
        "优化 [更新日志] 页面的返回操作逻辑",
        "优化 [编辑资料] 页面的返回操作逻辑",
      ],
    },
  },
  {
    type: "daily", // daily 日常更新 | version 版本更新
    title: "2023-12-11",
    date: "2023-12-11",
    update: {
      new: [
        "新增 [我的记录] 页面 [周排名] 入口 - 暂未开放",
        "新增 [我的记录] 页面 记录复盘功能",
        "新增 [总排名-最佳单次] 页面 记录复盘功能",
        "新增 [总排名-最佳步数] 页面 记录复盘功能",
      ],
      fix: [
        "修复 [编辑资料] 页面中编辑框的样式异常",
        "修复 [登录] 页面编辑框的样式异常",
        "修复 [注册] 页面编辑框的样式异常",
      ],
      optimize: [
        "优化 [登录] 页面的返回操作逻辑",
        "优化 [注册] 页面的返回操作逻辑",
      ],
    },
  },
  {
    type: "daily", // daily 日常更新 | version 版本更新
    title: "2023-12-12",
    date: "2023-12-12",
    update: {
      new: ["新增 [编辑资料] 页面 修改头像功能", "新增 默认头像"],
      fix: [
        "修复 [练习] [个人记录详情] [最佳单次详情] [最佳步数详情] 页面样式显示异常的问题",
        "修复 [总排名-最佳单次] 页面分页异常的问题",
        "修复 [编辑资料] 页面 修改昵称功能异常的问题",
      ],
      optimize: [],
    },
  },
  {
    type: "daily", // daily 日常更新 | version 版本更新
    title: "2023-12-13",
    date: "2023-12-13",
    update: {
      new: ["新增 [反作弊] 特性"],
      fix: ["修复 [登录] [注册] 页面 输入框被输入法顶起的问题"],
      optimize: ["优化 [打乱算法]"],
    },
  },
  {
    type: "daily", // daily 日常更新 | version 版本更新
    title: "2023-12-13",
    date: "2023-12-13",
    update: {
      new: [],
      fix: [],
      optimize: [
        "优化 [练习] 页面的时间显示样式",
        "优化 [练习] 页面的时间改变过渡 - 过渡更加平滑",
      ],
    },
  },
  {
    type: "daily", // daily 日常更新 | version 版本更新
    title: "2023-12-14",
    date: "2023-12-14",
    update: {
      new: ["新增 [深色模式] 特性"],
      fix: ["修复 未登录状态下 [用户] 页面头像加载失败的问题"],
      optimize: ["更换 [主题色]"],
    },
  },
  {
    type: "daily", // daily 日常更新 | version 版本更新
    title: "2023-12-15",
    date: "2023-12-15",
    update: {
      new: ["新增 [翠绿] [靛蓝] [玫瑰] [琥珀] [天空] 主题色"],
      fix: [],
      optimize: ["优化 [反作弊] 逻辑", "调整 [深色模式] 下的页面亮度"],
    },
  },
  {
    type: "daily", // daily 日常更新 | version 版本更新
    title: "2023-12-17",
    date: "2023-12-17",
    update: {
      new: ["新增 练习页面 [口令] 特性 - 现在可以复制口令分享给好友啦"],
      fix: ["修复 [练习] 页面 输入的时候底部栏被输入法顶起的问题"],
      optimize: ["优化 [反作弊] 逻辑"],
    },
  },
];
</script>
