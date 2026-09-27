// Issue #1: the checkout button reads 「確認訂單」 instead of 「送出訂單」, and every
// cart row gets a 「移除」 button that drops the whole item and updates the total;
// once the cart is emptied, 「購物車是空的」 shows again.
//
// Reproduce on main: open index.html, add 拿鐵 twice and 重乳酪蛋糕 once. The submit
// button still reads 送出訂單 and the cart rows have no way to remove an item.
const { test, expect } = require("@playwright/test");
const { PAGE } = require("./helpers");

async function add(page, name, times = 1) {
  for (let i = 0; i < times; i++) {
    await page.getByRole("button", { name: `加入${name}` }).click();
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE);
});

test("the checkout button reads 確認訂單, not 送出訂單", async ({ page }) => {
  await expect(page.locator("#submit-order")).toHaveText("確認訂單");
  await expect(page.getByRole("button", { name: "確認訂單" })).toHaveCount(1);
  await expect(page.getByRole("button", { name: "送出訂單" })).toHaveCount(0);
});

test("removing 拿鐵 leaves only 重乳酪蛋糕 and a total of NT$95", async ({ page }) => {
  await add(page, "拿鐵", 2);
  await add(page, "重乳酪蛋糕");
  await expect(page.locator("#cart-total")).toHaveText("NT$315");
  await page.getByRole("button", { name: "移除拿鐵" }).click();
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await expect(page.locator('.cart-item[data-id="latte"]')).toHaveCount(0);
  await expect(page.locator('.cart-item[data-id="cheesecake"]')).toContainText("重乳酪蛋糕 × 1");
  await expect(page.locator('.cart-item[data-id="cheesecake"]')).toContainText("NT$95");
  await expect(page.locator("#cart-total")).toHaveText("NT$95");
  await expect(page.locator("#cart-empty")).toBeHidden();
});

test("every cart row has one 移除 button named after its item", async ({ page }) => {
  await add(page, "拿鐵");
  await add(page, "重乳酪蛋糕");
  const rows = page.locator(".cart-item");
  await expect(rows).toHaveCount(2);
  await expect(page.locator('.cart-item[data-id="latte"] button')).toHaveText("移除");
  await expect(page.locator('.cart-item[data-id="cheesecake"] button')).toHaveText("移除");
  await expect(page.getByRole("button", { name: "移除拿鐵" })).toHaveCount(1);
  await expect(page.getByRole("button", { name: "移除重乳酪蛋糕" })).toHaveCount(1);
});

test("an empty cart shows no 移除 buttons and the menu keeps its six 加入 buttons", async ({ page }) => {
  await expect(page.locator(".cart-item")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^移除/ })).toHaveCount(0);
  await add(page, "摩卡");
  await expect(page.getByRole("button", { name: /^移除/ })).toHaveCount(1);
  await expect(page.locator(".menu-item button")).toHaveCount(6);
  await expect(page.locator(".menu-item button").first()).toHaveText("加入");
});

test("移除 drops the whole quantity in one click, not one unit", async ({ page }) => {
  await add(page, "美式咖啡", 3);
  await expect(page.locator('.cart-item[data-id="americano"]')).toContainText("美式咖啡 × 3");
  await page.getByRole("button", { name: "移除美式咖啡" }).click();
  await expect(page.locator('.cart-item[data-id="americano"]')).toHaveCount(0);
  await expect(page.locator("#cart-total")).toHaveText("NT$0");
});

test("removing every item brings back 購物車是空的 and NT$0", async ({ page }) => {
  await add(page, "拿鐵", 2);
  await add(page, "重乳酪蛋糕");
  await page.getByRole("button", { name: "移除拿鐵" }).click();
  await page.getByRole("button", { name: "移除重乳酪蛋糕" }).click();
  await expect(page.locator(".cart-item")).toHaveCount(0);
  await expect(page.locator("#cart-empty")).toBeVisible();
  await expect(page.locator("#cart-empty")).toHaveText("購物車是空的");
  await expect(page.locator("#cart-total")).toHaveText("NT$0");
});

test("removing the middle item keeps the other rows in order", async ({ page }) => {
  await add(page, "美式咖啡");
  await add(page, "卡布奇諾", 2);
  await add(page, "紅茶");
  await page.getByRole("button", { name: "移除卡布奇諾" }).click();
  await expect(page.locator(".cart-item")).toHaveCount(2);
  await expect(page.locator(".cart-item").nth(0)).toHaveAttribute("data-id", "americano");
  await expect(page.locator(".cart-item").nth(1)).toHaveAttribute("data-id", "black-tea");
  await expect(page.locator("#cart-total")).toHaveText("NT$140");
});

test("adding an item again after removing it starts from one", async ({ page }) => {
  await add(page, "拿鐵", 2);
  await page.getByRole("button", { name: "移除拿鐵" }).click();
  await add(page, "拿鐵");
  await expect(page.locator('.cart-item[data-id="latte"]')).toContainText("拿鐵 × 1");
  await expect(page.locator("#cart-total")).toHaveText("NT$110");
  await expect(page.locator("#cart-empty")).toBeHidden();
});

test("the 移除 button works from the keyboard", async ({ page }) => {
  await add(page, "拿鐵");
  await add(page, "摩卡");
  await page.getByRole("button", { name: "移除摩卡" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator('.cart-item[data-id="mocha"]')).toHaveCount(0);
  await page.getByRole("button", { name: "移除拿鐵" }).focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#cart-empty")).toBeVisible();
});

test("移除 does not submit the order or show a form error", async ({ page }) => {
  await page.getByLabel("姓名").fill("王小明");
  await page.getByLabel("手機號碼").fill("0912345678");
  await add(page, "拿鐵");
  await page.getByRole("button", { name: "移除拿鐵" }).click();
  await expect(page.locator("#confirmation")).toBeHidden();
  await expect(page.locator("#form-error")).toHaveText("");
});

test("a cart emptied with 移除 cannot be confirmed", async ({ page }) => {
  await add(page, "拿鐵");
  await page.getByRole("button", { name: "移除拿鐵" }).click();
  await page.getByRole("button", { name: "確認訂單" }).click();
  await expect(page.locator("#form-error")).toHaveText("請先加入至少一項餐點");
  await expect(page.locator("#confirmation")).toBeHidden();
});

test("an order still goes through after a removal", async ({ page }) => {
  await add(page, "拿鐵", 2);
  await add(page, "重乳酪蛋糕");
  await page.getByRole("button", { name: "移除拿鐵" }).click();
  await page.getByLabel("姓名").fill("王小明");
  await page.getByLabel("手機號碼").fill("0912345678");
  await page.getByLabel("取餐時間").selectOption("13:00");
  await page.getByRole("button", { name: "確認訂單" }).click();
  await expect(page.locator("#form-error")).toHaveText("");
  await expect(page.locator("#confirmation")).toHaveText("訂單已送出，請於 13:00 到店取餐");
});
