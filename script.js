// =========================================
// 1. LÓGICA DEL MODAL (VENTANA EMERGENTE)
// =========================================
const modal = document.getElementById('modal-producto');
const closeBtn = document.querySelector('.close-btn');
const botonesDetalle = document.querySelectorAll('.btn-detalle');

// Elementos dentro del modal
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalIng = document.getElementById('modal-ing');
const modalCal = document.getElementById('modal-cal');
const modalProt = document.getElementById('modal-prot');
const modalFat = document.getElementById('modal-fat');

// Abrir modal
botonesDetalle.forEach(boton => {
    boton.addEventListener('click', () => {
        const data = boton.dataset;
        
        modalImg.src = data.img;
        modalTitle.innerText = data.name;
        modalDesc.innerText = data.desc;
        modalIng.innerText = data.ingredientes;
        modalCal.innerText = data.calorias;
        modalProt.innerText = data.proteina;
        modalFat.innerText = data.grasas;

        modal.style.display = 'flex';
    });
});

// Cerrar modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

// =========================================
// 2. MODO OSCURO
// =========================================
const toggleBtn = document.getElementById('dark-mode-toggle');
const icon = toggleBtn.querySelector('i'); 

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// =========================================
// 3. FILTRADO DE MENÚ (NUEVO)
// =========================================
const tabBtns = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 1. Quitar clase 'active' de todos los botones visualmente
        tabBtns.forEach(b => b.classList.remove('active'));
        // 2. Poner 'active' al botón que se presionó
        btn.classList.add('active');

        // 3. Obtener la categoría seleccionada
        const category = btn.dataset.category;

        // 4. Mostrar u ocultar tarjetas
        menuCards.forEach(card => {
            // Si la categoría es 'todos' O coincide con la tarjeta -> MOSTRAR
            if (category === 'todos' || card.dataset.category === category) {
                card.classList.remove('oculto');
                // Pequeña animación de entrada
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                // Si no coincide -> OCULTAR
                card.classList.add('oculto');
            }
        });
    });
});

// Agregamos la animación de aparición por código para no ensuciar el CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(styleSheet);
// =========================================
// 4. LÓGICA DEL CARRITO DE COMPRAS
// =========================================

let carrito = []; // Aquí guardamos los productos

// Función para agregar productos
function agregarAlCarrito(nombre, precio) {
    // Revisar si el producto ya existe para solo sumar cantidad
    const existe = carrito.find(item => item.nombre === nombre);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    actualizarCarritoHTML();
    
    // Pequeña animación visual (opcional)
    alert(`¡${nombre} agregado al pedido!`);
}

// Función para dibujar el carrito en el Modal
function actualizarCarritoHTML() {
    const listaHTML = document.getElementById('lista-carrito');
    const contadorHTML = document.getElementById('contador-carrito');
    const totalHTML = document.getElementById('total-carrito');
    
    listaHTML.innerHTML = '';
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        cantidadTotal += producto.cantidad;

        listaHTML.innerHTML += `
            <div class="item-carrito">
                <div class="item-info">
                    <h4>${producto.nombre}</h4>
                    <p>$${producto.precio.toFixed(2)} x ${producto.cantidad} = <strong>$${subtotal.toFixed(2)}</strong></p>
                </div>
                <div class="item-controls">
                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span>${producto.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    totalHTML.innerText = total.toFixed(2);
    contadorHTML.innerText = cantidadTotal;

    if (carrito.length === 0) {
        listaHTML.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío ☹️</p>';
    }
}

// Función para subir o bajar cantidad
function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    
    // Si la cantidad llega a 0, lo borramos
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    
    actualizarCarritoHTML();
}

// Abrir y Cerrar Modal del Carrito
function abrirCarrito() {
    document.getElementById('modal-carrito').style.display = 'flex';
}
function cerrarCarrito() {
    document.getElementById('modal-carrito').style.display = 'none';
}

// =========================================
// 5. ENVIAR PEDIDO A WHATSAPP
// =========================================
function enviarPedidoWhatsapp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega algo rico primero.");
        return;
    }

    const numeroTelefono = "593967488622"; // TU NÚMERO
    const notas = document.getElementById('notas-pedido').value;
    
    // Construimos el mensaje
    let mensaje = "Hola Burger 69, deseo realizar el siguiente pedido:%0A%0A";
    
    let total = 0;
    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        // %0A es un salto de línea en código URL
        mensaje += `- ${producto.cantidad}x ${producto.nombre} ($${subtotal.toFixed(2)})%0A`;
    });

    mensaje += `%0A*Total a Pagar: $${total.toFixed(2)}*`;
    
    if (notas.trim() !== "") {
        mensaje += `%0A%0ANotas del cliente:%0A${notas}`;
    }

    mensaje += "%0A%0A¡Espero confirmación, gracias!";

    // Abrir WhatsApp
    const url = `https://wa.me/${numeroTelefono}?text=${mensaje}`;
    window.open(url, '_blank');
}