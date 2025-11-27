let tipoUsuarioLogin = 'comprador';

// Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const btnComprador = document.getElementById('btn-comprador');
    const btnVendedor = document.getElementById('btn-vendedor');
    const loginForm = document.getElementById('login-form');
    if (btnComprador) {
        btnComprador.addEventListener('click', () => seleccionarTipoUsuario('comprador'));
    }
    if (btnVendedor) {
        btnVendedor.addEventListener('click', () => seleccionarTipoUsuario('vendedor'));
    }
    if (loginForm) {
        loginForm.addEventListener('submit', manejarLogin);
    }
});
function seleccionarTipoUsuario(tipo) {
    tipoUsuarioLogin = tipo;
    const btnComprador = document.getElementById('btn-comprador');
    const btnVendedor = document.getElementById('btn-vendedor');
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
}
function manejarLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
        mostrarAlerta('Campo requerido', 'Por favor, complete todos los campos.', 'error');
        return;
    }
    // Obtener usuarios registrados
    const usuariosJSON = localStorage.getItem('usuariosRegistrados');
    let usuarios = [];
    if (usuariosJSON) {
        usuarios = JSON.parse(usuariosJSON);
    }
    // Agregar usuario predeterminado Qatu si no existe
    const vendedorQatu = {
        tipo: 'vendedor',
        nombreEmpresa: 'Qatu',
        email: 'qatu@qatu.com',
        password: 'qatu'
    };
    const existeQatu = usuarios.some(u => u.email === 'qatu@qatu.com');
    if (!existeQatu) {
        usuarios.push(vendedorQatu);
    }
    // Buscar usuario
    const usuarioEncontrado = usuarios.find(u => 
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        u.tipo === tipoUsuarioLogin
    );
    if (usuarioEncontrado) {
        // ✅ NO guardar password en sesión
        const usuarioSesion = {
            tipo: usuarioEncontrado.tipo,
            email: usuarioEncontrado.email,
            nombreEmpresa: usuarioEncontrado.nombreEmpresa,
            nombre: usuarioEncontrado.nombre,
            apellido: usuarioEncontrado.apellido
        };
        // Login exitoso
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioSesion));
        console.log('Login exitoso para:', usuarioEncontrado.email);
        mostrarAlerta('¡Bienvenido!', `Bienvenido ${usuarioEncontrado.nombreEmpresa || usuarioEncontrado.nombre}!`, 'éxito');
        // Redirigir según tipo de usuario
        setTimeout(() => {
            if (usuarioEncontrado.tipo === 'vendedor') {
                window.location.href = '/components/dashboard/dashboard-vendedor.html';
            } else {
                window.location.href = '/public/index.html';
            }
        }, 1500);
    } else {
        // Credenciales incorrectas
        mostrarAlerta(
            'Error de autenticación',
            `Credenciales incorrectas o no existe una cuenta de ${tipoUsuarioLogin} con estos datos.\n\nPor favor, verifique:\n- El correo electrónico\n- La contraseña\n- Que esté seleccionando el tipo de cuenta correcto`,
            'error'
        );
    }
}
// Exportar para convertir en módulo
export {};
//# sourceMappingURL=login.js.map