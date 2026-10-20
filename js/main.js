// =================================================================
// 1. DATOS DEL MENÚ (Array de objetos)
// =================================================================
const menu = [
    { id: 1, nombre: "Full Cheese", precio: 11000, descripcion: "Pan de Manteca · Carne x2 · Cheddar x6 · Mayonesa", imagen: "img/full-cheese.png", esPromo: false },
    { id: 2, nombre: "Brasa Bacon", precio: 11200, descripcion: "Pan de Manteca · Carne · Cheddar x2 · Ketchup · Mostaza · Cebollas caramelizadas · Bacon x3 · Huevo Frito", imagen: "img/brasa-bacon.png", esPromo: false },
    { id: 3, nombre: "Bacon Fogonera", precio: 10800, descripcion: "Pan de Manteca, Carne, Chedae x2, Bacon x3,Huevo Frito, Mil Isla Fogonera", imagen: "img/bacon-fogonera.png", esPromo: false },
    { id: 4,  nombre: "Burger Crunch", precio: 11200, descripcion: "Pan de Manteca, Carne x2, Cheddar x3, Bacon x3, Cebolla Crispy, Salsa Fogonera, ketchup y Mostaza", imagen: "img/burger-crunch.png", esPromo: false },
    { id: 5, nombre: "2 Cheese Fogon Simple", precio: 17500, descripcion: "2 hamburguesas Cheese Fogon simple con papas incluidas", imagen: "img/promo-cheese-simple.png", esPromo: true },
    { id: 6, nombre: "2 Cheese Fogon Doble", precio: 22500, descripcion: "2 hamburguesas Cheese Fogon doble con papas incluidas", imagen: "img/promo-cheese-doble.png", esPromo: true },
    { id: 7, nombre: "2 House Burger Doble", precio: 23000, descripcion: "2 hamburguesas House Burger doble con papas incluidas", imagen: "img/promo-house-burger.png", esPromo: true },
    { id: 8, nombre: "2 House Burger Simple", precio: 18000, descripcion: "2 hamburguesas House Burger simple con papas incluidas", imagen: "img/promo-house-burger-simple.png", esPromo: true },
];

// =================================================================
// 2. LÓGICA DE LA PÁGINA DE INICIO (index.html)
// =================================================================

const contenedorPromos = document.getElementById('contenedor-promos');
const contenedorMenu = document.getElementById('contenedor-menu');
const contadorHTML = document.getElementById('contador-carrito');

// Función para crear una tarjeta HTML
function crearTarjeta(producto) {
    const article = document.createElement('article');
    article.classList.add('tarjeta-producto');
    const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(producto.precio);
    article.innerHTML = `
        <img src="${producto.imagen}" alt="Hamburguesa ${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <div class="precio-y-boton">
            <span class="precio">${precioFormateado}</span>
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">AGREGAR</button>
        </div>
    `;
    return article;
}

// Recorremos el array y mostramos las tarjetas en el lugar correcto
if (contenedorPromos && contenedorMenu) {
    menu.forEach(producto => {
        if (producto.esPromo) {
            contenedorPromos.appendChild(crearTarjeta(producto));
        } else {
            contenedorMenu.appendChild(crearTarjeta(producto));
        }
    });
}

// Lógica del Carrito
let carrito = JSON.parse(localStorage.getItem('carritoFogoncito')) || [];

function actualizarContador() {
    if (contadorHTML) {
        contadorHTML.textContent = carrito.length;
    }
}

function agregarAlCarrito(idProducto) {
    const producto = menu.find(p => p.id === idProducto);
    carrito.push(producto);
    localStorage.setItem('carritoFogoncito', JSON.stringify(carrito));
    actualizarContador();
    alert(`${producto.nombre} agregado al carrito!`);
}

// Llamamos a la función al cargar la página para mostrar el contador guardado
actualizarContador();


// =================================================================
// 3. LÓGICA DE LA PÁGINA DE PEDIDO (pages/pedido.html)
// =================================================================

const listaCarritoHTML = document.getElementById('lista-carrito');

if (listaCarritoHTML) {
    let carritoGuardado = JSON.parse(localStorage.getItem('carritoFogoncito')) || [];
    let total = 0;

    function mostrarCarrito() {
        listaCarritoHTML.innerHTML = ''; // Limpiamos la lista
        total = 0;

        if (carritoGuardado.length === 0) {
            listaCarritoHTML.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío. ¡Volvé al menú para elegir algo rico! 🍔</p>';
        } else {
            carritoGuardado.forEach(producto => {
                const item = document.createElement('div');
                item.classList.add('item-carrito');
                const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(producto.precio);
                item.innerHTML = `
                    <span class="item-nombre">${producto.nombre}</span>
                    <span class="item-precio">${precioFormateado}</span>
                `;
                listaCarritoHTML.appendChild(item);
                total += producto.precio;
            });
        }

        const totalFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total);
        document.getElementById('total').textContent = totalFormateado;
        
        // Actualizamos el contador del footer
        const contadorPedido = document.getElementById('contador-carrito');
        if (contadorPedido) {
            contadorPedido.textContent = carritoGuardado.length;
        }
    }

    mostrarCarrito(); // Mostramos el carrito al cargar la página

    // Validación y envío del formulario
    const formulario = document.getElementById('form-pedido');

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        // Limpiamos errores previos
        document.getElementById('error-nombre').textContent = '';
        document.getElementById('error-direccion').textContent = '';
        document.getElementById('error-telefono').textContent = ''; // CORREGIDO: Ahora coincide con el ID del HTML
        
        const nombre = document.getElementById('nombre').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        
        let hayErrores = false;
        
        if (nombre === '') {
            document.getElementById('error-nombre').textContent = 'El nombre es obligatorio.';
            hayErrores = true;
        } else if (nombre.length < 3) {
            document.getElementById('error-nombre').textContent = 'El nombre debe tener al menos 3 caracteres.';
            hayErrores = true;
        }
        
        if (direccion === '') {
            document.getElementById('error-direccion').textContent = 'La dirección es obligatoria.';
            hayErrores = true;
        }
        
        if (telefono === '') {
            document.getElementById('error-telefono').textContent = 'El teléfono es obligatorio.';
            hayErrores = true;
        } else if (telefono.length < 8) {
            document.getElementById('error-telefono').textContent = 'El teléfono debe tener al menos 8 dígitos.';
            hayErrores = true;
        }
        
        if (hayErrores) {
            return;
        }

        if (carritoGuardado.length === 0) {
            alert('Tu carrito está vacío. Agregá productos antes de confirmar.');
            return;
        }
        
        const totalFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total);
        alert(`¡Gracias ${nombre}! 🍔\n\nTu pedido por un total de ${totalFormateado} fue confirmado.\n\nLo enviamos a: ${direccion}\nTe contactamos al: ${telefono}\n\n¡Que lo disfrutes!`);
        
        localStorage.removeItem('carritoFogoncito');
        window.location.href = '../index.html';
    });
}