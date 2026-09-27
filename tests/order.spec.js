const { test, expect } = require("@playwright/test");
const { PAGE } = require("./helpers");

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE);
});

test("the menu lists six items with prices", async ({ page }) => {
  await expect(page.locator(".menu-item")).toHaveCount(6);
  await expect(page.locator('.menu-item[data-id="latte"] .price')).toHaveText("NT$110");
});

test("adding items updates the cart and the total", async ({ page }) => {
  await expect(page.locator("#cart-empty")).toBeVisible();
  await page.getByRole("button", { name: "加入拿鐵" }).click();
  await page.getByRole("button", { name: "加入拿鐵" }).click();
  await page.getByRole("button", { name: "加入重乳酪蛋糕" }).click();
  await expect(page.locator(".cart-item")).toHaveCount(2);
  await expect(page.locator('.cart-item[data-id="latte"]')).toContainText("拿鐵 × 2");
  await expect(page.locator("#cart-total")).toHaveText("NT$315");
  await expect(page.locator("#cart-empty")).toBeHidden();
});

test("an empty cart cannot be submitted", async ({ page }) => {
  await page.getByRole("button", { name: "確認訂單" }).click();
  await expect(page.locator("#form-error")).toHaveText("請先加入至少一項餐點");
});

test("name and phone are validated", async ({ page }) => {
  await page.getByRole("button", { name: "加入美式咖啡" }).click();
  await page.getByRole("button", { name: "確認訂單" }).click();
  await expect(page.locator("#form-error")).toHaveText("請填寫姓名");
  await page.getByLabel("姓名").fill("王小明");
  await page.getByLabel("手機號碼").fill("12345");
  await page.getByRole("button", { name: "確認訂單" }).click();
  await expect(page.locator("#form-error")).toHaveText("手機號碼格式不正確");
});

test("a valid order shows the pickup confirmation", async ({ page }) => {
  await page.getByRole("button", { name: "加入美式咖啡" }).click();
  await page.getByLabel("姓名").fill("王小明");
  await page.getByLabel("手機號碼").fill("0912345678");
  await page.getByLabel("取餐時間").selectOption("12:30");
  await page.getByRole("button", { name: "確認訂單" }).click();
  await expect(page.locator("#form-error")).toHaveText("");
  await expect(page.locator("#confirmation")).toHaveText("訂單已送出，請於 12:30 到店取餐");
});

test("the layout stacks on a phone-width screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  const menu = await page.locator(".menu").boundingBox();
  const order = await page.locator(".order").boundingBox();
  expect(order.y).toBeGreaterThanOrEqual(menu.y + menu.height);
});
