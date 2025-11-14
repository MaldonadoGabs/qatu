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

function showNotification(message, type, duration = 3000) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }
}

function saveToMemory() {
    // Guardar en localStorage para persistencia básica
    localStorage.setItem('qatu_users', JSON.stringify(users));
    localStorage.setItem('qatu_current_user', JSON.stringify(currentUser));
    console.log('Usuarios en memoria:', users);
    console.log('Usuario actual:', currentUser);
}

function loadFromMemory() {
    // Cargar desde localStorage
    const savedUsers = localStorage.getItem('qatu_users');
    const savedCurrentUser = localStorage.getItem('qatu_current_user');
    
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    if (savedCurrentUser && savedCurrentUser !== 'null') {
        currentUser = JSON.parse(savedCurrentUser);
    }
    
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
    } else if (path.includes('index.html') || path.endsWith('/')) {
        initDashboard();
    }
}

// === PÁGINA DE DASHBOARD ===
function initDashboard() {
    const btnLogin = document.querySelector('.btn-login');
    const userInfo = document.getElementById('user-info');
    
    // Si hay usuario logueado, mostrar su información
    if (currentUser && currentUser.verified) {
        if (btnLogin && userInfo) {
            btnLogin.style.display = 'none';
            userInfo.style.display = 'flex';
            document.getElementById('user-name-display').textContent = currentUser.name;
        }
    }
    
    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    currentUser = null;
    saveToMemory();
    showNotification('Sesión cerrada exitosamente', 'info');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
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
        showNotification(`Tu cuenta no está verificada. Código: ${newCode}`, 'info', 5000);
        setTimeout(() => {
            window.location.href = 'verificacion.html';
        }, 5000);
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
    
    showNotification(`Registro exitoso. Código de verificación: ${verificationCode}`, 'success', 5000);
    
    // Redirigir a verificación
    setTimeout(() => {
        window.location.href = 'verificacion.html';
    }, 5000);
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
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    if (code === currentUser.verificationCode) {
        // Encontrar el usuario en el array y actualizarlo
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].verified = true;
            delete users[userIndex].verificationCode;
        }
        
        currentUser.verified = true;
        delete currentUser.verificationCode;
        saveToMemory();
        
        showNotification('¡Verificación exitosa! Redirigiendo al login...', 'success');
        
        // Redirigir al login para que inicie sesión
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showNotification('Código de verificación incorrecto', 'error');
        // NO redirigir, permitir que el usuario intente de nuevo
    }
}

function handleResendCode() {
    if (currentUser) {
        const newCode = generateVerificationCode();
        currentUser.verificationCode = newCode;
        
        // Actualizar también en el array de usuarios
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].verificationCode = newCode;
        }
        
        saveToMemory();
        showNotification(`Nuevo código enviado: ${newCode}`, 'info', 5000);
    } else {
        showNotification('Error: No hay usuario para reenviar código', 'error');
    }
}