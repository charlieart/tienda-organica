// Configuración de Tailwind CSS
// Esta configuración se aplica globalmente antes de que Tailwind procese el DOM.
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#27724e",
                "terracotta": "#D47253",
                "sage": "#6a8176",
                "gold": "#C5A059",
                "background-light": "#ffffff",
                "background-dark": "#1b1a18",
                "surface-light": "#FBFAF8",
                "surface-dark": "#252422",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "serif": ["Playfair Display", "serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
        },
    },
};

// Lógica de Interacción General
document.addEventListener('DOMContentLoaded', () => {
    // Manejo del Menú Móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    if (mobileMenuBtn && mobileMenu && closeMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir comportamientos por defecto
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex'); // Forzar display: flex al abrir
            document.body.style.overflow = 'hidden'; // Bloquear scroll
        });

        closeMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex'); // Quitar display: flex al cerrar
            document.body.style.overflow = ''; // Restaurar scroll
        });
    } else {
        console.warn('Elementos del menú móvil no encontrados en el DOM.');
    }

    // Modal de Productos
    const productModal = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');

    // Función para abrir el modal
    function openModal(data) {
        if (!productModal) return;

        // Poblar datos básicos
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-price').textContent = data.price;
        document.getElementById('modal-description').textContent = data.description;
        document.getElementById('modal-image').src = data.image;

        // Manejo de variantes en el modal
        const variantsContainer = document.getElementById('modal-variants-container');
        const selectorWrapper = document.getElementById('modal-selector-wrapper');

        if (variantsContainer && selectorWrapper) {
            selectorWrapper.innerHTML = ''; // Limpiar

            if (data.selector) {
                const clonedSelect = data.selector.cloneNode(true);
                clonedSelect.value = data.selector.value; // Sincronizar valor inicial

                // Quitar el ID original para evitar conflictos si tuviera
                clonedSelect.removeAttribute('id');

                // Escuchar cambios en el selector del modal
                clonedSelect.addEventListener('change', (e) => {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    const newPrice = `S/. ${e.target.value}`;
                    const sizeLabel = selectedOption.getAttribute('data-size') || selectedOption.textContent.split('-')[0].trim();

                    document.getElementById('modal-price').textContent = newPrice;
                    document.getElementById('modal-title').textContent = `${data.originalTitle} (${sizeLabel})`;

                    // Sincronizar hacia atrás con la tarjeta original
                    data.selector.value = e.target.value;
                    // Disparar evento de cambio original para que se actualice el precio en la tarjeta si tiene lógica asociada
                    data.selector.dispatchEvent(new Event('change'));
                });

                selectorWrapper.appendChild(clonedSelect);
                variantsContainer.classList.remove('hidden');
            } else {
                variantsContainer.classList.add('hidden');
            }
        }

        // Mostrar modal
        productModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Función para cerrar el modal
    function closeModal() {
        if (!productModal) return;
        productModal.classList.add('hidden');
        document.body.style.overflow = '';

        // Limpiar variantes al cerrar
        const variantsContainer = document.getElementById('modal-variants-container');
        if (variantsContainer) variantsContainer.classList.add('hidden');
    }

    // Event Listeners para cerrar
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal && !productModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Delegación de eventos para las tarjetas de productos
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.group');
        // Asegurarse de que sea una tarjeta de producto (verificando si tiene precio y título)
        if (card && card.querySelector('h3') && card.querySelector('p')) {
            // Evitar si se hizo click en el botón de agregar al carrito o favoritos
            if (e.target.closest('button')) return;

            const originalTitle = card.querySelector('h3') ? card.querySelector('h3').textContent : "Producto";
            let title = originalTitle;
            const priceEl = card.querySelector('.font-black, .font-serif.font-black, .dmso-price-display, .agua-mar-price-display, .coco-price-display, .miel-price-display');
            const price = priceEl ? priceEl.textContent : "S/. 0.00";
            const pEl = card.querySelector('p');
            const description = pEl ? pEl.textContent : "";

            // Manejo de variaciones (como tamaños) en la apertura inicial
            const selectSize = card.querySelector('select');
            if (selectSize) {
                const selectedOption = selectSize.options[selectSize.selectedIndex];
                const sizeLabel = selectedOption.getAttribute('data-size') || selectedOption.textContent.split('-')[0].trim();
                title = `${title} (${sizeLabel})`;
            }

            // Si al menos tenemos título y precio, podemos abrir el modal
            if (title && price) {
                // Buscar la imagen: puede estar en style (background-image) o src
                let image = "";
                const bgDiv = card.querySelector('.bg-cover, .bg-contain, [style*="background-image"]');
                if (bgDiv) {
                    const style = window.getComputedStyle(bgDiv);
                    const bgImage = style.backgroundImage;
                    if (bgImage && bgImage !== 'none') {
                        image = bgImage.replace(/^url\(\s*["']?/, '').replace(/["']?\s*\)$/, '');
                    }
                }

                if (!image || image === 'none') {
                    const imgTag = card.querySelector('img');
                    if (imgTag) image = imgTag.src;
                }

                openModal({ title, originalTitle, price, description, image, selector: selectSize });
            }
        }
    });

    // Función genérica para actualizar precios de variantes
    window.updateVariantPrice = function (select, displayClass) {
        const card = select.closest('.group');
        if (!card) return;
        const priceDisplay = card.querySelector(`.${displayClass}`);
        if (priceDisplay) {
            priceDisplay.textContent = `S/. ${select.value}`;
        }
    };

    // Función global para actualizar precios de productos con variantes
    window.updateDMSOPrice = function (select) {
        updateVariantPrice(select, 'dmso-price-display');
    };

    // Función global para actualizar precio de Agua de Mar
    window.updateAguaMarPrice = function (select) {
        updateVariantPrice(select, 'agua-mar-price-display');
    };

    // Función global para actualizar precio de Aceite de Coco
    window.updateCocoPrice = function (select) {
        updateVariantPrice(select, 'coco-price-display');
    };

    // Función global para actualizar precio de Miel de Abeja
    window.updateMielPrice = function (select) {
        updateVariantPrice(select, 'miel-price-display');
    };

    // --- Lógica del Carrito de Compras ---
    const cartDrawer = document.getElementById('cart-drawer');
    const cartPanel = document.getElementById('cart-panel');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTotalEl = document.getElementById('cart-total');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const cartBadge = document.querySelector('.shopping-bag-badge'); // Badge del header

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para guardar el carrito
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    // Actualizar contador del badge
    function updateCartCount() {
        const totalCount = cart.reduce((total, item) => total + item.quantity, 0);

        // Buscar todos los badges posibles (desktop y mobile)
        const badges = document.querySelectorAll('.shopping-bag-badge, .fa-shopping-bag + span, .material-symbols-outlined + span');

        badges.forEach(badge => {
            if (badge) {
                badge.textContent = totalCount;
                if (totalCount === 0) {
                    badge.classList.add('hidden');
                } else {
                    badge.classList.remove('hidden');
                }
            }
        });
    }

    // Abrir Carrito
    function openCart() {
        if (!cartDrawer) return;
        cartDrawer.classList.remove('hidden');
        cartBackdrop.classList.remove('opacity-0');
        setTimeout(() => {
            cartPanel.classList.remove('translate-x-full');
        }, 10);
        document.body.style.overflow = 'hidden';
        renderCartItems();
    }

    // Cerrar Carrito
    function closeCart() {
        if (!cartDrawer) return;
        cartPanel.classList.add('translate-x-full');
        setTimeout(() => {
            cartDrawer.classList.add('hidden');
            cartBackdrop.classList.add('opacity-0');
        }, 500);
        document.body.style.overflow = '';
    }

    // Renderizar Items
    function renderCartItems() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartItemsContainer.parentElement.classList.add('hidden'); // Ocultar lista
        } else {
            emptyCartMessage.classList.add('hidden');
            cartItemsContainer.parentElement.classList.remove('hidden');

            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'flex py-6';

                // Parse Price robustamente
                let cleanedPrice = item.price.replace(/^[^\d]+/, ''); // Eliminar "S/. " o cualquier prefijo no numérico
                let priceNum = parseFloat(cleanedPrice.replace(/[^0-9.]/g, ''));
                if (isNaN(priceNum)) priceNum = 0;
                total += priceNum * item.quantity;

                li.innerHTML = `
                    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img src="${item.image}" alt="${item.title}" class="h-full w-full object-cover object-center">
                    </div>

                    <div class="ml-4 flex flex-1 flex-col">
                        <div>
                            <div class="flex justify-between text-base font-medium text-gray-900">
                                <h3><a href="#">${item.title}</a></h3>
                                <p class="ml-4">${item.price}</p>
                            </div>
                        </div>
                        <div class="flex flex-1 items-end justify-between text-sm">
                            <div class="flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1">
                                <button type="button" class="text-gray-500 hover:text-[#27724e] decrease-qty" data-index="${index}">-</button>
                                <span class="text-gray-900 font-medium">${item.quantity}</span>
                                <button type="button" class="text-gray-500 hover:text-[#27724e] increase-qty" data-index="${index}">+</button>
                            </div>

                            <button type="button" class="font-medium text-[#D47253] hover:text-[#b05d43] remove-item" data-index="${index}">Eliminar</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(li);
            });
        }

        // Formatear Total
        if (cartTotalEl) cartTotalEl.textContent = 'S/. ' + total.toFixed(2);
    }

    // Add to Cart Logic
    function addToCart(product) {
        const existingItemIndex = cart.findIndex(item => item.title === product.title);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart();
        openCart(); // Abrir carrito al agregar
    }

    // Event Listeners para el Carrito
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);

    // Event Delegation para botones dentro del carrito
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (index === null) return;

            if (e.target.classList.contains('remove-item')) {
                cart.splice(index, 1);
            } else if (e.target.classList.contains('increase-qty')) {
                cart[index].quantity += 1;
            } else if (e.target.classList.contains('decrease-qty')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
            }
            saveCart();
        });
    }

    // --- Lógica de WhatsApp Checkout ---
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            const phoneNumber = "51946149352";
            let message = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
            let total = 0;

            cart.forEach((item, index) => {
                let cleanedPrice = item.price.replace(/^[^\d]+/, '');
                let priceNum = parseFloat(cleanedPrice.replace(/[^0-9.]/g, ''));
                if (isNaN(priceNum)) priceNum = 0;

                const subtotal = priceNum * item.quantity;
                total += subtotal;

                message += `*${item.title.trim()}*\n`;
                message += `Cantidad: ${item.quantity}\n`;
                message += `Precio: ${item.price}\n`;
                message += `Subtotal: S/. ${subtotal.toFixed(2)}\n\n`;
            });

            message += `*TOTAL A PAGAR: S/. ${total.toFixed(2)}*\n\n`;
            message += "Muchas gracias.";

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Abrir carrito desde los iconos del header
    const cartIcons = document.querySelectorAll('.material-symbols-outlined');
    cartIcons.forEach(icon => {
        if (icon.textContent.trim() === 'shopping_bag') {
            const btn = icon.closest('button');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); // Evitar navegación si es enlace
                    openCart();
                });
            }
        }
    });

    // Delegación de eventos para agregar al carrito (actualizado)
    document.addEventListener('click', (e) => {
        // Buscar botón de agregar
        const addBtn = e.target.closest('button');
        if (!addBtn) return;

        // Verificar si es el botón de agregar del modal o de una card
        if (addBtn.textContent.includes('Agregar al Carrito') || addBtn.querySelector('.material-symbols-outlined')?.textContent === 'add_shopping_cart' || addBtn.textContent.includes('shopping_bag')) {
            e.preventDefault(); // Prevenir propagación que abriría el modal de nuevo

            // Caso 1: Click en el Modal
            const modal = document.getElementById('product-modal');
            if (modal && !modal.classList.contains('hidden') && modal.contains(addBtn)) {
                const title = document.getElementById('modal-title').textContent;
                const price = document.getElementById('modal-price').textContent;
                const description = document.getElementById('modal-description').textContent;
                const image = document.getElementById('modal-image').src;

                addToCart({ title, price, description, image });
                closeModal(); // Cerrar modal de producto al agregar
                return;
            }

            // Caso 2: Click en Card
            const card = addBtn.closest('.group');
            if (card) {
                e.stopPropagation(); // Detener que se abra el modal de detalle
                let title = card.querySelector('h3').textContent;
                const priceEl = card.querySelector('.font-black, .font-serif.font-black, .dmso-price-display, .agua-mar-price-display, .coco-price-display, .miel-price-display');
                const price = priceEl ? priceEl.textContent : "S/. 0.00";

                // Manejo de variaciones (como tamaños)
                const selectSize = card.querySelector('select');
                if (selectSize) {
                    const selectedOption = selectSize.options[selectSize.selectedIndex];
                    const sizeLabel = selectedOption.getAttribute('data-size') || selectedOption.textContent.split('-')[0].trim();
                    title = `${title} (${sizeLabel})`;
                }

                // Buscar imagen robustamente
                let image = "";
                const bgDiv = card.querySelector('.bg-cover, .bg-contain, [style*="background-image"]');
                if (bgDiv) {
                    const style = window.getComputedStyle(bgDiv);
                    const bgImage = style.backgroundImage;
                    if (bgImage && bgImage !== 'none') {
                        image = bgImage.replace(/^url\(\s*["']?/, '').replace(/["']?\s*\)$/, '');
                    }
                }

                if (!image || image === 'none') {
                    const imgTag = card.querySelector('img');
                    if (imgTag) image = imgTag.src;
                }

                addToCart({ title, price, image });
            }
        }
    });

    // Inicializar
    updateCartCount();

    // --- Lógica de Búsqueda ---
    const searchInputs = document.querySelectorAll('input[placeholder="Buscar rituales..."]');

    function performSearch(query) {
        query = query.toLowerCase().trim();
        const currentPath = window.location.pathname;
        const isStorePage = currentPath.includes('tienda.html');

        // Si no estamos en la tienda y hay búsqueda, redirigir
        if (!isStorePage && query.length > 0) {
            window.location.href = `./tienda.html?search=${encodeURIComponent(query)}`;
            return;
        }

        // Si estamos en la tienda, filtrar productos
        if (isStorePage) {
            const productCards = document.querySelectorAll('.grid .group'); // Selecciona todas las tarjetas de producto
            let foundCount = 0;

            productCards.forEach(card => {
                const titleEl = card.querySelector('h3');
                if (titleEl) {
                    const title = titleEl.textContent.toLowerCase();
                    if (title.includes(query)) {
                        card.classList.remove('hidden');
                        foundCount++;
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });

            // Actualizar texto de resultados si existe
            const resultText = document.querySelector('.text-\\[\\#27724e\\]\\/70.text-sm.md\\:text-right');
            if (resultText) {
                if (query.length > 0) {
                    resultText.textContent = `Encontrados ${foundCount} resultados para "${query}"`;
                } else {
                    // Recalcular total (esto es un estimado, idealmente sería dinámico basado en el estado real)
                    resultText.textContent = `Mostrando resultados`;
                }
            }
        }
    }

    // Event Listeners para inputs de búsqueda
    searchInputs.forEach(input => {
        // Buscar al presionar Enter
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSearch(input.value);
                e.preventDefault();
            }
        });

        // Búsqueda en tiempo real solo en la página de tienda
        if (window.location.pathname.includes('tienda.html')) {
            input.addEventListener('input', (e) => {
                performSearch(e.target.value);
            });
        }
    });

    // Verificar parámetros de URL al cargar (para redirecciones desde otras páginas)
    if (window.location.pathname.includes('tienda.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            // Establecer valor en los inputs
            searchInputs.forEach(input => input.value = searchQuery);
            // Ejecutar búsqueda
            performSearch(searchQuery);
        }

        const categoryQuery = urlParams.get('category');
        if (categoryQuery) {
            setTimeout(() => filterByCategory(categoryQuery), 100);
        }
    }

    // --- Lógica de Filtrado por Categoría ---
    const categoryButtons = document.querySelectorAll('.category-bar-container button');
    const productCards = document.querySelectorAll('[data-category]');

    function filterProducts(category) {
        let visibleCount = 0;
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'Todos' || cardCategory === category) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Actualizar contador de resultados
        const resultText = document.querySelector('.text-\\[\\#27724e\\]\\/70.text-sm.md\\:text-right');
        if (resultText) {
            resultText.textContent = `Mostrando ${visibleCount} de ${productCards.length} resultados`;
        }
    }

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.querySelector('p').textContent.trim();

            // Actualizar estilos de los botones
            categoryButtons.forEach(b => {
                b.classList.remove('bg-[#27724e]', 'text-white', 'shadow-md');
                b.classList.add('bg-[#27724e]/5', 'text-[#27724e]', 'border-[#27724e]/5');
            });

            btn.classList.add('bg-[#27724e]', 'text-white', 'shadow-md');
            btn.classList.remove('bg-[#27724e]/5', 'text-[#27724e]', 'border-[#27724e]/5');

            filterProducts(category);
        });
    });

    console.log('Sitio Jackelin Laza inicializado correctamente.');
});

// Función global para filtrar por categoría desde el Navbar o Menú Móvil
function filterByCategory(category) {
    const currentPath = window.location.pathname;
    if (!currentPath.includes('tienda.html')) {
        window.location.href = `./tienda.html?category=${encodeURIComponent(category)}`;
        return;
    }

    // Si ya estamos en tienda, buscar el botón correspondiente y hacer clic
    const buttons = document.querySelectorAll('.category-bar-container button');
    buttons.forEach(btn => {
        const btnText = btn.querySelector('p')?.textContent.trim() || btn.textContent.trim();
        if (btnText === category || (category === 'Energía y Metabolismo' && btnText.includes('Circulación'))) {
            btn.click();
            // Cerrar menú móvil si está abierto
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                document.getElementById('close-menu-btn')?.click();
            }
            // Scroll a la sección de productos
            document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
        }
    });
}