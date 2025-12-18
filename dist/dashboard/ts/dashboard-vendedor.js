// Estado de la aplicación
let seccionActual = 'publicar';
let productos = [];
let productoIdCounter = 1;
// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    configurarNavegacion();
    configurarFormulario();
    actualizarBotonLogin();
    cargarProductos();
    actualizarEstadisticas();
});
function verificarSesion() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (!usuarioActivo) {
        window.location.href = '/components/login/login.html';
        return;
    }
    const usuario = JSON.parse(usuarioActivo);
    if (usuario.tipo !== 'vendedor') {
        window.location.href = '../../index.html';
        return;
    }
    console.log('Sesión de vendedor verificada:', usuario);
}
function configurarNavegacion() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const seccionId = item.id.replace('nav-', '');
            cambiarSeccion(seccionId);
        });
    });
}
function cambiarSeccion(nombreSeccion) {
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
function configurarFormulario() {
    const form = document.getElementById('form-producto');
    const inputImagen = document.getElementById('imagen-producto');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            publicarProducto();
        });
    }
    if (inputImagen) {
        inputImagen.addEventListener('change', validarYPrevisualizarImagen);
    }
}
function validarYPrevisualizarImagen(e) {
    const input = e.target;
    const preview = document.getElementById('preview-imagen');
    const imgPreview = document.getElementById('imagen-preview');
    if (!input.files || input.files.length === 0) {
        if (preview)
            preview.style.display = 'none';
        return;
    }
    const archivo = input.files[0];
    if (!archivo)
        return;
    const formatosPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (formatosPermitidos.indexOf(archivo.type) === -1) {
        mostrarAlerta('Formato inválido', 'Por favor, use imágenes en formato JPG, JPEG, PNG o WEBP.', 'error');
        input.value = '';
        if (preview)
            preview.style.display = 'none';
        return;
    }
    const tamañoMaximo = 5 * 1024 * 1024;
    if (archivo.size > tamañoMaximo) {
        mostrarAlerta('Archivo muy grande', 'El tamaño de la imagen excede el límite de 5MB. Por favor, seleccione una imagen más pequeña.', 'error');
        input.value = '';
        if (preview)
            preview.style.display = 'none';
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        if (event.target && imgPreview && preview) {
            imgPreview.src = event.target.result;
            preview.style.display = 'block';
        }
    };
    reader.readAsDataURL(archivo);
}
function publicarProducto() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (!usuarioActivo)
        return;
    const usuario = JSON.parse(usuarioActivo);
    const nombre = document.getElementById('nombre-producto').value.trim();
    const precioInput = document.getElementById('precio-producto').value;
    const categoria = document.getElementById('categoria-producto').value;
    const descripcion = document.getElementById('descripcion-producto').value.trim();
    const inputImagen = document.getElementById('imagen-producto');
    const camposFaltantes = [];
    if (!nombre)
        camposFaltantes.push('• Nombre del Producto');
    if (!precioInput || parseFloat(precioInput) <= 0)
        camposFaltantes.push('• Precio válido');
    if (!categoria)
        camposFaltantes.push('• Categoría');
    if (!descripcion)
        camposFaltantes.push('• Descripción');
    if (!inputImagen.files || inputImagen.files.length === 0)
        camposFaltantes.push('• Imagen del Producto');
    if (camposFaltantes.length > 0) {
        mostrarAlerta('Campos incompletos', 'Por favor, complete los siguientes campos obligatorios:\n\n' + camposFaltantes.join('\n'), 'error');
        return;
    }
    const precio = parseFloat(precioInput);
    if (!inputImagen.files || inputImagen.files.length === 0)
        return;
    const archivo = inputImagen.files[0];
    if (!archivo)
        return;
    const reader = new FileReader();
    reader.onload = (event) => {
        if (!event.target)
            return;
        const imagenBase64 = event.target.result;
        const nuevoProducto = {
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
        mostrarAlerta('¡Producto publicado!', `"${nombre}" ha sido agregado exitosamente al catálogo.`, 'exito');
        document.getElementById('form-producto').reset();
        const preview = document.getElementById('preview-imagen');
        if (preview)
            preview.style.display = 'none';
        mostrarProductos();
        actualizarEstadisticas();
        cambiarSeccion('publicar');
    };
    reader.readAsDataURL(archivo);
}
function mostrarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    if (!listaProductos)
        return;
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
function eliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto)
        return;
    mostrarConfirmacion('Confirmar eliminación', `¿Estás seguro de que deseas eliminar "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`, () => {
        productos = productos.filter(p => p.id !== id);
        guardarProductos();
        mostrarProductos();
        actualizarEstadisticas();
        console.log('Producto eliminado:', producto);
        mostrarAlerta('Producto eliminado', `"${producto.nombre}" ha sido eliminado del catálogo.`, 'exito');
    });
}
function editarProducto(id) {
    mostrarAlerta('Función en desarrollo', 'La edición de productos estará disponible próximamente.', 'info');
}
function guardarProductos() {
    localStorage.setItem('productosVendedor', JSON.stringify(productos));
}
function cargarProductos() {
    const productosGuardados = localStorage.getItem('productosVendedor');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
        if (productos.length > 0) {
            productoIdCounter = Math.max(...productos.map(p => p.id)) + 1;
        }
        mostrarProductos();
    }
}
function actualizarEstadisticas() {
    const statProductos = document.getElementById('stat-productos');
    const statVentas = document.getElementById('stat-ventas');
    const statVendidos = document.getElementById('stat-vendidos');
    const statCalificacion = document.getElementById('stat-calificacion');
    if (statProductos)
        statProductos.textContent = productos.length.toString();
    if (statVentas)
        statVentas.textContent = '$0.00';
    if (statVendidos)
        statVendidos.textContent = '0';
    if (statCalificacion)
        statCalificacion.textContent = '0.0';
}
function actualizarBotonLogin() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    const btnLogin = document.querySelector('.btn-login');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnLogin && usuarioActivo) {
        const usuario = JSON.parse(usuarioActivo);
        btnLogin.textContent = 'Mi Cuenta';
        btnLogin.onclick = () => {
            mostrarMenuCuenta(usuario);
        };
    }
    if (btnCerrarSesion) {
        btnCerrarSesion.onclick = cerrarSesion;
    }
}
function mostrarMenuCuenta(usuario) {
    mostrarAlerta(`¡Bienvenido ${usuario.nombreEmpresa}!`, `Tipo de cuenta: ${usuario.tipo}\nEmail: ${usuario.email}`, 'info');
}
function cerrarSesion() {
    mostrarConfirmacion('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', () => {
        localStorage.removeItem('usuarioActivo');
        window.location.href = '/components/login/login.html';
    });
}
window.eliminarProducto = eliminarProducto;
window.editarProducto = editarProducto;
export {};
//# sourceMappingURL=dashboard-vendedor.js.map