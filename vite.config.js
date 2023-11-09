import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import presetIcons from '@unocss/preset-icons';
import transformerDirective from "@unocss/transformer-directives";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  base: "/puzzle15",
  plugins: [
    vue(),
    UnoCSS({
      transformers: [transformerDirective()],
      presets: [
        presetIcons({
          collections: {
            materialSymbols: () =>
              import("@iconify-json/material-symbols/icons.json").then(
                (i) => i.default
              ),
          },
        }),
      ],
    }),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
        // "@vicons/antd",
        // "@vicons/carbon",
        // "@vicons/fa",
        // "@vicons/fluent",
        // "@vicons/ionicons4",
        // "@vicons/ionicons5",
        // "@vicons/material",
        // "@vicons/tabler"
      ],
      resolvers: [NaiveUiResolver()],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
});
