// Declarar funciones de alertas globales
declare function mostrarAlerta(titulo: string, mensaje: string, tipo: 'exito' | 'error' | 'info'): void;
declare function mostrarConfirmacion(titulo: string, mensaje: string, onAceptar: () => void, onCancelar?: () => void): void;

// Interfaces
interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
    descripcion: string;
    imagen: string;
    vendedor: string;
}

interface Usuario {
    tipo: 'comprador' | 'vendedor';
    email: string;
    password: string;
    nombreEmpresa?: string;
    nombre?: string;
    apellido?: string;
}

// Estado de la aplicación
let seccionActual: string = 'publicar';
let productos: Producto[] = [];
let productoIdCounter: number = 1;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    configurarNavegacion();
    configurarFormulario();
    actualizarBotonLogin();
    cargarProductos();
    actualizarEstadisticas();
});

function verificarSesion(): void {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    
    if (!usuarioActivo) {
        window.location.href = '/components/login/login.html';
        return;
    }
    
    const usuario: Usuario = JSON.parse(usuarioActivo);
    
    if (usuario.tipo !== 'vendedor') {
        window.location.href = '../../index.html';
        return;
    }
    
    console.log('Sesión de vendedor verificada:', usuario);
}

function configurarNavegacion(): void {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const seccionId = item.id.replace('nav-', '');
            cambiarSeccion(seccionId);
        });
    });
}

function cambiarSeccion(nombreSeccion: string): void {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const navActivo = document.getElementById(`nav-${nombreSeccion}`);
    if (navActivo) {
        navActivo.classList.add('active');
    }
    
    document.querySelectorAll('.seccion-vendedor').forEach(seccion => {
        seccion.classList.remove('active');
    });
    
    const seccionActiva = document.getElementById(`seccion-${nombreSeccion}`);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }
    
    seccionActual = nombreSeccion;
    
    if (nombreSeccion === 'estadisticas') {
        actualizarEstadisticas();
    }
}

function configurarFormulario(): void {
    const form = document.getElementById('form-producto') as HTMLFormElement;
    const inputImagen = document.getElementById('imagen-producto') as HTMLInputElement;
    
    if (form) {
        form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            publicarProducto();
        });
    }
    
    if (inputImagen) {
        inputImagen.addEventListener('change', validarYPrevisualizarImagen);
    }
}

function validarYPrevisualizarImagen(e: Event): void {
    const input = e.target as HTMLInputElement;
    const preview = document.getElementById('preview-imagen');
    const imgPreview = document.getElementById('imagen-preview') as HTMLImageElement;
    
    if (!input.files || input.files.length === 0) {
        if (preview) preview.style.display = 'none';
        return;
    }
    
    const archivo = input.files[0];
    
    if (!archivo) return;
    
    const formatosPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (formatosPermitidos.indexOf(archivo.type) === -1) {
        mostrarAlerta(
            'Formato inválido',
            'Por favor, use imágenes en formato JPG, JPEG, PNG o WEBP.',
            'error'
        );
        input.value = '';
        if (preview) preview.style.display = 'none';
        return;
    }
    
    const tamañoMaximo = 5 * 1024 * 1024;
    if (archivo.size > tamañoMaximo) {
        mostrarAlerta(
            'Archivo muy grande',
            'El tamaño de la imagen excede el límite de 5MB. Por favor, seleccione una imagen más pequeña.',
            'error'
        );
        input.value = '';
        if (preview) preview.style.display = 'none';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        if (event.target && imgPreview && preview) {
            imgPreview.src = event.target.result as string;
            preview.style.display = 'block';
        }
    };
    reader.readAsDataURL(archivo);
}

function publicarProducto(): void {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (!usuarioActivo) return;
    
    const usuario: Usuario = JSON.parse(usuarioActivo);
    
    const nombre = (document.getElementById('nombre-producto') as HTMLInputElement).value.trim();
    const precioInput = (document.getElementById('precio-producto') as HTMLInputElement).value;
    const categoria = (document.getElementById('categoria-producto') as HTMLSelectElement).value;
    const descripcion = (document.getElementById('descripcion-producto') as HTMLTextAreaElement).value.trim();
    const inputImagen = document.getElementById('imagen-producto') as HTMLInputElement;
    
    const camposFaltantes: string[] = [];
    
    if (!nombre) camposFaltantes.push('• Nombre del Producto');
    if (!precioInput || parseFloat(precioInput) <= 0) camposFaltantes.push('• Precio válido');
    if (!categoria) camposFaltantes.push('• Categoría');
    if (!descripcion) camposFaltantes.push('• Descripción');
    if (!inputImagen.files || inputImagen.files.length === 0) camposFaltantes.push('• Imagen del Producto');
    
    if (camposFaltantes.length > 0) {
        mostrarAlerta(
            'Campos incompletos',
            'Por favor, complete los siguientes campos obligatorios:\n\n' + camposFaltantes.join('\n'),
            'error'
        );
        return;
    }
    
    const precio = parseFloat(precioInput);
    
    if (!inputImagen.files || inputImagen.files.length === 0) return;
    
    const archivo = inputImagen.files[0];
    if (!archivo) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        if (!event.target) return;
        
        const imagenBase64 = event.target.result as string;
        
        const nuevoProducto: Producto = {
            id: productoIdCounter++,
            nombre,
            precio,
            categoria,
            descripcion,
            imagen: imagenBase64,
            vendedor: usuario.nombreEmpresa || usuario.email
        };
        
        productos.push(nuevoProducto);
        guardarProductos();
        
        console.log('Producto publicado:', nuevoProducto);
        
        mostrarAlerta(
            '¡Producto publicado!',
            `"${nombre}" ha sido agregado exitosamente al catálogo.`,
            'exito'
        );
        
        (document.getElementById('form-producto') as HTMLFormElement).reset();
        const preview = document.getElementById('preview-imagen');
        if (preview) preview.style.display = 'none';
        
        mostrarProductos();
        actualizarEstadisticas();
        cambiarSeccion('publicar');
    };
    
    reader.readAsDataURL(archivo);
}

function mostrarProductos(): void {
    const listaProductos = document.getElementById('lista-productos');
    if (!listaProductos) return;
    
    if (productos.length === 0) {
        listaProductos.innerHTML = '<p class="mensaje-vacio">Aún no has publicado ningún producto</p>';
        return;
    }
    
    listaProductos.innerHTML = productos.map(producto => `
        <div class="producto-vendedor-card">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <span class="categoria">${producto.categoria}</span>
            <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">${producto.descripcion}</p>
            <div class="producto-acciones">
                <button class="btn-editar" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function eliminarProducto(id: number): void {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    mostrarConfirmacion(
        'Confirmar eliminación',
        `¿Estás seguro de que deseas eliminar "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`,
        () => {
            productos = productos.filter(p => p.id !== id);
            guardarProductos();
            mostrarProductos();
            actualizarEstadisticas();
            console.log('Producto eliminado:', producto);
            
            mostrarAlerta(
                'Producto eliminado',
                `"${producto.nombre}" ha sido eliminado del catálogo.`,
                'exito'
            );
        }
    );
}

function editarProducto(id: number): void {
    mostrarAlerta(
        'Función en desarrollo',
        'La edición de productos estará disponible próximamente.',
        'info'
    );
}

function guardarProductos(): void {
    localStorage.setItem('productosVendedor', JSON.stringify(productos));
}

function cargarProductos(): void {
    const productosGuardados = localStorage.getItem('productosVendedor');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
        if (productos.length > 0) {
            productoIdCounter = Math.max(...productos.map(p => p.id)) + 1;
        }
        mostrarProductos();
    }
}

function actualizarEstadisticas(): void {
    const statProductos = document.getElementById('stat-productos');
    const statVentas = document.getElementById('stat-ventas');
    const statVendidos = document.getElementById('stat-vendidos');
    const statCalificacion = document.getElementById('stat-calificacion');
    
    if (statProductos) statProductos.textContent = productos.length.toString();
    if (statVentas) statVentas.textContent = '$0.00';
    if (statVendidos) statVendidos.textContent = '0';
    if (statCalificacion) statCalificacion.textContent = '0.0';
}

function actualizarBotonLogin(): void {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    const btnLogin = document.querySelector('.btn-login') as HTMLButtonElement;
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion') as HTMLButtonElement;
    
    if (btnLogin && usuarioActivo) {
        const usuario: Usuario = JSON.parse(usuarioActivo);
        btnLogin.textContent = 'Mi Cuenta';
        btnLogin.onclick = () => {
            mostrarMenuCuenta(usuario);
        };
    }
    
    if (btnCerrarSesion) {
        btnCerrarSesion.onclick = cerrarSesion;
    }
}

function mostrarMenuCuenta(usuario: Usuario): void {
    mostrarAlerta(
        `¡Bienvenido ${usuario.nombreEmpresa}!`,
        `Tipo de cuenta: ${usuario.tipo}\nEmail: ${usuario.email}`,
        'info'
    );
}

function cerrarSesion(): void {
    mostrarConfirmacion(
        'Cerrar sesión',
        '¿Estás seguro de que deseas cerrar sesión?',
        () => {
            localStorage.removeItem('usuarioActivo');
            window.location.href = '/components/login/login.html';
        }
    );
}

(window as any).eliminarProducto = eliminarProducto;
(window as any).editarProducto = editarProducto;

export {};