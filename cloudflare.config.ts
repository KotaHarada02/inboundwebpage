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
        // "/*" は事前描画キャッシュ（/_vinext/static-cache/*）も含むので、直接アクセスはされない
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
      // メニューの保存先（migrations/d1/ 参照）。ローカルでは .cloudflare/state の D1 シミュレーションを使う
      DB: bindings.d1({ name: "inbound-menu-db", id: "f390df9a-bb42-48a0-8ac2-572175518d38" }),
      // 管理画面からアップロードしたメニュー写真。/media/menu/* で配信する
      MENU_IMAGES: bindings.r2({ name: "mitsukabose-menu-images" }),
      // 値はローカルでは .dev.vars、本番では Worker のシークレットから注入される
      ADMIN_PASSWORD: bindings.secret(),
      AUTH_SECRET: bindings.secret(),
    },
  }),
});
