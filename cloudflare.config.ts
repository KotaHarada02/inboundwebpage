import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  // akishika_app と同じ Cloudflare アカウント。CLOUDFLARE_ACCOUNT_ID で上書き可能。
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "96dc0d345a3061736d1f32cd12135662",
  worker: defineWorker({
    name: "mitsukabose-inbound",
    entrypoint: "vinext/server/fetch-handler",
    // 2026-08-04 以降の compatibilityDate では nodejs_compat が既定で有効
    compatibilityDate: "2026-11-21",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      // 事前圧縮済みの public/ 画像・アイコンは Worker を通さず Static Assets から直接配信し、
      // Workers の CPU 時間とリクエスト枠を消費させない。
      runWorkerFirst: [
        "/*",
        "!/_next/static/*",
        "!/*/_next/static/*",
        "!/images/*",
        "!/favicon.ico",
        "!/*.svg",
      ],
    },
    env: {
      ASSETS: bindings.assets(),
    },
  }),
});
