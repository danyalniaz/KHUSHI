// ====================================================================
// KHUSHI COLLECTION — SECURE ADMIN GUARD (RBAC & SESSION VERIFICATION)
// ====================================================================

(function() {
    function enforceAdminSecurity() {
        if (typeof store === 'undefined') return;

        const user = store.getCurrentUser();
        if (!user) {
            window.location.replace('admin-login.html');
            return;
        }

        // Strictly verify user role
        const allowedRoles = ['OWNER', 'MANAGER', 'STAFF'];
        if (!allowedRoles.includes(user.role)) {
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
                            Your account is authenticated as a customer. Customer accounts cannot access the Khushi Collection Administrative Management Console.
                        </p>
                        <div class="pt-4">
                            <a href="index.html" class="inline-block px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-widest shadow">
                                Return to Storefront
                            </a>
                        </div>
                    </div>
                </body>
                </html>
            `;
            return;
        }

        // Render Owner/Staff pill and Logout Button into Header
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('admin-user-pill');
            if (container) {
                const roleBadgeClass = user.role === 'OWNER' 
                    ? 'bg-amber-400/20 text-amber-400 border-amber-400/40' 
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700';

                container.innerHTML = `
                    <div class="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap">
                        <span class="px-2 sm:px-2.5 py-1 rounded-xl border ${roleBadgeClass} text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-sm whitespace-nowrap">
                            ${user.role === 'OWNER' ? '👑' : '🛡️'} <span>${user.role === 'OWNER' ? 'Owner' : user.role}</span><span class="hidden md:inline font-normal text-zinc-300">: ${user.name}</span>
                        </span>
                        <a href="admin-security.html" class="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-zinc-700 hover:border-amber-400 text-zinc-400 hover:text-white text-xs font-semibold transition flex items-center justify-center" title="Security Settings">
                            <i class="fa-solid fa-lock text-xs"></i>
                        </a>
                        <button onclick="store.logout(); window.location.replace('admin-login.html');" class="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition" title="Log Out Securely">
                            <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
                            <span class="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                `;
            }
        });
    }

    enforceAdminSecurity();
})();
