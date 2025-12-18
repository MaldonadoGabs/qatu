// Declarar funciones de alertas globales
declare function mostrarAlerta(titulo: string, mensaje: string, tipo: 'exito' | 'error' | 'info'): void;
declare function mostrarConfirmacion(titulo: string, mensaje: string, onAceptar: () => void, onCancelar?: () => void): void;

// Importar servicios de Firebase
import { obtenerProductos, buscarProductos, type Producto } from '../../services/productosService.js';

// Carrusel de productos
let posicionActual: number = 0;
let carrusel: HTMLElement | null;
let totalProductos: number;
const productosPorPagina: number = 4;
let maxPosicion: number;

// Carrito de compras
interface ProductoCarrito {
    id: string;
    nombre: string;
    precio: number;
    imagen: string;
    vendedor: string;
}

let carrito: ProductoCarrito[] = [];
let todosLosProductos: Producto[] = [];
let productosFiltrados: Producto[] = [];

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    verificarTipoUsuario();
    await cargarProductosDesdeFirebase();
    cargarCarrito();
    configurarEventosCarrito();
    configurarBusqueda();
    actualizarBotonLogin();
});

// 🔥 Cargar productos desde Firebase
async function cargarProductosDesdeFirebase(): Promise<void> {
    const carruselContainer = document.getElementById('carrusel-productos');
    
    if (!carruselContainer) return;
    
    try {
        carruselContainer.innerHTML = '<p style="padding: 40px; text-align: center; color: #666;">⏳ Cargando productos...</p>';
        
        console.log('📦 Cargando productos desde Firebase...');
        todosLosProductos = await obtenerProductos();
        productosFiltrados = [...todosLosProductos];
        
        console.log(`✅ ${todosLosProductos.length} productos cargados`);
        
        if (todosLosProductos.length === 0) {
            carruselContainer.innerHTML = '<p style="padding: 40px; text-align: center; color: #888;">No hay productos disponibles. Espera un momento...</p>';
            
            // Reintentar después de 3 segundos (por si los productos se están cargando)
            setTimeout(async () => {
                console.log('🔄 Reintentando cargar productos...');
                await cargarProductosDesdeFirebase();
            }, 3000);
            return;
        }
        
        mostrarProductos(productosFiltrados);
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        carruselContainer.innerHTML = '<p style="padding: 40px; text-align: center; color: #E43636;">❌ Error al cargar productos. Por favor recarga la página.</p>';
    }
}

function mostrarProductos(productos: Producto[]): void {
    const carruselContainer = document.getElementById('carrusel-productos');
    
    if (!carruselContainer) return;
    
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
    totalProductos = document.querySelectorAll('.producto-card').length;
    maxPosicion = Math.max(0, totalProductos - productosPorPagina);
    posicionActual = 0;
    
    if (carrusel) {
        carrusel.style.transform = 'translateX(0px)';
    }
}

// Configurar búsqueda
function configurarBusqueda(): void {
    const inputBusqueda = document.getElementById('input-busqueda') as HTMLInputElement;
    const btnBuscar = document.getElementById('btn-buscar') as HTMLButtonElement;
    
    if (!inputBusqueda || !btnBuscar) return;
    
    const realizarBusqueda = async () => {
        const termino = inputBusqueda.value.trim();
        
        if (!termino) {
            productosFiltrados = [...todosLosProductos];
            mostrarProductos(productosFiltrados);
            return;
        }
        
        try {
            console.log('🔍 Buscando:', termino);
            productosFiltrados = await buscarProductos(termino);
            console.log(`✅ ${productosFiltrados.length} productos encontrados`);
            mostrarProductos(productosFiltrados);
        } catch (error) {
            console.error('❌ Error al buscar:', error);
            mostrarAlerta('Error', 'No se pudo realizar la búsqueda', 'error');
        }
    };
    
    btnBuscar.addEventListener('click', realizarBusqueda);
    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusqueda();
    });
}

// Agregar al carrito (función global)
(window as any).agregarAlCarrito = function(idProducto: string): void {
    const producto = todosLosProductos.find(p => p.id === idProducto);
    
    if (!producto) {
        mostrarAlerta('Error', 'Producto no encontrado', 'error');
        return;
    }
    
    const productoCarrito: ProductoCarrito = {
        id: producto.id!,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        vendedor: producto.vendedorNombre
    };
    
    carrito.push(productoCarrito);
    guardarCarrito();
    actualizarContadorCarrito();
    
    mostrarAlerta(
        'Producto agregado',
        `${producto.nombre} se agregó al carrito`,
        'exito'
    );
};

// Cargar carrito desde localStorage (temporal, hasta migrar)
function cargarCarrito(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

function guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContadorCarrito(): void {
    const contador = document.querySelector('.carrito-count') as HTMLElement;
    if (contador) {
        contador.textContent = carrito.length.toString();
    }
}

// Configurar eventos del carrito
function configurarEventosCarrito(): void {
    const btnCarrito = document.getElementById('btn-carrito');
    if (btnCarrito) {
        btnCarrito.addEventListener('click', () => {
            window.location.href = '/components/carrito/carrito.html';
        });
    }
}

// Verificar tipo de usuario
function verificarTipoUsuario(): void {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (usuarioActivo) {
        const usuario = JSON.parse(usuarioActivo);
        if (usuario.tipo === 'vendedor') {
            window.location.href = '/components/dashboard/dashboard-vendedor.html';
        }
    }
}

// Actualizar botón de login
function actualizarBotonLogin(): void {
    const btnLogin = document.querySelector('.btn-login') as HTMLButtonElement;
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion') as HTMLButtonElement;
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
    } else {
        if (btnLogin) {
            btnLogin.textContent = 'Iniciar Sesión';
            btnLogin.style.display = 'inline-block';
        }
        if (btnCerrarSesion) {
            btnCerrarSesion.style.display = 'none';
        }
    }
    
    btnLogin?.addEventListener('click', () => {
        if (usuarioActivo) {
            window.location.href = '/components/dashboard/dashboard-vendedor.html';
        } else {
            window.location.href = '/components/login/login.html';
        }
    });
    
    btnCerrarSesion?.addEventListener('click', () => {
        localStorage.removeItem('usuarioActivo');
        window.location.reload();
    });
}

export {};