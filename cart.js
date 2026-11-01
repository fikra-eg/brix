(function () {
  const STORAGE_KEY = "brix-cart-v1";
  const catalog = window.BRIX_CATALOG;
  const products = catalog.products;
  const cart = new Map();
  const drawer = document.querySelector("[data-cart-drawer]");
  const backdrop = document.querySelector("[data-cart-backdrop]");
  const itemsEl = document.querySelector("[data-cart-items]");
  const footerEl = document.querySelector("[data-cart-footer]");
  const toast = document.querySelector("[data-toast]");
  let toastTimer;

  function formatPrice(value) {
    return `${value.toLocaleString("ar-EG")} ${catalog.currency}`;
  }

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      saved.forEach(([id, quantity]) => {
        if (products.some(product => product.id === id) && Number.isInteger(quantity) && quantity > 0) cart.set(id, quantity);
      });
    } catch (error) {
      console.warn("Could not load BRIX cart", error);
    }
  }

  function persistCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...cart.entries()]));
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function render() {
    const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
    document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = count);
    if (!itemsEl || !footerEl) return;

    footerEl.hidden = count === 0;
    if (!count) {
      itemsEl.innerHTML = `
        <div class="empty-cart">
          <span class="empty-mark">B.</span>
          <p>YOUR BAG IS EMPTY</p>
          <span>Find the piece that completes your look.</span>
          <a href="index.html#collection" data-close-cart>EXPLORE THE COLLECTION ↗</a>
        </div>`;
      return;
    }

    itemsEl.innerHTML = [...cart.entries()].map(([id, quantity]) => {
      const product = products.find(item => item.id === id);
      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" />
          <div class="cart-item-info" dir="rtl">
            <h3>${product.name}</h3>
            <p>${formatPrice(product.price)}</p>
            <div class="quantity-control">
              <button type="button" aria-label="تقليل الكمية" data-minus="${id}">−</button>
              <span>${quantity}</span>
              <button type="button" aria-label="زيادة الكمية" data-plus="${id}">+</button>
            </div>
          </div>
          <button class="remove-item" type="button" data-remove="${id}">حذف</button>
        </div>`;
    }).join("");

    itemsEl.querySelectorAll("img").forEach(bindImageFallback);
  }

  function bindImageFallback(img) {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
      img.removeAttribute("src");
      img.alt = "";
      img.parentElement?.classList.add("image-missing");
    }, { once: true });
  }

  function add(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    cart.set(id, (cart.get(id) || 0) + 1);
    persistCart();
    render();
    showToast("Added to your bag.");
  }

  function update(id, change) {
    const next = (cart.get(id) || 0) + change;
    if (next <= 0) cart.delete(id); else cart.set(id, next);
    persistCart();
    render();
  }

  function remove(id) {
    cart.delete(id);
    persistCart();
    render();
  }

  function open() {
    if (!drawer || !backdrop) return;
    document.body.classList.add("cart-open", "no-scroll");
    drawer.setAttribute("aria-hidden", "false");
  }

  function close() {
    document.body.classList.remove("cart-open", "no-scroll");
    drawer?.setAttribute("aria-hidden", "true");
  }

  function orderText() {
    const lines = [...cart.entries()].map(([id, quantity]) => {
      const product = products.find(item => item.id === id);
      return `• ${product.name} — ${quantity} × ${formatPrice(product.price)}`;
    });
    return `مرحبًا BRIX، أود طلب القطع التالية:\n${lines.join("\n")}\n\nالإجمالي: ${formatPrice([...cart.entries()].reduce((sum, [id, quantity]) => sum + products.find(p => p.id === id).price * quantity, 0))}`;
  }

  document.querySelectorAll("[data-open-cart]").forEach(button => button.addEventListener("click", open));
  backdrop?.addEventListener("click", close);
  drawer?.addEventListener("click", event => {
    if (event.target.closest("[data-close-cart]")) close();
    const minus = event.target.closest("[data-minus]");
    const plus = event.target.closest("[data-plus]");
    const removeButton = event.target.closest("[data-remove]");
    if (minus) update(minus.dataset.minus, -1);
    if (plus) update(plus.dataset.plus, 1);
    if (removeButton) remove(removeButton.dataset.remove);
  });

  document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-product]");
    if (addButton) add(addButton.dataset.addProduct);
  });

  document.querySelector("[data-copy-order]")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(orderText());
      showToast("Order details copied.");
    } catch {
      showToast("Copy is not supported in this browser.");
    }
  });

  document.querySelector("[data-checkout]")?.addEventListener("click", () => {
    if (!cart.size) return;
    if (!catalog.whatsappNumber) {
      showToast("Add the brand WhatsApp number in js/catalog.js to enable checkout.");
      return;
    }
    window.open(`https://wa.me/${catalog.whatsappNumber}?text=${encodeURIComponent(orderText())}`, "_blank", "noopener,noreferrer");
  });

  loadCart();
  render();
  window.BRIX_CART = { add, open, close, render, formatPrice };
})();
