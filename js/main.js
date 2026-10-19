// 1. Definimos los datos (Array de objetos)
const menu = [
    { id: 1, nombre: "Full Cheese", precio: 11000, descripcion: "Pan de Manteca · Carne x2 · Cheddar x6 · Mayonesa", imagen: "img/full-cheese.jpg", esPromo: false },
    { id: 2, nombre: "Brasa Bacon", precio: 11200, descripcion: "Pan de Manteca · Carne · Cheddar x2 · Ketchup · Mostaza · Cebollas caramelizadas · Bacon x3 · Huevo Frito", imagen: "img/brasa-bacon.jpg", esPromo: false },
    { id: 3, nombre: "Bacon Fogonera", precio: 10800, descripcion: "Pan de Manteca, Carne, Chedae x2, Bacon x3,Huevo Frito, Mil Isla Fogonera", imagen: "img/bacon-fogonera.jpg", esPromo: false },
    { id: 4,  nombre: "Burger Crunch", precio: 11200, descripcion: "Pan de Manteca, Carne x2, Cheddar x3, Bacon x3, Cebolla Crispy, Salsa Fogonera, ketchup y Mostaza", imagen: "img/burger-crunch.jpg", esPromo: false },
    { id: 5, nombre: "2 Cheese Fogon Simple", precio: 17500, descripcion: "2 hamburguesas Cheese Fogon simple con papas incluidas", imagen: "img/promo-cheese-simple.jpg", esPromo: true },
    { id: 6, nombre: "2 Cheese Fogon Doble", precio: 22500, descripcion: "2 hamburguesas Cheese Fogon doble con papas incluidas", imagen: "img/promo-cheese-doble.jpg", esPromo: true },
    { id: 7, nombre: "2 House Burger Doble", precio: 23000, descripcion: "2 hamburguesas House Burger doble con papas incluidas", imagen: "img/promo-house-burger.jpg", esPromo: true },
    { id: 8, nombre: "2 House Burger Simple", precio: 18000, descripcion: "2 hamburguesas House Burger simple con papas incluidas", imagen: "img/promo-house-burger-simple.jpg", esPromo: true },

    // Podés agregar más acá...
];

// 2. Seleccionamos los contenedores del HTML
const contenedorPromos = document.getElementById('contenedor-promos');
const contenedorMenu = document.getElementById('contenedor-menu');

// 3. Función para crear una tarjeta HTML
function crearTarjeta(producto) {
    // Creamos un artículo (etiqueta semántica para cada producto)
    const article = document.createElement('article');
    article.classList.add('tarjeta-producto');

    // Formateamos el precio para que se vea como $11.000
    const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(producto.precio);

    // Insertamos el HTML interno de la tarjeta
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

// 4. Recorremos el array y mostramos las tarjetas en el lugar correcto
menu.forEach(producto => {
    if (producto.esPromo) {
        contenedorPromos.appendChild(crearTarjeta(producto));
    } else {
        contenedorMenu.appendChild(crearTarjeta(producto));
    }
});
// 5. Lógica del Carrito
let carrito = []; // Array para guardar los productos
const contadorHTML = document.getElementById('contador-carrito');

function agregarAlCarrito(idProducto) {
    // Buscamos el producto en el menú
    const producto = menu.find(p => p.id === idProducto);
    
    // Lo agregamos al carrito
    carrito.push(producto);
    
    // Actualizamos el contador visual
    contadorHTML.textContent = carrito.length;
    
    // Guardamos en localStorage para que no se pierda al cambiar de página
    localStorage.setItem('carritoFogoncito', JSON.stringify(carrito));
    
    alert(`${producto.nombre} agregado al carrito!`);
}
/* ========================================= */
/* LÓGICA DE LA PÁGINA DE PEDIDO             */
/* ========================================= */

// Verificamos si estamos en la página de pedido
// Buscamos el elemento que solo existe en pedido.html
const listaCarritoHTML = document.getElementById('lista-carrito');

if (listaCarritoHTML) {
    
    // --- PASO 1: LEER EL CARRITO DEL LOCALSTORAGE ---
    
    // Recuperamos el carrito que guardamos desde el index.html
    // Si no existe, devuelve un array vacío []
    const carritoGuardado = JSON.parse(localStorage.getItem('carritoFogoncito')) || [];
    
    // --- PASO 2: MOSTRAR LOS PRODUCTOS EN PANTALLA ---
    
    let total = 0;
    
    // Si el carrito está vacío, mostramos un mensaje
    if (carritoGuardado.length === 0) {
        listaCarritoHTML.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío. ¡Volvé al menú para elegir algo rico! 🍔</p>';
    } else {
        // Si hay productos, recorremos el array y creamos un div por cada uno
        carritoGuardado.forEach(producto => {
            const item = document.createElement('div');
            item.classList.add('item-carrito');
            
            // Formateamos el precio
            const precioFormateado = new Intl.NumberFormat('es-AR', { 
                style: 'currency', 
                currency: 'ARS' 
            }).format(producto.precio);
            
            item.innerHTML = `
                <span class="item-nombre">${producto.nombre}</span>
                <span class="item-precio">${precioFormateado}</span>
            `;
            
            listaCarritoHTML.appendChild(item);
            
            // Sumamos al total
            total += producto.precio;
        });
    }
    
    // --- PASO 3: MOSTRAR EL TOTAL ---
    
    const totalFormateado = new Intl.NumberFormat('es-AR', { 
        style: 'currency', 
        currency: 'ARS' 
    }).format(total);
    
    document.getElementById('total').textContent = totalFormateado;
    
    // --- PASO 4: ACTUALIZAR EL CONTADOR DEL FOOTER ---
    
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = carritoGuardado.length;
    }
    
    // --- PASO 5: VALIDACIÓN Y ENVÍO DEL FORMULARIO ---
    
    const formulario = document.getElementById('form-pedido');
    
    formulario.addEventListener('submit', function(evento) {
        // Evitamos que la página se recargue por defecto
        evento.preventDefault();
        
        // Limpiamos errores previos
        document.getElementById('error-nombre').textContent = '';
        document.getElementById('error-direccion').textContent = '';
        document.getElementById('error-telefono').textContent = '';
        
        // Obtenemos los valores de los campos
        const nombre = document.getElementById('nombre').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        
        // Bandera para saber si hay errores
        let hayErrores = false;
        
        // Validación del nombre
        if (nombre === '') {
            document.getElementById('error-nombre').textContent = 'El nombre es obligatorio.';
            hayErrores = true;
        } else if (nombre.length < 3) {
            document.getElementById('error-nombre').textContent = 'El nombre debe tener al menos 3 caracteres.';
            hayErrores = true;
        }
        
        // Validación de la dirección
        if (direccion === '') {
            document.getElementById('error-direccion').textContent = 'La dirección es obligatoria.';
            hayErrores = true;
        }
        
        // Validación del teléfono
        if (telefono === '') {
            document.getElementById('error-telefono').textContent = 'El teléfono es obligatorio.';
            hayErrores = true;
        } else if (telefono.length < 8) {
            document.getElementById('error-telefono').textContent = 'El teléfono debe tener al menos 8 dígitos.';
            hayErrores = true;
        }
        
        // Si hay errores, cortamos la ejecución acá
        if (hayErrores) {
            return;
        }
        
        // --- PASO 6: CONFIRMAR EL PEDIDO ---
        
        // Verificamos que el carrito no esté vacío
        if (carritoGuardado.length === 0) {
            alert('Tu carrito está vacío. Agregá productos antes de confirmar.');
            return;
        }
        
        // Todo está bien: mostramos el mensaje de éxito
        alert(`¡Gracias ${nombre}! 🍔\n\nTu pedido por un total de ${totalFormateado} fue confirmado.\n\nLo enviamos a: ${direccion}\nTe contactamos al: ${telefono}\n\n¡Que lo disfrutes!`);
        
        // Vaciamos el carrito del localStorage
        localStorage.removeItem('carritoFogoncito');
        
        // Redirigimos al inicio (index.html) usando ../ porque estamos en pages/
        window.location.href = '../index.html';
    });
}