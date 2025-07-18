// Product data
const products = [
    { id: 1, name: "Product 1", price: 500, image: "assets/product1.png" },
    { id: 2, name: "Product 2", price: 750, image: "assets/product2.png" },
    { id: 3, name: "Product 3", price: 300, image: "assets/product3.png" },
    { id: 4, name: "Product 4", price: 900, image: "assets/product4.png" },
];

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'cart.html') {
        renderCartItems();
    } else {
        renderProducts();
    }
    
    updateCartCount();
});

// Render products on the main page
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return; // Exit if not on products page
    
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; width: 100%; height: 100%; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 15px; align-items: center; justify-content: center; color: white; font-size: 48px;">📦</div>
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Visual feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.background = 'linear-gradient(45deg, #00b894, #55efc4)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }, 1000);
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return; // Exit if cart count element doesn't exist
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return; // Exit if not on cart page
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <a href="index.html" class="back-to-shop">
                    Continue Shopping
                </a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    updateCartSummary();
    cartSummary.style.display = 'block';
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.id !== productId);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
}

// Update cart summary
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');
    
    if (totalItemsElement) totalItemsElement.textContent = totalItems;
    if (totalPriceElement) totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}