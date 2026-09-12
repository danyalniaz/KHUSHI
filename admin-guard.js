// ====================================================================
// KHUSHI COLLECTION — SECURE ADMIN GUARD (RBAC & SESSION VERIFICATION)
// ====================================================================

(function() {
if (window.location.protocol === 'file:') {
    const filename = window.location.pathname.split('/').pop();
    let target = '/admin';
    if (filename === 'admin-products.html') target = '/admin/products';
    else if (filename === 'admin-orders.html') target = '/admin/orders';
    else if (filename === 'admin-settings.html') target = '/admin/settings';
    else if (filename === 'admin-security.html') target = '/admin/security';
    else if (filename === 'admin-categories.html') target = '/admin/categories';
    window.location.replace('http://127.0.0.1:5000' + target);
}
    // Map each administrative page to its required granular permission
    const PAGE_PERMISSIONS = {
        'admin-dashboard.html': null, // Open to all authenticated admins
        'admin-products.html': 'products.view',
        'admin-categories.html': 'products.view',
        'admin-orders.html': 'orders.view',
        'admin-reports.html': 'reports.view',
        'admin-settings.html': 'settings.view',
        'admin-security.html': 'security.view',
        'admin-staff.html': 'users.view'
    };

    window.adminGuard = {
        user: null,
        permissions: new Set(),

        getCurrentPage() {
            const path = window.location.pathname;
            const file = path.split('/').pop() || 'admin-dashboard.html';
            return file.toLowerCase();
        },

        isOwner() {
            return this.user && (this.user.role === 'OWNER' || this.user.role === 'SUPER_ADMIN');
        },

        hasPermission(permCode) {
            if (!this.user) return false;
            if (this.isOwner()) return true;
            return this.permissions.has(permCode);
        },

        showAccessDenied(reason = 'You do not have permission to access this administrative module.') {
            document.documentElement.innerHTML = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>403 Access Denied — Khushi Collection</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
                </head>
                <body class="bg-[#080B11] text-zinc-100 min-h-screen flex items-center justify-center p-4">
                    <div class="max-w-md w-full p-8 rounded-3xl bg-zinc-900 border border-rose-500/30 text-center space-y-4 shadow-2xl">
                        <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto text-2xl">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <h1 class="text-2xl font-serif font-bold text-white">ACCESS DENIED (403)</h1>
                        <p class="text-xs text-zinc-400 leading-relaxed">
                            ${reason}
                        </p>
                        <div class="pt-4 flex items-center justify-center gap-3">
                            <a href="admin-dashboard.html" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider transition shadow">
                                Return to Dashboard
                            </a>
                            <button onclick="store.logout(); window.location.replace('admin-login.html');" class="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition">
                                Switch Account
                            </button>
                        </div>
                    </div>
                </body>
                </html>
            `;
        },

        filterNavigationLinks() {
            // Find and selectively hide navigation links based on permissions
            const navMappings = [
                { selector: 'a[href*="admin-products.html"]', perm: 'products.view' },
                { selector: 'a[href*="admin-categories.html"]', perm: 'products.view' },
                { selector: 'a[href*="admin-orders.html"]', perm: 'orders.view' },
                { selector: 'a[href*="admin-reports.html"]', perm: 'reports.view' },
                { selector: 'a[href*="admin-settings.html"]', perm: 'settings.view', ownerOnly: true },
                { selector: 'a[href*="admin-security.html"]', perm: 'security.view', ownerOnly: true },
                { selector: 'a[href*="admin-staff.html"]', perm: 'users.view' }
            ];

            navMappings.forEach(m => {
                if (m.ownerOnly && !this.isOwner()) {
                    document.querySelectorAll(m.selector).forEach(el => el.classList.add('hidden'));
                } else if (m.perm && !this.hasPermission(m.perm)) {
                    document.querySelectorAll(m.selector).forEach(el => el.classList.add('hidden'));
                }
            });
        },

        renderUserPill() {
            const container = document.getElementById('admin-user-pill');
            if (!container || !this.user) return;

            const isOwner = this.isOwner();
            const roleBadgeClass = isOwner 
                ? 'bg-amber-400/20 text-amber-400 border-amber-400/40' 
                : 'bg-zinc-800 text-zinc-300 border-zinc-700';

            const roleDisplay = isOwner ? 'Owner' : (this.user.role === 'MANAGER' ? 'Manager' : 'Staff');

            container.innerHTML = `
                <div class="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap">
                    <span class="px-2 sm:px-2.5 py-1 rounded-xl border ${roleBadgeClass} text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-sm whitespace-nowrap">
                        ${isOwner ? '👑' : '🛡️'} <span>${roleDisplay}</span><span class="hidden md:inline font-normal text-zinc-300">: ${this.user.name}</span>
                    </span>
                    ${isOwner ? `
                    <a href="admin-staff.html" class="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-zinc-700 hover:border-amber-400 text-zinc-400 hover:text-white text-xs font-semibold transition flex items-center justify-center" title="Staff & Roles">
                        <i class="fa-solid fa-users-gear text-xs"></i>
                    </a>
                    <a href="admin-security.html" class="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-zinc-700 hover:border-amber-400 text-zinc-400 hover:text-white text-xs font-semibold transition flex items-center justify-center" title="Security Center">
                        <i class="fa-solid fa-shield text-xs"></i>
                    </a>
                    ` : ''}
                    <button onclick="adminGuard.logout()" class="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition" title="Log Out Securely">
                        <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
                        <span class="hidden sm:inline">Logout</span>
                    </button>
                </div>
            `;
        },

        async logout() {
            try {
                await fetch('/admin/api/logout', { method: 'POST' });
            } catch (e) {}
            if (typeof store !== 'undefined' && store.logout) {
                store.logout();
            }
            window.location.replace('admin-login.html');
        },

        async init() {
            if (typeof store === 'undefined') return;

            let user = store.getCurrentUser ? store.getCurrentUser() : null;

            // Verify with backend session
            try {
                const res = await fetch('/admin/api/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.authenticated && data.user) {
                        user = data.user;
                        if (store.syncUserSession) {
                            store.syncUserSession(data.user);
                        }
                    }
                } else if (res.status === 401 || res.status === 403) {
                    if (store.logout) store.logout();
                    window.location.replace('admin-login.html');
                    return;
                }
            } catch (e) {
                // Fallback to local session
            }

            if (!user) {
                window.location.replace('admin-login.html');
                return;
            }

            const allowedRoles = ['OWNER', 'MANAGER', 'STAFF', 'SUPER_ADMIN'];
            if (!allowedRoles.includes(user.role)) {
                this.showAccessDenied('Customer accounts cannot access administrative portals.');
                return;
            }

            this.user = user;
            this.permissions = new Set(user.permissions || []);

            // Check page-level permission
            const currentPage = this.getCurrentPage();
            const requiredPerm = PAGE_PERMISSIONS[currentPage];

            if (requiredPerm && !this.hasPermission(requiredPerm)) {
                this.showAccessDenied(`Your staff account does not have permission '${requiredPerm}' required to view this page.`);
                return;
            }

            // Security and Settings are Owner-exclusive
            if ((currentPage === 'admin-security.html' || currentPage === 'admin-settings.html') && !this.isOwner()) {
                if (!this.hasPermission(requiredPerm)) {
                    this.showAccessDenied('Store Owner role is required to manage store settings and security controls.');
                    return;
                }
            }

            // Render pill and filter navigation on DOM ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.renderUserPill();
                    this.filterNavigationLinks();
                });
            } else {
                this.renderUserPill();
                this.filterNavigationLinks();
            }
        }
    };

    window.adminGuard.init();
})();

