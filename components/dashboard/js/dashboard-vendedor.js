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
        // No hay sesión, redirigir a login
        window.location.href = '/components/login/login.html';
        return;
    }

    const usuario = JSON.parse(usuarioActivo);

    // Verificar que sea un vendedor
    if (usuario.tipo !== 'vendedor') {
        // Es comprador, redirigir a index.html
        window.location.href = '/public/index.html';
        return;
    }

    console.log('Sesión de vendedor verificada:', usuario.email);
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
    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
    });

    const navActivo = document.getElementById(`nav-${nombreSeccion}`);
    if (navActivo) {
        navActivo.classList.add('active');
        navActivo.setAttribute('aria-selected', 'true');
    }

    // Mostrar sección correspondiente
    document.querySelectorAll('.seccion-vendedor').forEach(seccion => {
        seccion.classList.remove('active');
    });

    const seccionActiva = document.getElementById(`seccion-${nombreSeccion}`);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }

    seccionActual = nombreSeccion;

    // Actualizar estadísticas si se accede a esa sección
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
        if (preview) preview.style.display = 'none';
        return;
    }

    const archivo = input.files[0];
    if (!archivo) return;

    // Validar formato
    const formatosPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!formatosPermitidos.includes(archivo.type)) {
        mostrarAlerta('Error de validación', 'Formato de imagen no válido. Por favor, use JPG, JPEG, PNG o WEBP.', 'error');
        input.value = '';
        if (preview) preview.style.display = 'none';
        return;
    }

    // Validar tamaño (5MB máximo)
    const tamañoMaximo = 5 * 1024 * 1024;
    if (archivo.size > tamañoMaximo) {
        mostrarAlerta('Error de tamaño', 'El tamaño de la imagen excede el límite de 5MB. Por favor, seleccione una imagen más pequeña.', 'error');
        input.value = '';
        if (preview) preview.style.display = 'none';
        return;
    }

    // Mostrar vista previa
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
    if (!usuarioActivo) return;

    const usuario = JSON.parse(usuarioActivo);
    const nombre = document.getElementById('nombre-producto').value.trim();
    const precioInput = document.getElementById('precio-producto').value;
    const categoria = document.getElementById('categoria-producto').value;
    const descripcion = document.getElementById('descripcion-producto').value.trim();
    const inputImagen = document.getElementById('imagen-producto');

    // Validar campos obligatorios
    const camposFaltantes = [];
    if (!nombre) camposFaltantes.push('Nombre del Producto');
    if (!precioInput || parseFloat(precioInput) <= 0) camposFaltantes.push('Precio válido');
    if (!categoria) camposFaltantes.push('Categoría');
    if (!descripcion) camposFaltantes.push('Descripción');
    if (!inputImagen.files || inputImagen.files.length === 0) camposFaltantes.push('Imagen del Producto');

    if (camposFaltantes.length > 0) {
        const mensaje = 'Por favor, complete los siguientes campos obligatorios:\n\n' +
            camposFaltantes.map(campo => '- ' + campo).join('\n');
        mostrarAlerta('Campos obligatorios', mensaje, 'error');
        return;
    }

    const precio = parseFloat(precioInput);

    // Convertir imagen a base64
    if (!inputImagen.files || inputImagen.files.length === 0) return;

    const archivo = inputImagen.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        if (!event.target) return;

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

        mostrarAlerta(
            'Éxito',
            `Producto "${nombre}" publicado exitosamente en el catálogo.`,
            'éxito'
        );

        // Limpiar formulario
        document.getElementById('form-producto').reset();
        const preview = document.getElementById('preview-imagen');
        if (preview) preview.style.display = 'none';

        // Actualizar lista de productos
        cargarProductosVendedor();
        actualizarEstadisticas();

        // Cambiar a sección de publicar para ver el producto listado
        cambiarSeccion('publicar');
    };
    reader.readAsDataURL(archivo);
}

function cargarProductosVendedor() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (!usuarioActivo) return;

    const usuario = JSON.parse(usuarioActivo);
    const productosJSON = localStorage.getItem('productosVendedor');

    if (usuario.tipo !== 'vendedor') {
        return;
    }

    let todosProductos = [];
    if (productosJSON) {
        todosProductos = JSON.parse(productosJSON);
    }

    // ✅ FILTRAR: Solo mostrar productos de ESTE vendedor (por nombre empresa O email)
    const vendedorActual = usuario.nombreEmpresa || usuario.email;
    const misProductos = todosProductos.filter(p => 
        p.vendedor === vendedorActual
    );

    const listaProductos = document.getElementById('lista-productos');

    if (misProductos.length === 0) {
        listaProductos.innerHTML = '<p class="mensaje-vacio">Aún no has publicado ningún producto</p>';
        return;
    }

    listaProductos.innerHTML = misProductos.map(producto => `
        <div class="producto-vendedor-card">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <p class="categoria">${producto.categoria}</p>
            <div class="producto-acciones">
                <button class="btn-editar" onclick="editarProducto(${producto.id})" aria-label="Editar producto">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})" aria-label="Eliminar producto">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function eliminarProducto(productoId) {
    // ✅ Usar mostrarConfirmacion en lugar de confirm
    mostrarConfirmacion(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar este producto?',
        () => {
            let productos = JSON.parse(localStorage.getItem('productosVendedor') || '[]');
            productos = productos.filter(p => p.id !== productoId);
            localStorage.setItem('productosVendedor', JSON.stringify(productos));
            cargarProductosVendedor();
            actualizarEstadisticas();
            mostrarAlerta('Eliminado', 'Producto eliminado correctamente', 'éxito');
        }
    );
}

function editarProducto(id) {
    mostrarAlerta('En desarrollo', 'Función de edición en desarrollo', 'info');
}

function guardarProductos() {
    localStorage.setItem('productosVendedor', JSON.stringify(productos));
}

function cargarProductos() {
    const productosGuardados = localStorage.getItem('productosVendedor');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
        // Actualizar el contador
        if (productos.length > 0) {
            productoIdCounter = Math.max(...productos.map(p => p.id)) + 1;
        }
        cargarProductosVendedor();
    }
}

function actualizarEstadisticas() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (!usuarioActivo) return;

    const usuario = JSON.parse(usuarioActivo);
    const productosJSON = localStorage.getItem('productosVendedor');
    let todosProductos = [];

    if (productosJSON) {
        todosProductos = JSON.parse(productosJSON);
    }

    // ✅ Filtrar solo los productos de este vendedor
    const vendedorActual = usuario.nombreEmpresa || usuario.email;
    const misProductos = todosProductos.filter(p => p.vendedor === vendedorActual);

    const statProductos = document.getElementById('stat-productos');
    const statVentas = document.getElementById('stat-ventas');
    const statVendidos = document.getElementById('stat-vendidos');
    const statCalificacion = document.getElementById('stat-calificacion');

    if (statProductos) statProductos.textContent = misProductos.length.toString();
    if (statVentas) statVentas.textContent = '$0.00'; // Por ahora
    if (statVendidos) statVendidos.textContent = '0'; // Por ahora
    if (statCalificacion) statCalificacion.textContent = '⭐ 0.0'; // Por ahora
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
    mostrarAlerta(
        'Mi Cuenta',
        `Bienvenido ${usuario.nombreEmpresa}!\n\nTipo de cuenta: ${usuario.tipo}\nCorreo: ${usuario.email}`,
        'éxito'
    );
}

function cerrarSesion() {
    // ✅ Usar mostrarConfirmacion en lugar de confirm
    mostrarConfirmacion(
        'Confirmar cierre de sesión',
        '¿Estás seguro de que deseas cerrar sesión?',
        () => {
            localStorage.removeItem('usuarioActivo');
            window.location.href = '/components/login/login.html';
        }
    );
}
// Hacer funciones disponibles globalmente
window.eliminarProducto = eliminarProducto;
window.editarProducto = editarProducto;
export {};
//# sourceMappingURL=dashboard-vendedor.js.map