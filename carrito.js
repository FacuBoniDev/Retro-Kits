let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach((producto, index) => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <div class="cantidadContenedor">
                        <button class="restarCantidad botonCantidad" data-index="${index}"> - </button>
                        <p class="cantidad">${producto.cantidad}</p>
                        <button class="sumarCantidad botonCantidad" data-index="${index}"> + </button>
                    </div>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);

            // Seleccionamos los botones de incrementar y decrementar cantidad
            const restarBtn = div.querySelector(".restarCantidad");
            const sumarBtn = div.querySelector(".sumarCantidad");
            const cantidadElement = div.querySelector(".cantidad");

            // Asignamos la funcionalidad a cada botón
            restarBtn.addEventListener("click", () => {
                let cantidad = parseInt(cantidadElement.textContent, 10);
                if (cantidad > 1) {
                    cantidad--;
                    cantidadElement.textContent = cantidad;
                    producto.cantidad = cantidad; // Actualizar la cantidad en el objeto producto
                    actualizarSubtotal(producto, div); // Actualizar el subtotal
                    actualizarTotal(); // Actualizar el total general

                    // Elimina la clase 'menosDeshabilitado' si la cantidad es mayor a 1
                    if (cantidad > 1) {
                        restarBtn.classList.remove("menosDeshabilitado");
                    }
                }
                
                // Si la cantidad es 1, añade la clase 'menosDeshabilitado'
                if (cantidad === 1) {
                    restarBtn.classList.add("menosDeshabilitado");
                }
            });

            sumarBtn.addEventListener("click", () => {
                let cantidad = parseInt(cantidadElement.textContent, 10);
                cantidad++;
                cantidadElement.textContent = cantidad;
                producto.cantidad = cantidad; // Actualizar la cantidad en el objeto producto
                actualizarSubtotal(producto, div); // Actualizar el subtotal
                actualizarTotal(); // Actualizar el total general

                // Remueve la clase 'menosDeshabilitado' al incrementar
                restarBtn.classList.remove("menosDeshabilitado");
            });

            // Aplicar la clase 'menosDeshabilitado' al cargar si la cantidad es 1
            if (producto.cantidad === 1) {
                restarBtn.classList.add("menosDeshabilitado");
            }
        });

        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

// Función para actualizar el subtotal de un producto
function actualizarSubtotal(producto, elementoProducto) {
    const subtotalElement = elementoProducto.querySelector(".carrito-producto-subtotal p");
    subtotalElement.textContent = `$${producto.precio * producto.cantidad}`;
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #3185fc, #1050b1)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '2rem',
            y: '2rem'
          },
        onClick: function(){} 
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    })
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}
