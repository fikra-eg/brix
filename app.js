(function () {
  const catalog = window.BRIX_CATALOG;
  const products = catalog.products;
  const categoryGroups = document.querySelector("[data-category-groups]");

  function imageMarkup(product) {
    return `
      <a class="product-card" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${product.name} details">
        <div class="product-image-wrap">
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" />
          <span class="product-number">BRIX / ${product.number}</span>
          <span class="product-image-index">↗</span>
        </div>
        <div class="product-meta" dir="ltr">
          <div class="product-copy">
            <h3 class="product-name" dir="ltr">${product.name}</h3>
            <p class="product-category" dir="rtl">${product.subtitle}</p>
          </div>
          <span class="product-price" dir="rtl">${window.BRIX_CART?.formatPrice(product.price) || `${product.price} ${catalog.currency}`}</span>
        </div>
        <span class="product-details-link" dir="rtl">اكتشف التفاصيل <span>↗</span></span>
      </a>`;
  }

  function bindImageFallback(img) {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
      img.removeAttribute("src");
      img.alt = "";
      img.parentElement?.classList.add("image-missing");
    }, { once: true });
  }

  categoryGroups.innerHTML = catalog.categories.map(category => {
    const categoryProducts = products.filter(product => product.category === category.id).sort((a, b) => Number(a.number) - Number(b.number));
    return `
      <section class="category-shelf reveal" id="${category.id}" data-category-shelf="${category.id}">
        <div class="category-heading">
          <div class="category-title-wrap">
            <span class="category-number">${category.number} / 03</span>
            <div>
              <p class="category-kicker">${category.title}</p>
              <h3 dir="rtl">${category.titleAr}<span>.</span></h3>
            </div>
          </div>
          <div class="category-heading-meta">
            <span class="category-total">${String(categoryProducts.length).padStart(2, "0")} PIECES</span>
            <p class="category-note" dir="rtl">${category.note}</p>
          </div>
        </div>
        <div class="product-grid ${categoryProducts.length < 4 ? "product-grid-compact" : ""}">
          ${categoryProducts.map(imageMarkup).join("")}
        </div>
      </section>`;
  }).join("");

  categoryGroups.querySelectorAll("img").forEach(bindImageFallback);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    categoryGroups.querySelectorAll(".category-shelf").forEach(el => observer.observe(el));
  } else {
    categoryGroups.querySelectorAll(".category-shelf").forEach(el => el.classList.add("is-visible"));
  }

  document.querySelector("[data-year]").textContent = new Date().getFullYear();
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
  }

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });
  mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }));
})();
