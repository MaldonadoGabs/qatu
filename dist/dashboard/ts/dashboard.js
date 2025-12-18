var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Importar servicios de Firebase
import { obtenerProductos, buscarProductos, obtenerProductosPorCategoria } from '../../services/productosService.js';
// Carrusel de productos
let posicionActual = 0;
let carrusel;
let totalProductos;
const productosPorPagina = 4;
let maxPosicion;
let carrito = [];
let todosLosProductos = [];
let productosFiltrados = [];
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    verificarTipoUsuario();
    yield cargarProductosDesdeFirebase();
    cargarCarrito();
    configurarEventosCarrito();
    configurarBusqueda();
    configurarFiltrosCategorias();
    actualizarBotonLogin();
}));
// 🔥 Cargar productos desde Firebase
function cargarProductosDesdeFirebase() {
    return __awaiter(this, void 0, void 0, function* () {
        const carruselContainer = document.getElementById('carrusel-productos');
        if (!carruselContainer)
            return;
        try {
            carruselContainer.innerHTML = '<p style="padding: 40px; text-align: center; color: #666;">⏳ Cargando productos...</p>';
            console.log('📦 Cargando productos desde Firebase...');
            todosLosProductos = yield obtenerProductos();
            productosFiltrados = [...todosLosProductos];
            console.log(`✅ ${todosLosProductos.length} productos cargados`);
            if (todosLosProductos.length === 0) {
                carruselContainer.innerHTML = '<p style="padding: 40px; text-align: center; color: #888;">No hay productos disponibles. Espera un momento...</p>';
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    console.log('🔄 Reintentando cargar productos...');
                    yield cargarProductosDesdeFirebase();
                }), 3000);
                return;
            }
            mostrarProductos(productosFiltrados);
        }
        catch (error) {
            console.error('❌ Error al cargar productos:', error);
            carruselContainer.innerHTML = '<p style="padding: 40px; text-align: center; color: #E43636;">❌ Error al cargar productos. Por favor recarga la página.</p>';
        }
    });
}
function mostrarProductos(productos) {
    const carruselContainer = document.getElementById('carrusel-productos');
    if (!carruselContainer)
        return;
    if (productos.length === 0) {
        carruselContainer.innerHTML = '<p style="padding: 40px; text-align: center; color: #888;">No se encontraron productos</p>';
        return;
    }
    carruselContainer.innerHTML = productos.map((producto) => `
        <div class="producto-card">
            <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='/assets/placeholder-producto.png'" />
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <p style="font-size: 0.9rem; color: #666; margin: 5px 0;">Vendedor: ${producto.vendedorNombre}</p>
            <button class="btn-agregar-carrito" onclick="window.agregarAlCarrito('${producto.id}')">
                Agregar al Carrito
            </button>
        </div>
    `).join('');
    // Actualizar variables del carrusel
    carrusel = document.querySelector('.carrusel');
    totalProductos = productos.length;
    maxPosicion = Math.max(0, Math.ceil(totalProductos / productosPorPagina) - 1);
    posicionActual = 0;
    if (carrusel) {
        carrusel.style.transform = 'translateX(0px)';
    }
    console.log(`📊 Carrusel: ${totalProductos} productos, ${maxPosicion + 1} páginas`);
}
// 🎯 Configurar filtros de categorías
function configurarFiltrosCategorias() {
    const categorias = document.querySelectorAll('.dropdown-menu a');
    categorias.forEach(link => {
        link.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            e.preventDefault();
            const categoriaTexto = (_a = e.target.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            if (!categoriaTexto)
                return;
            console.log('🔍 Filtrando por categoría:', categoriaTexto);
            try {
                productosFiltrados = yield obtenerProductosPorCategoria(categoriaTexto);
                console.log(`✅ ${productosFiltrados.length} productos encontrados`);
                mostrarProductos(productosFiltrados);
            }
            catch (error) {
                console.error('❌ Error al filtrar:', error);
                mostrarAlerta('Error', 'No se pudieron cargar los productos', 'error');
            }
        }));
    });
}
// 🔍 Configurar búsqueda
function configurarBusqueda() {
    const inputBusqueda = document.getElementById('buscar-input');
    const btnBuscar = document.getElementById('btn-buscar');
    if (!inputBusqueda || !btnBuscar)
        return;
    const realizarBusqueda = () => __awaiter(this, void 0, void 0, function* () {
        const termino = inputBusqueda.value.trim();
        if (!termino) {
            productosFiltrados = [...todosLosProductos];
            mostrarProductos(productosFiltrados);
            return;
        }
        try {
            console.log('🔍 Buscando:', termino);
            productosFiltrados = yield buscarProductos(termino);
            console.log(`✅ ${productosFiltrados.length} productos encontrados`);
            mostrarProductos(productosFiltrados);
        }
        catch (error) {
            console.error('❌ Error al buscar:', error);
            mostrarAlerta('Error', 'No se pudo realizar la búsqueda', 'error');
        }
    });
    btnBuscar.addEventListener('click', realizarBusqueda);
    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter')
            realizarBusqueda();
    });
}
// ⬅️➡️ Mover carrusel (función global)
window.moverCarrusel = function (direccion) {
    if (!carrusel)
        return;
    posicionActual += direccion;
    // Limitar posición
    if (posicionActual < 0) {
        posicionActual = 0;
    }
    else if (posicionActual > maxPosicion) {
        posicionActual = maxPosicion;
    }
    const desplazamiento = -(posicionActual * (100 / productosPorPagina));
    carrusel.style.transform = `translateX(${desplazamiento}%)`;
    console.log(`🎯 Carrusel en página ${posicionActual + 1} de ${maxPosicion + 1}`);
};
// 🛒 Agregar al carrito (función global)
window.agregarAlCarrito = function (idProducto) {
    const producto = todosLosProductos.find(p => p.id === idProducto);
    if (!producto) {
        mostrarAlerta('Error', 'Producto no encontrado', 'error');
        return;
    }
    const productoCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        vendedor: producto.vendedorNombre
    };
    carrito.push(productoCarrito);
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarAlerta('Producto agregado', `${producto.nombre} se agregó al carrito`, 'exito');
};
// 📦 Funciones del carrito
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}
function actualizarContadorCarrito() {
    const contador = document.querySelector('.carrito-count');
    if (contador) {
        contador.textContent = carrito.length.toString();
    }
}
function configurarEventosCarrito() {
    const btnCarrito = document.getElementById('btn-carrito');
    if (btnCarrito) {
        btnCarrito.addEventListener('click', () => {
            window.location.href = '/components/carrito/carrito.html';
        });
    }
}
// 👤 Verificar tipo de usuario
function verificarTipoUsuario() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (usuarioActivo) {
        const usuario = JSON.parse(usuarioActivo);
        if (usuario.tipo === 'vendedor') {
            window.location.href = '/components/dashboard/dashboard-vendedor.html';
        }
    }
}
// 🔐 Actualizar botón de login
function actualizarBotonLogin() {
    const btnLogin = document.querySelector('.btn-login');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (usuarioActivo) {
        const usuario = JSON.parse(usuarioActivo);
        if (btnLogin) {
            btnLogin.textContent = `Hola, ${usuario.nombre || usuario.nombreEmpresa || 'Usuario'}`;
            btnLogin.style.display = 'inline-block';
        }
        if (btnCerrarSesion) {
            btnCerrarSesion.style.display = 'inline-block';
        }
    }
    else {
        if (btnLogin) {
            btnLogin.textContent = 'Iniciar Sesión';
            btnLogin.style.display = 'inline-block';
        }
        if (btnCerrarSesion) {
            btnCerrarSesion.style.display = 'none';
        }
    }
    btnLogin === null || btnLogin === void 0 ? void 0 : btnLogin.addEventListener('click', () => {
        if (usuarioActivo) {
            window.location.href = '/components/dashboard/dashboard-vendedor.html';
        }
        else {
            window.location.href = '/components/login/login.html';
        }
    });
    btnCerrarSesion === null || btnCerrarSesion === void 0 ? void 0 : btnCerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('usuarioActivo');
        window.location.reload();
    });
}
//# sourceMappingURL=dashboard.js.map