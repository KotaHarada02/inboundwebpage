import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { staticAssetsAdapter } from "@vinext/cloudflare/cache/static-assets-adapter";

export default defineConfig({
  plugins: [
    vinext({
      // 公開ページはビルド時に描画して Static Assets から返し、Worker の CPU 時間を
      // Free プランの 10 ms 以内に抑える（ADR-4）。新しい内容はデプロイで反映される。
      cache: { cdn: staticAssetsAdapter() },
      prerender: { routes: "*" },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
