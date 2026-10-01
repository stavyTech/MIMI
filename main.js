// Sample Products Data
const products = [
  { id: 1, name: 'Signature Iced Latte', category: 'coffee', price: 4000, desc: 'Single-origin espresso layered over sweetened organic milk.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Uji Ceremonial Matcha', category: 'matcha', price: 4800, desc: 'Authentic grade matcha whisked to perfection with oat milk.', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Berry Cream Blend', category: 'blends', price: 5200, desc: 'Rich strawberry compote topped with velvety cold foam.', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600' },
  { id: 4, name: 'Artisan Club Sandwich', category: 'food', price: 6500, desc: 'Fresh avocado, turkey slices, and homemade pesto on warm sourdough.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600' },
];

let cart = [];

// DOM Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  initMobileMenu();
  initCartDrawer();
  initPolicyModal();
  initFilterTabs();
});

// 1. Render Products
function renderProducts(category) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async">
        <div class="card-overlay">
          <p><strong>Description:</strong></p>
          <p>${product.desc}</p>
        </div>
      </div>
      <div class="card-content">
        <div class="card-info">
          <h3>${product.name}</h3>
          <span class="card-price">₦${product.price.toLocaleString()}</span>
        </div>
        <button class="btn btn-primary btn-block add-to-cart-btn" data-id="${product.id}">
          <span class="btn-text">Add to Bag</span>
          <span class="btn-spinner hidden"></span>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Attach button loader click events
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.currentTarget;
      const text = button.querySelector('.btn-text');
      const spinner = button.querySelector('.btn-spinner');
      const productId = parseInt(button.dataset.id);

      text.classList.add('hidden');
      spinner.classList.remove('hidden');

      setTimeout(() => {
        addToCart(productId);
        spinner.classList.add('hidden');
        text.classList.remove('hidden');
      }, 500);
    });
  });
}

// 2. Mobile Menu Handler (Uncommented & Safe-Checked)
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('is-active');
      mobileNav.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('is-active');
        mobileNav.classList.remove('open');
      });
    });
  }
}

// 3. Operational Policy Modal Handler
function initPolicyModal() {
  const backdrop = document.getElementById('policy-modal-backdrop');
  const closeBtn = document.getElementById('close-policy-btn');
  const confirmBtn = document.getElementById('confirm-policy-btn');
  const openBannerBtn = document.getElementById('open-policy-btn');
  const openHeroBtn = document.getElementById('hero-policy-btn');

  const openModal = () => {
    if (backdrop) backdrop.classList.add('active');
  };

  const closeModal = () => {
    if (backdrop) backdrop.classList.remove('active');
  };

  // Open modal on load
  openModal();

  // Close Event Listeners
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeModal();
    };
  }

  if (confirmBtn) {
    confirmBtn.onclick = (e) => {
      e.stopPropagation();
      closeModal();
    };
  }

  // Re-open Event Listeners
  if (openBannerBtn) openBannerBtn.onclick = openModal;
  if (openHeroBtn) openHeroBtn.onclick = openModal;

  // Backdrop click handler
  if (backdrop) {
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeModal();
    };
  }
}

// 4. Cart State & Side Drawer
function initCartDrawer() {
  const cartBtn = document.getElementById('cart-toggle-btn');
  const closeBtn = document.getElementById('close-cart-btn');
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const checkoutBtn = document.getElementById('checkout-btn');

  const openCart = () => {
    drawer?.classList.add('open');
    backdrop?.classList.add('active');
  };

  const closeCart = () => {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('active');
  };

  cartBtn?.addEventListener('click', openCart);
  closeBtn?.addEventListener('click', closeCart);
  backdrop?.addEventListener('click', closeCart);

  checkoutBtn?.addEventListener('click', () => {
    const text = checkoutBtn.querySelector('.btn-text');
    const spinner = checkoutBtn.querySelector('.btn-spinner');
    text?.classList.add('hidden');
    spinner?.classList.remove('hidden');

    setTimeout(() => {
      alert('Checkout process initiated!');
      spinner?.classList.add('hidden');
      text?.classList.remove('hidden');
      cart = [];
      updateCartUI();
      closeCart();
    }, 1000);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty++;
  } else if (item) {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const container = document.getElementById('cart-items-container');
  const totalDisplay = document.getElementById('cart-total-amount');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (badge) badge.textContent = totalQty;
  if (totalDisplay) totalDisplay.textContent = `₦${totalPrice.toLocaleString()}`;

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center; padding: 2rem; color: #888;">Your bag is empty.</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1;">
        <h4>${item.name}</h4>
        <p style="font-size: 0.8rem; color: #666;">₦${item.price.toLocaleString()} x ${item.qty}</p>
      </div>
    </div>
  `).join('');
}

// 5. Category Tabs
function initFilterTabs() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderProducts(e.target.dataset.category);
    });
  });
}