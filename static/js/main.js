// Khushi Collection - Main Client Script

document.addEventListener('DOMContentLoaded', () => {
    initLiveSearch();
    initFlashSaleCountdown();
    initCartDrawer();
    updateCartCount();
    updateWishlistCount();
});

// Toast Notification Helper
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0 border ${
        type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/40' 
            : type === 'error'
            ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-900/40'
            : 'bg-amber-950/90 text-amber-200 border-amber-500/40 shadow-amber-900/40'
    }`;

    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-bell');
    toast.innerHTML = `<i class="fa-solid ${icon} text-lg"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// 1. Live Instant Search with Dropdown
function initLiveSearch() {
    const searchInputs = document.querySelectorAll('.global-search-input');
    const searchResultsBoxes = document.querySelectorAll('.global-search-results');

    searchInputs.forEach((input, index) => {
        const resultsBox = searchResultsBoxes[index];
        let debounceTimer;

        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value.trim();

            if (query.length < 2) {
                if (resultsBox) resultsBox.classList.add('hidden');
                return;
            }

            debounceTimer = setTimeout(async () => {
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    renderSearchResults(resultsBox, data, query);
                } catch (err) {
                    console.error('Search error:', err);
                }
            }, 250);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && (!resultsBox || !resultsBox.contains(e.target))) {
                if (resultsBox) resultsBox.classList.add('hidden');
            }
        });

        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 2 && resultsBox) {
                resultsBox.classList.remove('hidden');
            }
        });
    });
}

function renderSearchResults(resultsBox, data, query) {
    if (!resultsBox) return;
    resultsBox.classList.remove('hidden');

    if (!data.products || data.products.length === 0) {
        resultsBox.innerHTML = `
            <div class="p-6 text-center">
                <i class="fa-solid fa-magnifying-glass text-3xl text-zinc-600 mb-2"></i>
                <p class="text-sm text-zinc-400">No matching products found for "<span class="text-amber-400 font-semibold">${query}</span>"</p>
                <p class="text-xs text-zinc-500 mt-1">Try searching for Lawn, Velvet, Kurta, Oud, or Watches</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="p-3 border-b border-zinc-800 flex justify-between items-center text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            <span>Matching Products (${data.products.length})</span>
            <a href="/shop?q=${encodeURIComponent(query)}" class="text-amber-400 hover:text-amber-300">View All &rarr;</a>
        </div>
        <div class="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
    `;

    data.products.slice(0, 6).forEach(product => {
        html += `
            <a href="/product/${product.slug}" class="flex items-center gap-3.5 p-3 hover:bg-zinc-800/50 transition">
                <img src="${product.thumbnail}" alt="${product.name}" class="w-12 h-14 object-cover rounded-lg border border-zinc-700">
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">${product.brand || 'Khushi'}</p>
                    <h4 class="text-sm font-medium text-zinc-100 truncate">${product.name}</h4>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-xs font-bold text-amber-400">Rs. ${product.sale_price ? Number(product.sale_price).toLocaleString() : Number(product.price).toLocaleString()}</span>
                        ${product.sale_price ? `<span class="text-xs line-through text-zinc-500">Rs. ${Number(product.price).toLocaleString()}</span>` : ''}
                    </div>
                </div>
                <span class="text-xs text-zinc-500 px-2 py-1 bg-zinc-800 rounded">View</span>
            </a>
        `;
    });

    html += `</div>`;
    resultsBox.innerHTML = html;
}

// 2. Flash Sale Countdown Timer
function initFlashSaleCountdown() {
    const timers = document.querySelectorAll('.flash-sale-timer');
    if (!timers.length) return;

    function update() {
        // Target 2 days from fixed time or dynamically
        const now = new Date().getTime();
        const target = new Date();
        target.setHours(target.getHours() + 48); // 48-hour rolling flash sale
        const diff = (48 * 60 * 60 * 1000) - (now % (48 * 60 * 60 * 1000));

        const hours = Math.floor((diff / (1000 * 60 * 60)));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        timers.forEach(t => {
            const hElem = t.querySelector('.timer-hours');
            const mElem = t.querySelector('.timer-minutes');
            const sElem = t.querySelector('.timer-seconds');
            if (hElem) hElem.textContent = String(hours).padStart(2, '0');
            if (mElem) mElem.textContent = String(minutes).padStart(2, '0');
            if (sElem) sElem.textContent = String(seconds).padStart(2, '0');
        });
    }

    update();
    setInterval(update, 1000);
}

// 3. Cart Drawer and API Functions
function initCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    const openBtns = document.querySelectorAll('.open-cart-drawer');
    const closeBtns = document.querySelectorAll('.close-cart-drawer');

    function openCart() {
        if (!drawer || !overlay) return;
        loadCartDrawerItems();
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    function closeCart() {
        if (!drawer || !overlay) return;
        drawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    openBtns.forEach(b => b.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    }));
    closeBtns.forEach(b => b.addEventListener('click', closeCart));
    if (overlay) overlay.addEventListener('click', closeCart);
}

async function loadCartDrawerItems() {
    const container = document.getElementById('cart-drawer-items');
    const subtotalElem = document.getElementById('cart-drawer-subtotal');
    if (!container) return;

    try {
        const res = await fetch('/api/cart');
        const data = await res.json();

        if (!data.items || data.items.length === 0) {
            container.innerHTML = `
                <div class="py-16 text-center">
                    <div class="w-20 h-20 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
                        <i class="fa-solid fa-bag-shopping text-3xl"></i>
                    </div>
                    <h4 class="text-base font-serif font-bold text-zinc-200">Your bag is empty</h4>
                    <p class="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">Discover our timeless collections and treat yourself to luxury.</p>
                    <a href="/shop" class="inline-block mt-5 px-6 py-2.5 rounded-full btn-gold text-xs font-semibold uppercase tracking-wider">Start Shopping</a>
                </div>
            `;
            if (subtotalElem) subtotalElem.textContent = 'Rs. 0';
            return;
        }

        let html = '';
        data.items.forEach(item => {
            html += `
                <div class="flex gap-4 py-4 border-b border-zinc-800/80">
                    <img src="${item.thumbnail}" alt="${item.name}" class="w-16 h-20 object-cover rounded-lg border border-zinc-800 flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-zinc-100 truncate">${item.name}</h4>
                        <p class="text-xs text-zinc-400 mt-0.5">Size: <span class="text-zinc-200 font-semibold">${item.size || 'Standard'}</span> | Color: <span class="text-zinc-200 font-semibold">${item.color || 'Default'}</span></p>
                        <div class="flex items-center justify-between mt-3">
                            <div class="flex items-center border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900">
                                <button onclick="updateCartItemQty('${item.key}', ${item.quantity - 1})" class="px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 transition">-</button>
                                <span class="px-3 py-1 text-xs font-semibold text-zinc-200">${item.quantity}</span>
                                <button onclick="updateCartItemQty('${item.key}', ${item.quantity + 1})" class="px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 transition">+</button>
                            </div>
                            <span class="text-sm font-bold text-amber-400">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onclick="removeCartItem('${item.key}')" class="text-zinc-500 hover:text-rose-400 text-xs self-start transition">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
        if (subtotalElem) subtotalElem.textContent = `Rs. ${data.subtotal.toLocaleString()}`;
        updateCartCount(data.total_count);

    } catch (err) {
        console.error('Failed to load cart items:', err);
    }
}

async function addToCart(productId, quantity = 1, size = '', color = '') {
    try {
        const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity, size, color })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || 'Added to shopping bag!', 'success');
            updateCartCount(data.cart_count);
            loadCartDrawerItems();
            
            // Auto open mini cart drawer
            const drawer = document.getElementById('cart-drawer');
            const overlay = document.getElementById('cart-drawer-overlay');
            if (drawer && overlay) {
                drawer.classList.remove('translate-x-full');
                overlay.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
        } else {
            showToast(data.message || 'Could not add item.', 'error');
        }
    } catch (err) {
        showToast('Network error while adding to cart.', 'error');
    }
}

async function updateCartItemQty(itemKey, qty) {
    try {
        const res = await fetch('/api/cart/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: itemKey, quantity: qty })
        });
        const data = await res.json();
        if (data.success) {
            loadCartDrawerItems();
            if (typeof renderFullCartPage === 'function') renderFullCartPage();
        }
    } catch (err) {
        console.error(err);
    }
}

async function removeCartItem(itemKey) {
    try {
        const res = await fetch('/api/cart/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: itemKey })
        });
        const data = await res.json();
        if (data.success) {
            showToast('Item removed from bag', 'info');
            loadCartDrawerItems();
            if (typeof renderFullCartPage === 'function') renderFullCartPage();
        }
    } catch (err) {
        console.error(err);
    }
}

// 4. Wishlist Toggle
async function toggleWishlist(productId, btnElement) {
    try {
        const res = await fetch('/api/wishlist/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message, 'success');
            updateWishlistCount(data.wishlist_count);
            if (btnElement) {
                const icon = btnElement.querySelector('i');
                if (icon) {
                    if (data.in_wishlist) {
                        icon.classList.remove('fa-regular', 'text-zinc-400');
                        icon.classList.add('fa-solid', 'text-rose-500');
                    } else {
                        icon.classList.remove('fa-solid', 'text-rose-500');
                        icon.classList.add('fa-regular', 'text-zinc-400');
                    }
                }
            }
        }
    } catch (err) {
        showToast('Could not update wishlist.', 'error');
    }
}

// Counter helpers
async function updateCartCount(count = null) {
    const badges = document.querySelectorAll('.cart-badge-count');
    if (count !== null) {
        badges.forEach(b => {
            b.textContent = count;
            b.classList.toggle('hidden', count === 0);
        });
        return;
    }
    try {
        const res = await fetch('/api/cart/count');
        const data = await res.json();
        badges.forEach(b => {
            b.textContent = data.count;
            b.classList.toggle('hidden', data.count === 0);
        });
    } catch (e) {}
}

async function updateWishlistCount(count = null) {
    const badges = document.querySelectorAll('.wishlist-badge-count');
    if (count !== null) {
        badges.forEach(b => {
            b.textContent = count;
            b.classList.toggle('hidden', count === 0);
        });
        return;
    }
    try {
        const res = await fetch('/api/wishlist/count');
        const data = await res.json();
        badges.forEach(b => {
            b.textContent = data.count;
            b.classList.toggle('hidden', data.count === 0);
        });
    } catch (e) {}
}

// Quick View Modal
async function openQuickView(productId) {
    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="py-16 text-center">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-amber-400"></i>
            <p class="text-xs text-zinc-400 mt-3 font-semibold uppercase tracking-wider">Loading product details...</p>
        </div>
    `;
    modal.classList.remove('hidden');

    try {
        const res = await fetch(`/api/products/${productId}`);
        const product = await res.json();

        const sizes = JSON.parse(product.sizes || '[]');
        const colors = JSON.parse(product.colors || '[]');

        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Gallery -->
                <div>
                    <img id="qv-main-img" src="${product.thumbnail}" class="w-full h-96 object-cover rounded-2xl border border-zinc-800 shadow-2xl">
                </div>
                <!-- Details -->
                <div class="flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs uppercase tracking-widest text-amber-400 font-semibold">${product.brand || 'Khushi Signature'}</span>
                            <span class="text-xs px-2.5 py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/80 text-rose-400'} font-semibold">
                                ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <h2 class="text-2xl font-serif font-bold text-white mt-2">${product.name}</h2>
                        
                        <div class="flex items-center gap-3 mt-3">
                            <span class="text-2xl font-bold text-amber-400">Rs. ${product.sale_price ? Number(product.sale_price).toLocaleString() : Number(product.price).toLocaleString()}</span>
                            ${product.sale_price ? `<span class="text-base line-through text-zinc-500">Rs. ${Number(product.price).toLocaleString()}</span>` : ''}
                        </div>

                        <p class="text-xs text-zinc-300 mt-4 leading-relaxed line-clamp-3">${product.description}</p>

                        <!-- Size selection -->
                        ${sizes.length > 0 ? `
                            <div class="mt-5">
                                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">Select Size</label>
                                <div class="flex flex-wrap gap-2" id="qv-size-selector">
                                    ${sizes.map((s, idx) => `
                                        <button type="button" onclick="selectVariantOption(this, 'size')" data-val="${s}" class="size-btn px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition ${idx === 0 ? 'border-amber-400 bg-amber-400/10 text-amber-400' : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'}">
                                            ${s}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Color selection -->
                        ${colors.length > 0 ? `
                            <div class="mt-4">
                                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">Select Color</label>
                                <div class="flex flex-wrap gap-2.5" id="qv-color-selector">
                                    ${colors.map((c, idx) => `
                                        <button type="button" onclick="selectVariantOption(this, 'color')" data-val="${c.name}" title="${c.name}" class="color-btn w-7 h-7 rounded-full border-2 transition ${idx === 0 ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900' : 'border-zinc-700'}" style="background-color: ${c.hex}">
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="mt-8 pt-6 border-t border-zinc-800 flex gap-3">
                        <button onclick="handleQuickViewAddToCart(${product.id})" class="flex-1 py-3 px-6 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                        </button>
                        <a href="/product/${product.slug}" class="py-3 px-5 rounded-xl border border-zinc-700 hover:border-amber-400 text-zinc-200 text-xs font-bold uppercase tracking-wider transition">
                            Full Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        content.innerHTML = `<div class="p-6 text-center text-rose-400">Failed to load product.</div>`;
    }
}

function selectVariantOption(btn, type) {
    const parent = btn.parentElement;
    if (type === 'size') {
        parent.querySelectorAll('button').forEach(b => {
            b.className = 'size-btn px-3.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 text-xs font-semibold transition';
        });
        btn.className = 'size-btn px-3.5 py-1.5 rounded-lg border border-amber-400 bg-amber-400/10 text-amber-400 text-xs font-semibold transition';
    } else if (type === 'color') {
        parent.querySelectorAll('button').forEach(b => {
            b.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-zinc-900');
        });
        btn.classList.add('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-zinc-900');
    }
}

function handleQuickViewAddToCart(productId) {
    const sizeBtn = document.querySelector('#qv-size-selector .border-amber-400');
    const colorBtn = document.querySelector('#qv-color-selector .ring-amber-400');
    
    const size = sizeBtn ? sizeBtn.getAttribute('data-val') : '';
    const color = colorBtn ? colorBtn.getAttribute('data-val') : '';

    addToCart(productId, 1, size, color);
    closeQuickView();
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) modal.classList.add('hidden');
}
