# 小巷咖啡：線上點餐 Demo

一個純 HTML／CSS／JavaScript 的小型點餐網站，用來示範 Juxta 如何處理網站專案：在 issue 裡用中文提出需求，Juxta 的 worker 修改網站並補上瀏覽器測試，審查與簽核通過後合併，GitHub Pages 自動更新。

- 線上預覽：https://devilbilly.github.io/WebDemo/
- 頁面：`index.html`、`styles.css`、`app.js`（不需要打包）
- 測試：Playwright（Chromium headless），測試在 `tests/`

## 在本機跑測試

需要 Node.js 20 以上。

```sh
npm ci
npx playwright install chromium
npx playwright test
```

## 提需求

直接開 issue，寫下想改什麼、改完要看到什麼。需要一字不差的文字（按鈕文字、提示訊息），請用「」或引號標出來，Juxta 會把原文寫進測試。
