let productos = [];

// Cargar los datos de productos desde el archivo JSON
fetch("productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    });

const contenedorProductos = document.querySelector("#contenedorProductos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#tituloPrincipal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");

// Función para cargar y mostrar los productos en la página
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });
    actualizarBotonesAgregar();
}

// Añadir el evento de click a los botones de categoría
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {
            // Filtrar los productos que coinciden con la categoría seleccionada
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);

            // Comprobar si hay productos en la categoría seleccionada
            if (productosBoton.length > 0) {
                // Obtener el nombre de la categoría del primer producto
                tituloPrincipal.innerText = productosBoton[0].categoria.nombre;
            } else {
                // Mensaje si no hay productos en la categoría
                tituloPrincipal.innerText = "Categoría sin productos";
            }

            cargarProductos(productosBoton);
        } else {
            // Mostrar todos los productos si la categoría es "todos"
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }

        // Aplicar la animación al título cada vez que cambia la categoría
        tituloPrincipal.classList.add("tracking-in-contract");
        tituloPrincipal.addEventListener("animationend", () => {
            tituloPrincipal.classList.remove("tracking-in-contract");
        }, { once: true });
    });
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    // Agregar animación al contenedor del producto
    const boton = e.currentTarget;
    const contenedorProducto = boton.closest(".producto");
    contenedorProducto.classList.add("jello-horizontal");

    // Remover la clase de animación después de que termine
    contenedorProducto.addEventListener("animationend", () => {
        contenedorProducto.classList.remove("jello-horizontal");
    }, { once: true });

    // Mostrar el mensaje de Toastify
    Toastify({
        text: "Producto agregado",
        duration: 3200,
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
            x: '1.5rem',
            y: '4.5rem'
        },
        onClick: function(){} 
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    const numeritos = document.querySelectorAll("#numerito");
    
    numeritos.forEach(numerito => {
        numerito.innerText = nuevoNumerito;
    });
}
