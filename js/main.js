// =================================================================
// 1. DATOS DEL MENÚ
// =================================================================
const menu = [
    { id: 1, nombre: "Full Cheese", precio: 11000, descripcion: "Pan de Manteca · Carne x2 · Cheddar x6 · Mayonesa", imagen: "img/full-cheese.png", esPromo: false },
    { id: 2, nombre: "Brasa Bacon", precio: 10000, descripcion: "Pan de Manteca · Carne · Cheddar x2 · Ketchup · Mostaza · Cebollas caramelizadas · Bacon x3 · Huevo Frito", imagen: "img/brasa-bacon.png", esPromo: false },
    { id: 3, nombre: "Bacon Fogonera", precio: 10800, descripcion: "Pan de Manteca, Carne, Chedae x2, Bacon x3,Huevo Frito, Mil Isla Fogonera", imagen: "img/bacon-fogonera.png", esPromo: false },
    { id: 4, nombre: "Burger Crunch", precio: 11200, descripcion: "Pan de Manteca, Carne x2, Cheddar x3, Bacon x3, Cebolla Crispy, Salsa Fogonera, ketchup y Mostaza", imagen: "img/burger-crunch.png", esPromo: false },
    { id: 5, nombre: "Cheese Fogón", precio: 9800, descripcion: "Pan de manteca · Carne · Chedar x3 · Ketchup y Mostaza · Cebolla Blanca", imagen: "img/promo-cheese-simple.png", esPromo: false },
    { id: 13, nombre: "2 Cheese Fogon Simple", precio: 17500, descripcion: "2 hamburguesas Cheese Fogon simple con papas incluidas", imagen: "img/promo-cheese-simple.png", esPromo: true },
    { id: 14, nombre: "2 Cheese Fogon Doble", precio: 22500, descripcion: "2 hamburguesas Cheese Fogon doble con papas incluidas", imagen: "img/promo-cheese-doble.png", esPromo: true },
    { id: 15, nombre: "2 House Burger Doble", precio: 23000, descripcion: "2 hamburguesas House Burger doble con papas incluidas", imagen: "img/promo-house-burger.png", esPromo: true }
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

function agregarAlCarrito(idProducto) {
    const producto = menu.find(p => p.id === idProducto);
    carrito.push(producto);
    localStorage.setItem('carritoFogoncito', JSON.stringify(carrito));
    actualizarContador();
}

// =================================================================
// 3. LÓGICA DEL CHECKOUT (pedido.html)
// =================================================================
const listaCarritoHTML = document.getElementById('lista-carrito');
const formCheckout = document.getElementById('form-checkout');

if (listaCarritoHTML) {
    // Función para renderizar el carrito
    function renderizarCarrito() {
        listaCarritoHTML.innerHTML = '';
        let subtotal = 0;

        if (carrito.length === 0) {
            listaCarritoHTML.innerHTML = '<p style="color: var(--texto-gris); text-align:center; padding: 20px;">Tu carrito está vacío. ¡Volvé al menú!</p>';
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
                        <button type="button" class="btn-cantidad" onclick="modificarCantidad(${index}, 1)">+</button>
                    </div>
                    <div class="item-precio">${precioFormateado}</div>
                `;
                listaCarritoHTML.appendChild(item);
                subtotal += producto.precio;
            });
        }

        actualizarResumen(subtotal);
    }

    // Función para actualizar los totales
    function actualizarResumen(subtotal) {
        const envio = opcionEntrega === 'delivery' ? costoEnvio : 0;
        const total = subtotal + envio;

        const formatear = (num) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(num);

        document.getElementById('resumen-subtotal').textContent = formatear(subtotal);
        document.getElementById('resumen-total').textContent = formatear(total);
        
        const filaEnvio = document.getElementById('fila-envio');
        if (opcionEntrega === 'delivery') {
            filaEnvio.style.display = 'flex';
            filaEnvio.innerHTML = `<span>Envío</span><span>${formatear(costoEnvio)}</span>`;
        } else {
            filaEnvio.style.display = 'none';
        }

        // Actualizar el texto de la dirección si estamos en delivery
        const inputDireccion = document.getElementById('direccion');
        if (inputDireccion) {
            inputDireccion.addEventListener('input', (e) => {
                document.getElementById('texto-direccion').textContent = e.target.value || 'Ingresá tu dirección';
            });
        }
    }

    // Lógica para cambiar entre Delivery y Retiro
    window.seleccionarOpcion = function(elemento, tipo) {
        // Quitar la clase 'seleccionado' a los hermanos
        const contenedor = elemento.parentElement;
        contenedor.querySelectorAll('.opcion-card').forEach(card => card.classList.remove('seleccionado'));
        elemento.classList.add('seleccionado');

        if (tipo === 'delivery' || tipo === 'retiro') {
            opcionEntrega = tipo;
            const seccionDireccion = document.getElementById('seccion-direccion');
            if (tipo === 'retiro') {
                seccionDireccion.style.display = 'none';
            } else {
                seccionDireccion.style.display = 'block';
            }
            renderizarCarrito(); // Recalcular totales
        }

        if (tipo === 'tarjeta' || tipo === 'transferencia') {
            const datosTransferencia = document.getElementById('datos-transferencia');
            datosTransferencia.style.display = tipo === 'transferencia' ? 'block' : 'none';
        }
    };

    // Eliminar producto del carrito
    window.modificarCantidad = function(index, cambio) {
        // Como el diseño muestra 1 unidad, si restan, eliminamos el producto
        if (cambio === -1) {
            carrito.splice(index, 1);
        }
        // Si suman, duplicamos el producto (o podrías aumentar una propiedad cantidad)
        if (cambio === 1) {
            carrito.push({...carrito[index]});
        }
        localStorage.setItem('carritoFogoncito', JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContador();
    };

    // Inicializar
    renderizarCarrito();

    // Envío del formulario
    formCheckout.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (carrito.length === 0) {
            alert('El carrito está vacío.');
            return;
        }

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const direccion = document.getElementById('direccion') ? document.getElementById('direccion').value : 'Local';

        // Guardamos los datos para la pantalla de confirmación
        const pedidoData = {
            cliente: `${nombre} ${apellido}`,
            direccion: opcionEntrega === 'delivery' ? direccion : 'Pasa a retirar al local',
            total: document.getElementById('resumen-total').textContent
        };
        localStorage.setItem('datosPedido', JSON.stringify(pedidoData));

        // Limpiamos carrito y redirigimos
        localStorage.removeItem('carritoFogoncito');
        window.location.href = 'confirmacion.html';
    });
}

// =================================================================
// 4. LÓGICA DE CONFIRMACIÓN (confirmacion.html)
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