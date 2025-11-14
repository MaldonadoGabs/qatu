// Variables globales para almacenar datos en memoria
let users = [];
let currentUser = null;

// Cargar datos al iniciar
window.addEventListener('DOMContentLoaded', () => {
    loadFromMemory();
    initializePage();
});

// Funciones de utilidad
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

function saveToMemory() {
    // En producción, aquí se guardaría en una base de datos
    console.log('Usuarios en memoria:', users);
    console.log('Usuario actual:', currentUser);
}

function loadFromMemory() {
    // Simular carga desde almacenamiento
    // En producción, cargar desde una base de datos
    console.log('Cargando datos desde memoria...');
}

// Inicializar la página según el archivo HTML actual
function initializePage() {
    const path = window.location.pathname;
    
    if (path.includes('login.html')) {
        initLogin();
    } else if (path.includes('registro.html')) {
        initRegistro();
    } else if (path.includes('verificacion.html')) {
        initVerificacion();
    }
}

// === PÁGINA DE LOGIN ===
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validar campos
    if (!email || !password) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('Credenciales incorrectas', 'error');
        return;
    }
    
    // Verificar si el usuario está verificado
    if (!user.verified) {
        currentUser = user;
        const newCode = generateVerificationCode();
        user.verificationCode = newCode;
        saveToMemory();
        showNotification(`Tu cuenta no está verificada. Código: ${newCode}`, 'info');
        setTimeout(() => {
            window.location.href = 'verificacion.html';
        }, 2000);
        return;
    }
    
    // Login exitoso
    currentUser = user;
    saveToMemory();
    showNotification('¡Bienvenido de nuevo!', 'success');
    
    // Redirigir al dashboard
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// === PÁGINA DE REGISTRO ===
function initRegistro() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegistro();
        });
    }
}

function handleRegistro() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const role = document.getElementById('registerRole').value;
    
    // Validaciones
    if (!name || !email || !password || !confirmPassword || !role) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    // Verificar si el email ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showNotification('Este correo ya está registrado', 'error');
        return;
    }
    
    // Crear nuevo usuario
    const verificationCode = generateVerificationCode();
    const newUser = {
        id: generateId(),
        name: name,
        email: email,
        password: password, // En producción, hashear la contraseña
        role: role,
        verified: false,
        verificationCode: verificationCode
    };
    
    users.push(newUser);
    currentUser = newUser;
    saveToMemory();
    
    showNotification(`Registro exitoso. Código de verificación: ${verificationCode}`, 'success');
    
    // Redirigir a verificación
    setTimeout(() => {
        window.location.href = 'verificacion.html';
    }, 2000);
}

// === PÁGINA DE VERIFICACIÓN ===
function initVerificacion() {
    const verificationForm = document.getElementById('verificationForm');
    const resendCodeLink = document.getElementById('resendCode');
    
    if (verificationForm) {
        verificationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleVerificacion();
        });
    }
    
    if (resendCodeLink) {
        resendCodeLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleResendCode();
        });
    }
    
    // Verificar si hay un usuario pendiente de verificación
    if (!currentUser) {
        showNotification('No hay usuario para verificar', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

function handleVerificacion() {
    const code = document.getElementById('verificationCode').value;
    
    if (!code) {
        showNotification('Por favor ingresa el código de verificación', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Error: Usuario no encontrado', 'error');
        return;
    }
    
    if (code === currentUser.verificationCode) {
        currentUser.verified = true;
        delete currentUser.verificationCode;
        saveToMemory();
        
        showNotification('¡Usuario verificado exitosamente!', 'success');
        
        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showNotification('Código de verificación incorrecto', 'error');
    }
}

function handleResendCode() {
    if (currentUser) {
        const newCode = generateVerificationCode();
        currentUser.verificationCode = newCode;
        saveToMemory();
        showNotification(`Nuevo código enviado: ${newCode}`, 'info');
    } else {
        showNotification('Error: No hay usuario para reenviar código', 'error');
    }
}