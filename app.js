"use strict";
// Variables globales
let users = [];
let currentSession = {
    user: null,
    isLoggedIn: false
};
// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const verificationForm = document.getElementById('verificationForm');
const dashboard = document.getElementById('dashboard');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const verificationFormElement = document.getElementById('verificationFormElement');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const resendCodeLink = document.getElementById('resendCode');
const logoutBtn = document.getElementById('logoutBtn');
// Funciones de utilidad
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
function switchForm(hideForm, showForm) {
    hideForm.classList.remove('active');
    setTimeout(() => {
        showForm.classList.add('active');
    }, 100);
}
function saveToStorage() {
    const usersData = JSON.stringify(users);
    const sessionData = JSON.stringify(currentSession);
    // Nota: En producción, usar una base de datos real
    console.log('Usuarios guardados:', users);
    console.log('Sesión actual:', currentSession);
}
function loadFromStorage() {
    // Simular carga desde almacenamiento
    // En producción, cargar desde una base de datos
    console.log('Cargando datos...');
}
// Registro de usuario
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const role = document.getElementById('registerRole').value;
    // Validaciones
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
        name,
        email,
        password, // En producción, hashear la contraseña
        role,
        verified: false,
        verificationCode
    };
    users.push(newUser);
    currentSession.user = newUser;
    saveToStorage();
    showNotification(`Código de verificación: ${verificationCode}`, 'info');
    switchForm(registerForm, verificationForm);
});
// Inicio de sesión
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        showNotification('Credenciales incorrectas', 'error');
        return;
    }
    if (!user.verified) {
        currentSession.user = user;
        const newCode = generateVerificationCode();
        user.verificationCode = newCode;
        saveToStorage();
        showNotification(`Código de verificación: ${newCode}`, 'info');
        switchForm(loginForm, verificationForm);
        return;
    }
    currentSession.user = user;
    currentSession.isLoggedIn = true;
    saveToStorage();
    showDashboard();
    showNotification('¡Bienvenido de nuevo!', 'success');
});
// Verificación de código
verificationFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('verificationCode').value;
    if (!currentSession.user) {
        showNotification('Error: Usuario no encontrado', 'error');
        return;
    }
    if (code === currentSession.user.verificationCode) {
        currentSession.user.verified = true;
        currentSession.isLoggedIn = true;
        delete currentSession.user.verificationCode;
        saveToStorage();
        showDashboard();
        showNotification('¡Usuario verificado exitosamente!', 'success');
    }
    else {
        showNotification('Código de verificación incorrecto', 'error');
    }
});
// Reenviar código
resendCodeLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentSession.user) {
        const newCode = generateVerificationCode();
        currentSession.user.verificationCode = newCode;
        saveToStorage();
        showNotification(`Nuevo código: ${newCode}`, 'info');
    }
});
// Mostrar dashboard
function showDashboard() {
    if (!currentSession.user)
        return;
    document.getElementById('userName').textContent = currentSession.user.name;
    document.getElementById('userEmail').textContent = currentSession.user.email;
    document.getElementById('userRole').textContent = currentSession.user.role.charAt(0).toUpperCase() + currentSession.user.role.slice(1);
    const statusBadge = document.getElementById('userStatus');
    statusBadge.textContent = currentSession.user.verified ? 'Verificado' : 'Pendiente';
    statusBadge.className = `status-badge ${currentSession.user.verified ? 'verified' : 'pending'}`;
    switchForm(loginForm, dashboard);
    switchForm(registerForm, dashboard);
    switchForm(verificationForm, dashboard);
}
// Cerrar sesión
logoutBtn.addEventListener('click', () => {
    currentSession = {
        user: null,
        isLoggedIn: false
    };
    saveToStorage();
    loginFormElement.reset();
    switchForm(dashboard, loginForm);
    showNotification('Sesión cerrada', 'info');
});
// Navegación entre formularios
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(loginForm, registerForm);
});
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(registerForm, loginForm);
});
// Inicialización
loadFromStorage();
//# sourceMappingURL=app.js.map