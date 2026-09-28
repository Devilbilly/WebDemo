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

## 回報問題

發現問題或想提出新功能時，請按 [New issue](https://github.com/Devilbilly/WebDemo/issues/new/choose)，選擇適合的 issue 模板：

- **錯誤回報**：適用於網站沒有正常運作的情況，例如按鈕沒有反應。請填寫頁面或網址、瀏覽器與裝置、可重現問題的操作步驟，以及實際看到和預期看到的結果。
- **功能需求**：適用於提出新功能或改善建議。請說明希望達成的結果、使用者與使用情境，並填寫相關頁面、瀏覽器與裝置、操作步驟、目前結果和希望的改變。

兩個模板都需要填寫「可檢查的完成條件」，列出具體輸入與預期輸出，不要只寫「修好」或「更好」。也可以在「不要改動的範圍」補充限制。送出前請移除密碼、權杖與個人資料；不需要撰寫根因分析或選擇技術領域。

## 提需求

直接開 issue，寫下想改什麼、改完要看到什麼。需要一字不差的文字（按鈕文字、提示訊息），請用「」或引號標出來，Juxta 會把原文寫進測試。
