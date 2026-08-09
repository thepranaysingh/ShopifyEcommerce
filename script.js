const products = [
  {
    id: 1,
    name: "Everyday Carry Bottle",
    category: "Lifestyle",
    price: 1499,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",
    description: "A timeless everyday bottle designed with a clean silhouette and comfortable grip."
  },
  {
    id: 2,
    name: "Canvas Utility Bag",
    category: "Accessories",
    price: 2199,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    description: "A versatile carryall made for commutes, weekends and everything between."
  },
  {
    id: 3,
    name: "Studio Headphones",
    category: "Tech",
    price: 4999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    description: "Comfortable over-ear headphones designed for focused listening and everyday travel."
  },
  {
    id: 4,
    name: "Classic Timepiece",
    category: "Accessories",
    price: 6499,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    description: "A minimal everyday watch with a timeless silhouette and refined details."
  },
  {
    id: 5,
    name: "Everyday Fragrance",
    category: "Lifestyle",
    price: 2899,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    description: "A clean, understated fragrance created for everyday wear."
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug",
    category: "Home",
    price: 899,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
    description: "A simple ceramic mug made for slow mornings and everyday coffee rituals."
  },
  {
    id: 7,
    name: "Minimal Desk Lamp",
    category: "Home",
    price: 3299,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    description: "A warm, minimal desk lamp that adds practical light without visual clutter."
  },
  {
    id: 8,
    name: "Portable Speaker",
    category: "Tech",
    price: 3799,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=85",
    description: "A compact speaker designed to bring clear sound into your everyday spaces."
  }
];

let cart = JSON.parse(localStorage.getItem("shopify-cart") || "[]");

const grid = document.getElementById("productGrid");
const count = document.getElementById("productCount");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const toast = document.getElementById("toast");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalVisual = document.getElementById("modalVisual");

const money = value => `₹${value.toLocaleString("en-IN")}`;

function renderProducts(list = products) {
  count.textContent = `${list.length} products`;

  if (!list.length) {
    grid.innerHTML = "<p>No products found.</p>";
    return;
  }

  grid.innerHTML = list.map(product => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-meta">
          <span class="product-category">${product.category}</span>
          <span class="product-price">${money(product.price)}</span>
        </div>
        <button class="quick-add" data-add="${product.id}">Add to cart</button>
      </div>
    </article>
  `).join("");
}

function saveCart() {
  localStorage.setItem("shopify-cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  cartCount.textContent = totalItems;

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        Your bag is empty.<br>
        Add something you love.
      </div>
    `;
    cartTotal.textContent = "₹0";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="mini-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div>
        <h4>${item.name}</h4>
        <p>${money(item.price)} × ${item.qty}</p>
        <button class="remove" data-remove="${item.id}">Remove</button>
      </div>
      <strong>${money(item.price * item.qty)}</strong>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.textContent = money(total);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  showToast(`${product.name} added to cart`);
}

function openModal(id) {
  const product = products.find(item => item.id === id);

  document.getElementById("modalCategory").textContent = product.category;
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalPrice").textContent = money(product.price);
  document.getElementById("modalDescription").textContent = product.description;

  modalVisual.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
  `;

  document.getElementById("modalAdd").onclick = () => {
    addToCart(product.id);
    modalBackdrop.classList.remove("show");
  };

  modalBackdrop.classList.add("show");
}

function closeDrawer() {
  cartDrawer.classList.remove("open");
  drawerOverlay.classList.remove("show");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

renderProducts();
renderCart();

grid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const card = event.target.closest(".product-card");

  if (addButton) {
    event.stopPropagation();
    addToCart(Number(addButton.dataset.add));
    return;
  }

  if (card) {
    openModal(Number(card.dataset.id));
  }
});

cartItems.addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove]");

  if (!removeButton) {
    return;
  }

  cart = cart.filter(item => item.id !== Number(removeButton.dataset.remove));
  saveCart();
});

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const category = button.dataset.category;

    renderProducts(
      category === "All"
        ? products
        : products.filter(product => product.category === category)
    );
  });
});

document.getElementById("cartBtn").addEventListener("click", () => {
  cartDrawer.classList.add("open");
  drawerOverlay.classList.add("show");
});

document.getElementById("closeCart").addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

document.getElementById("modalClose").addEventListener("click", () => {
  modalBackdrop.classList.remove("show");
});

modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) {
    modalBackdrop.classList.remove("show");
  }
});

document.getElementById("searchBtn").addEventListener("click", () => {
  document.getElementById("searchPanel").classList.toggle("show");
});

document.getElementById("closeSearch").addEventListener("click", () => {
  document.getElementById("searchPanel").classList.remove("show");
});

document.getElementById("searchInput").addEventListener("input", event => {
  const query = event.target.value.toLowerCase().trim();

  renderProducts(
    products.filter(product =>
      `${product.name} ${product.category}`.toLowerCase().includes(query)
    )
  );
});

document.getElementById("mobileMenu").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav").classList.remove("open");
  });
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your cart is empty");
    return;
  }

  showToast("Checkout demo — connect a payment gateway here");
});
