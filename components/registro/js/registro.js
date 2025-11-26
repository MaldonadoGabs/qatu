let tipoUsuarioActual = 'comprador';
const usuariosRegistrados = [];
// Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const btnComprador = document.getElementById('btn-comprador');
    const btnVendedor = document.getElementById('btn-vendedor');
    if (btnComprador) {
        btnComprador.addEventListener('click', () => seleccionarTipoUsuario('comprador'));
    }
    if (btnVendedor) {
        btnVendedor.addEventListener('click', () => seleccionarTipoUsuario('vendedor'));
    }
    // Configurar ambos formularios
    const formComprador = document.getElementById('form-comprador');
    const formVendedor = document.getElementById('form-vendedor');
    if (formComprador) {
        formComprador.addEventListener('submit', manejarEnvioFormulario);
    }
    if (formVendedor) {
        formVendedor.addEventListener('submit', manejarEnvioFormulario);
    }
    // Simular registro del vendedor Qatu
    simularRegistroVendedorQatu();
});
function seleccionarTipoUsuario(tipo) {
    tipoUsuarioActual = tipo;
    const btnComprador = document.getElementById('btn-comprador');
    const btnVendedor = document.getElementById('btn-vendedor');
    const formComprador = document.getElementById('form-comprador');
    const formVendedor = document.getElementById('form-vendedor');
    // Actualizar estado de los botones
    if (btnComprador && btnVendedor) {
        if (tipo === 'comprador') {
            btnComprador.classList.add('active');
            btnComprador.setAttribute('aria-pressed', 'true');
            btnVendedor.classList.remove('active');
            btnVendedor.setAttribute('aria-pressed', 'false');
        } else {
            btnVendedor.classList.add('active');
            btnVendedor.setAttribute('aria-pressed', 'true');
            btnComprador.classList.remove('active');
            btnComprador.setAttribute('aria-pressed', 'false');
        }
    }
    // Mostrar/ocultar formularios
    if (formComprador && formVendedor) {
        if (tipo === 'comprador') {
            formComprador.style.display = 'flex';
            formVendedor.style.display = 'none';
        } else {
            formComprador.style.display = 'none';
            formVendedor.style.display = 'flex';
        }
    }
}
function manejarEnvioFormulario(e) {
    e.preventDefault();
    const form = e.target;
    if (tipoUsuarioActual === 'comprador') {
        const nombre = form.querySelector('#nombre')?.value;
        const apellido = form.querySelector('#apellido')?.value;
        const email = form.querySelector('#email')?.value;
        const password = form.querySelector('#password')?.value;
        const confirmPassword = form.querySelector('#confirm-password')?.value;
        if (password !== confirmPassword) {
            mostrarAlerta('Sin coincidencia', 'Las contraseñas no coinciden', 'error');
            return;
        }
        // Validar que el email no exista
        const usuariosJSON = localStorage.getItem('usuariosRegistrados');
        const usuariosExistentes = usuariosJSON ? JSON.parse(usuariosJSON) : [];
        if (usuariosExistentes.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            mostrarAlerta('Error', 'Este correo electrónico ya está registrado', 'error');
            return;
        }
        const nuevoUsuario = {
            tipo: 'comprador',
            nombre,
            apellido,
            email,
            password
        };
        registrarUsuario(nuevoUsuario);
    } else {
        const nombreEmpresa = form.querySelector('#nombre-empresa')?.value;
        const email = form.querySelector('#email-vendedor')?.value;
        const password = form.querySelector('#password-vendedor')?.value;
        const confirmPassword = form.querySelector('#confirm-password-vendedor')?.value;
        if (password !== confirmPassword) {
            mostrarAlerta('Sin coincidencia', 'Las contraseñas no coinciden', 'error');
            return;
        }
        // Validar que el email no exista
        const usuariosJSON = localStorage.getItem('usuariosRegistrados');
        const usuariosExistentes = usuariosJSON ? JSON.parse(usuariosJSON) : [];
        if (usuariosExistentes.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            mostrarAlerta('Error', 'Este correo electrónico ya está registrado', 'error');
            return;
        }
        const nuevoUsuario = {
            tipo: 'vendedor',
            nombreEmpresa,
            email,
            password
        };
        registrarUsuario(nuevoUsuario);
    }
}
function registrarUsuario(usuario) {
    const usuariosJSON = localStorage.getItem('usuariosRegistrados');
    const usuariosExistentes = usuariosJSON ? JSON.parse(usuariosJSON) : [];
    usuariosExistentes.push(usuario);
    // Guardar en localStorage todos los usuarios
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosExistentes));
    console.log('Usuario registrado exitosamente:', usuario.email);
    // ✅ Guardar sesión SIN contraseña
    const usuarioSesion = {
        tipo: usuario.tipo,
        email: usuario.email,
        nombre: usuario.nombre,
        nombreEmpresa: usuario.nombreEmpresa,
        apellido: usuario.apellido
    };
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioSesion));
    mostrarAlerta(
        'Bienvenido',
        `¡Registro exitoso! Bienvenido ${usuario.nombreEmpresa || usuario.nombre}`,
        'éxito'
    );
    // Redirigir según el tipo de usuario
    setTimeout(() => {
        if (usuario.tipo === 'vendedor') {
            window.location.href = '/components/dashboard/dashboard-vendedor.html';
        } else {
            window.location.href = '/public/index.html';
        }
    }, 1500);
}
function simularRegistroVendedorQatu() {
    const usuariosJSON = localStorage.getItem('usuariosRegistrados');
    const usuariosExistentes = usuariosJSON ? JSON.parse(usuariosJSON) : [];

    // Verificar si Qatu ya existe
    const existeQatu = usuariosExistentes.some(u => u.email === 'qatu@qatu.com');
    if (existeQatu) return;
    const vendedorQatu = {
        tipo: 'vendedor',
        nombreEmpresa: 'Qatu',
        email: 'qatu@qatu.com',
        password: 'qatu'
    };
    usuariosExistentes.push(vendedorQatu);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosExistentes));
    console.log('Vendedor Qatu registrado automáticamente');
}
// Exportar para convertir en módulo
export {};
//# sourceMappingURL=registro.js.map