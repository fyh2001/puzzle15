import { defineConfig, presetAttributify, presetUno } from "unocss";

export default defineConfig({
  presets: [presetAttributify(), presetUno()],
  //禁用预加载
  // preflight: false,
});
