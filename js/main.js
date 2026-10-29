// =================================================================
// 1. DATOS DEL MENÚ (Array completo restaurado)
// =================================================================
const menu = [
    { id: 1, nombre: "Full Cheese", precio: 11000, descripcion: "Pan de Manteca · Carne x2 · Cheddar x6 · Mayonesa", imagen: "img/full-cheese.png", esPromo: false },
    { id: 2, nombre: "Brasa Bacon", precio: 11200, descripcion: "Pan de Manteca · Carne · Cheddar x2 · Ketchup · Mostaza · Cebollas caramelizadas · Bacon x3 · Huevo Frito", imagen: "img/brasa-bacon.png", esPromo: false },
    { id: 3, nombre: "Bacon Fogonera", precio: 10800, descripcion: "Pan de Manteca, Carne, Chedae x2, Bacon x3,Huevo Frito, Mil Isla Fogonera", imagen: "img/bacon-fogonera.png", esPromo: false },
    { id: 4,  nombre: "Burger Crunch", precio: 11200, descripcion: "Pan de Manteca, Carne x2, Cheddar x3, Bacon x3, Cebolla Crispy, Salsa Fogonera, ketchup y Mostaza", imagen: "img/burger-crunch.png", esPromo: false },
    { id: 5, nombre: "Cheese Fogón" , precio: 9800, descripcion: "Pan de manteca · Carne · Chedar x3 · Ketchup y Mostaza · Cebolla Blanca", imagen: "img/promo-cheese-simple.png", esPromo: false },
    { id: 6, nombre: "Fogo Bonito" , precio: 10800, descripcion: "Pan de manteca · Carne · Chedar x2 · Barbacoa · Bacon x3 · Huevo Frito", imagen: "img/fogo-bonito.png", esPromo: false },
    { id: 7, nombre: "Fuego Cheese" , precio: 10800, descripcion: "Pan de manteca · Carne · Chedar x2 · Roquefort · Muzza · Queso dambo · Verdeo Picado", imagen: "img/fuego-cheese.png", esPromo: false },
    { id: 8, nombre: "House Burger" , precio: 10000, descripcion: "Pan de manteca · Carne · Chedar x2 · Huevo Frito · Lechuga y Tomate · Mayonesa Fogoncito", imagen: "img/promo-house-burger.png", esPromo: false },
    { id: 9, nombre: "La Picanta" , precio: 10500, descripcion: "Pan de manteca · Carne · Queso Dambo x2 · Salsa Picante · Cebolla Crispy", imagen: "img/la-picanta.png", esPromo: false },
    { id: 10, nombre: "Palta Burger" , precio: 10500, descripcion: "Pan de manteca · Carne · Chedar x2 · Omelet · Palta · Cebolla Morada · Mayonesa · Tomate 1 feta", imagen: "img/palta-burger.png", esPromo: false },
    { id: 11, nombre: "Parri Huevo" , precio: 9800, descripcion: "Pan de manteca · Carne · Chedar x2 · Mayo de Ajo · Huevo Frito x2", imagen: "img/parri-huevo.png", esPromo: false },
    { id: 12, nombre: "Richard Fresh" , precio: 11200, descripcion: "Pan de manteca · Carne · Chedar x3 · Bacon x3 · Lechuga y Tomate · Ketchup y Mostaza · Salsa Mil Islas", imagen: "img/richard-fresh.png", esPromo: false },
    { id: 13, nombre: "2 Cheese Fogon Simple", precio: 17500, descripcion: "2 hamburguesas Cheese Fogon simple con papas incluidas", imagen: "img/promo-cheese-simple.png", esPromo: true },
    { id: 14, nombre: "2 Cheese Fogon Doble", precio: 22500, descripcion: "2 hamburguesas Cheese Fogon doble con papas incluidas", imagen: "img/promo-cheese-doble.png", esPromo: true },
    { id: 15, nombre: "2 House Burger Doble", precio: 23000, descripcion: "2 hamburguesas House Burger doble con papas incluidas", imagen: "img/promo-house-burger.png", esPromo: true },
    { id: 16, nombre: "2 House Burger Simple", precio: 18000, descripcion: "2 hamburguesas House Burger simple con papas incluidas", imagen: "img/promo-house-burger-simple.png", esPromo: true },
];

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carritoFogoncito')) || [];
const costoEnvio = 1500;
let opcionEntrega = 'delivery'; // 'delivery' o 'retiro'

// =================================================================
// 2. LÓGICA DE LA PÁGINA DE INICIO (index.html)
// =================================================================
const contenedorPromos = document.getElementById('contenedor-promos');
const contenedorMenu = document.getElementById('contenedor-menu');
const contadorHTML = document.getElementById('contador-carrito');

function crearTarjeta(producto) {
    const article = document.createElement('article');
    article.classList.add('tarjeta-producto');
    const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(producto.precio);
    article.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <div class="precio-y-boton">
            <span class="precio">${precioFormateado}</span>
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">AGREGAR</button>
        </div>
    `;
    return article;
}

if (contenedorPromos && contenedorMenu) {
    menu.forEach(producto => {
        if (producto.esPromo) contenedorPromos.appendChild(crearTarjeta(producto));
        else contenedorMenu.appendChild(crearTarjeta(producto));
    });
}

function actualizarContador() {
    if (contadorHTML) contadorHTML.textContent = carrito.length;
}

window.agregarAlCarrito = function(idProducto) {
    const producto = menu.find(p => p.id === idProducto);
    carrito.push(producto);
    localStorage.setItem('carritoFogoncito', JSON.stringify(carrito));
    actualizarContador();
    alert(`${producto.nombre} agregado al carrito!`);
}

// Inicializar contador al cargar
actualizarContador();

// =================================================================
// 3. LÓGICA DEL CHECKOUT (pages/pedido.html)
// =================================================================
const listaCarritoHTML = document.getElementById('lista-carrito');
const formCheckout = document.getElementById('form-checkout');

if (listaCarritoHTML) {
    
    function renderizarCarrito() {
        listaCarritoHTML.innerHTML = '';
        let subtotal = 0;

        if (carrito.length === 0) {
            listaCarritoHTML.innerHTML = '<p style="color: var(--texto-gris); text-align:center; padding: 20px;">Tu carrito está vacío. ¡Volvé al menú para elegir algo rico! 🍔</p>';
        } else {
            carrito.forEach((producto, index) => {
                const item = document.createElement('div');
                item.classList.add('item-carrito');
                const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(producto.precio);
                
                item.innerHTML = `
                    <div class="item-info">
                        <h3>${producto.nombre}</h3>
                        <p>Simple</p>
                    </div>
                    <div class="item-controles">
                        <button type="button" class="btn-cantidad" onclick="modificarCantidad(${index}, -1)">-</button>
                        <span>1</span>
                        <button type="button" class="btn-cantidad sumar" onclick="modificarCantidad(${index}, 1)">+</button>
                    </div>
                    <div class="item-precio">${precioFormateado}</div>
                `;
                listaCarritoHTML.appendChild(item);
                subtotal += producto.precio;
            });
        }
        actualizarResumen(subtotal);
    }

    function actualizarResumen(subtotal) {
        const envio = opcionEntrega === 'delivery' ? costoEnvio : 0;
        const total = subtotal + envio;
        const formatear = (num) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(num);

        document.getElementById('resumen-subtotal').textContent = formatear(subtotal);
        document.getElementById('resumen-total').textContent = formatear(total);
        
        const filaEnvio = document.getElementById('fila-envio');
        if (opcionEntrega === 'delivery') {
            filaEnvio.style.display = 'flex';
            document.getElementById('resumen-envio').textContent = formatear(costoEnvio);
        } else {
            filaEnvio.style.display = 'none';
        }
    }

    window.seleccionarOpcion = function(elemento, tipo) {
        const contenedor = elemento.parentElement;
        contenedor.querySelectorAll('.opcion-card').forEach(card => card.classList.remove('seleccionado'));
        elemento.classList.add('seleccionado');

        if (tipo === 'delivery' || tipo === 'retiro') {
            opcionEntrega = tipo;
            document.getElementById('seccion-direccion').style.display = tipo === 'retiro' ? 'none' : 'block';
            renderizarCarrito(); // Recalcular totales
        }
        
        // Si selecciona transferencia, mostramos los datos (opcional, según el Figma)
        if (tipo === 'tarjeta' || tipo === 'transferencia') {
            const datosTransf = document.getElementById('datos-transferencia');
            if (datosTransf) {
                datosTransf.style.display = tipo === 'transferencia' ? 'block' : 'none';
            }
        }
    };

    window.modificarCantidad = function(index, cambio) {
        if (cambio === -1) {
            carrito.splice(index, 1);
        }
        if (cambio === 1) {
            carrito.push({...carrito[index]});
        }
        localStorage.setItem('carritoFogoncito', JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContador();
    };

    renderizarCarrito();

    formCheckout.addEventListener('submit', function(e) {
        e.preventDefault();
        if (carrito.length === 0) {
            alert('El carrito está vacío. Agregá productos antes de confirmar.');
            return;
        }
        
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const direccionInput = document.getElementById('direccion');
        const direccion = direccionInput ? direccionInput.value : '';

        const pedidoData = {
            cliente: `${nombre} ${apellido}`,
            direccion: opcionEntrega === 'delivery' ? direccion : 'Pasa a retirar al local',
            total: document.getElementById('resumen-total').textContent
        };
        
        localStorage.setItem('datosPedido', JSON.stringify(pedidoData));
        localStorage.removeItem('carritoFogoncito');
        window.location.href = 'confirmacion.html';
    });
}

// =================================================================
// 4. LÓGICA DE CONFIRMACIÓN (pages/confirmacion.html)
// =================================================================
const nombreClienteHTML = document.getElementById('nombre-cliente');

if (nombreClienteHTML) {
    const pedidoData = JSON.parse(localStorage.getItem('datosPedido'));
    
    if (pedidoData) {
        document.getElementById('nombre-cliente').textContent = pedidoData.cliente;
        document.getElementById('direccion-cliente').textContent = pedidoData.direccion;
        document.getElementById('total-cliente').textContent = pedidoData.total;
    }
}