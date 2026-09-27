const MENU = [
  { id: "americano", name: "美式咖啡", price: 80 },
  { id: "latte", name: "拿鐵", price: 110 },
  { id: "cappuccino", name: "卡布奇諾", price: 110 },
  { id: "mocha", name: "摩卡", price: 120 },
  { id: "black-tea", name: "紅茶", price: 60 },
  { id: "cheesecake", name: "重乳酪蛋糕", price: 95 },
];

const cart = new Map();

function formatPrice(amount) {
  return `NT$${amount}`;
}

function cartTotal() {
  let total = 0;
  for (const [id, quantity] of cart) {
    total += MENU.find((item) => item.id === id).price * quantity;
  }
  return total;
}

function renderMenu() {
  const list = document.getElementById("menu-list");
  for (const item of MENU) {
    const row = document.createElement("li");
    row.className = "menu-item";
    row.dataset.id = item.id;
    row.innerHTML = `<span class="name">${item.name}</span><span class="price">${formatPrice(item.price)}</span>`;
    const add = document.createElement("button");
    add.type = "button";
    add.textContent = "加入";
    add.setAttribute("aria-label", `加入${item.name}`);
    add.addEventListener("click", () => {
      cart.set(item.id, (cart.get(item.id) || 0) + 1);
      renderCart();
    });
    row.appendChild(add);
    list.appendChild(row);
  }
}

function renderCart() {
  const list = document.getElementById("cart-list");
  list.innerHTML = "";
  for (const [id, quantity] of cart) {
    const item = MENU.find((entry) => entry.id === id);
    const row = document.createElement("li");
    row.className = "cart-item";
    row.dataset.id = id;
    row.innerHTML = `<span>${item.name} × ${quantity}</span><span>${formatPrice(item.price * quantity)}</span>`;
    list.appendChild(row);
  }
  document.getElementById("cart-empty").hidden = cart.size > 0;
  document.getElementById("cart-total").textContent = formatPrice(cartTotal());
}

function validate(form) {
  if (cart.size === 0) return "請先加入至少一項餐點";
  if (!form.name.value.trim()) return "請填寫姓名";
  if (!/^09\d{8}$/.test(form.phone.value.trim())) return "手機號碼格式不正確";
  return "";
}

function onSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const error = validate(form);
  document.getElementById("form-error").textContent = error;
  if (error) return;
  const confirmation = document.getElementById("confirmation");
  confirmation.textContent = `訂單已送出，請於 ${form.pickup.value} 到店取餐`;
  confirmation.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderCart();
  document.getElementById("checkout").addEventListener("submit", onSubmit);
});
