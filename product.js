(function () {
  const catalog = window.BRIX_CATALOG;
  document.querySelector("[data-year]").textContent = new Date().getFullYear();
  const params = new URLSearchParams(window.location.search);
  const product = catalog.products.find(item => item.id === params.get("id"));
  const main = document.querySelector("[data-product-detail]");

  if (!product) {
    main.innerHTML = `
      <section class="product-not-found" dir="rtl">
        <p class="eyebrow">BRIX / COLLECTION</p>
        <h1>القطعة غير متاحة</h1>
        <p>قد يكون الرابط غير صحيح أو أن المنتج لم يعد ضمن المجموعة الحالية.</p>
        <a class="button button-dark" href="index.html#collection">العودة إلى المجموعة ↗</a>
      </section>`;
    document.title = "المنتج غير متاح | BRIX";
    return;
  }

  const category = catalog.categories.find(item => item.id === product.category);
  const formattedPrice = window.BRIX_CART.formatPrice(product.price);
  document.title = `${product.name} | BRIX`;
  document.querySelector("[data-breadcrumb-category]").textContent = category.titleAr;
  document.querySelector("[data-breadcrumb-name]").textContent = product.name;

  main.innerHTML = `
    <section class="product-detail-layout" dir="rtl">
      <div class="detail-image-column">
        <div class="detail-main-image image-missing-shell">
          <img src="${product.image}" alt="${product.name}" fetchpriority="high" referrerpolicy="no-referrer" />
          <span class="detail-image-label">BRIX / ${product.category.toUpperCase()} ${product.number}</span>
        </div>
        <p class="detail-image-caption">تفاصيل مختارة بعناية — BRIX DROP 01</p>
      </div>
      <div class="detail-copy-column">
        <p class="detail-kicker">${category.title} / BRIX OBJECT</p>
        <h1 dir="ltr">${product.name}</h1>
        <p class="detail-subtitle" dir="rtl">${product.subtitle}</p>
        <p class="detail-price">${formattedPrice}</p>
        <div class="detail-rule"></div>
        <div class="detail-description-block">
          <span class="detail-label">عن القطعة</span>
          <p>${product.description}</p>
        </div>
        <div class="detail-description-block">
          <span class="detail-label">اقتراح التنسيق</span>
          <p>${product.styling}</p>
        </div>
        <div class="detail-specs">
          <div><span>التصنيف</span><strong>${category.titleAr}</strong></div>
          <div><span>السعر</span><strong>${formattedPrice}</strong></div>
          <div><span>الكود</span><strong>BRIX-${product.category.slice(0, 1).toUpperCase()}${product.number}</strong></div>
        </div>
        <button class="button button-dark detail-add-button" type="button" data-add-product="${product.id}">ADD TO BAG <span>＋</span></button>
        <p class="detail-note">تأكيد التوفر وتفاصيل الطلب من خلال فريق BRIX.</p>
        <a class="detail-back-link" href="index.html#${product.category}">← العودة إلى ${category.titleAr}</a>
      </div>
    </section>
    <section class="detail-more" dir="rtl">
      <div><p class="eyebrow">THE BRIX EDIT</p><h2>تفاصيل تصنع <em>الفرق.</em></h2></div>
      <a href="index.html#collection" class="text-link">استكشف باقي المجموعة ↗</a>
    </section>`;

  const detailImage = main.querySelector(".detail-main-image img");
  detailImage.addEventListener("error", () => {
    detailImage.removeAttribute("src");
    detailImage.alt = "";
    detailImage.classList.add("image-unavailable");
    detailImage.parentElement.classList.add("image-missing");
  }, { once: true });
})();
