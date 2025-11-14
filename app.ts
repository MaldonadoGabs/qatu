// Interfaces
interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'comprador' | 'vendedor' | 'admin';
    verified: boolean;
    verificationCode?: string;
}

interface Session {
    user: User | null;
    isLoggedIn: boolean;
}

// Variables globales
let users: User[] = [];
let currentSession: Session = {
    user: null,
    isLoggedIn: false
};

// Elementos del DOM
const loginForm = document.getElementById('loginForm') as HTMLDivElement;
const registerForm = document.getElementById('registerForm') as HTMLDivElement;
const verificationForm = document.getElementById('verificationForm') as HTMLDivElement;
const dashboard = document.getElementById('dashboard') as HTMLDivElement;

const loginFormElement = document.getElementById('loginFormElement') as HTMLFormElement;
const registerFormElement = document.getElementById('registerFormElement') as HTMLFormElement;
const verificationFormElement = document.getElementById('verificationFormElement') as HTMLFormElement;

const showRegisterLink = document.getElementById('showRegister') as HTMLAnchorElement;
const showLoginLink = document.getElementById('showLogin') as HTMLAnchorElement;
const resendCodeLink = document.getElementById('resendCode') as HTMLAnchorElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;

// Funciones de utilidad
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    const notification = document.getElementById('notification') as HTMLDivElement;
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function switchForm(hideForm: HTMLDivElement, showForm: HTMLDivElement): void {
    hideForm.classList.remove('active');
    setTimeout(() => {
        showForm.classList.add('active');
    }, 100);
}

function saveToStorage(): void {
    const usersData = JSON.stringify(users);
    const sessionData = JSON.stringify(currentSession);
    // Nota: En producción, usar una base de datos real
    console.log('Usuarios guardados:', users);
    console.log('Sesión actual:', currentSession);
}

function loadFromStorage(): void {
    // Simular carga desde almacenamiento
    // En producción, cargar desde una base de datos
    console.log('Cargando datos...');
}

// Registro de usuario
registerFormElement.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    
    const name = (document.getElementById('registerName') as HTMLInputElement).value;
    const email = (document.getElementById('registerEmail') as HTMLInputElement).value;
    const password = (document.getElementById('registerPassword') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('registerConfirmPassword') as HTMLInputElement).value;
    const role = (document.getElementById('registerRole') as HTMLSelectElement).value as 'comprador' | 'vendedor' | 'admin';
    
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
    const newUser: User = {
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
loginFormElement.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    
    const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement).value;
    
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
verificationFormElement.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    
    const code = (document.getElementById('verificationCode') as HTMLInputElement).value;
    
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
    } else {
        showNotification('Código de verificación incorrecto', 'error');
    }
});

// Reenviar código
resendCodeLink.addEventListener('click', (e: Event) => {
    e.preventDefault();
    
    if (currentSession.user) {
        const newCode = generateVerificationCode();
        currentSession.user.verificationCode = newCode;
        saveToStorage();
        showNotification(`Nuevo código: ${newCode}`, 'info');
    }
});

// Mostrar dashboard
function showDashboard(): void {
    if (!currentSession.user) return;
    
    (document.getElementById('userName') as HTMLSpanElement).textContent = currentSession.user.name;
    (document.getElementById('userEmail') as HTMLSpanElement).textContent = currentSession.user.email;
    (document.getElementById('userRole') as HTMLSpanElement).textContent = currentSession.user.role.charAt(0).toUpperCase() + currentSession.user.role.slice(1);
    
    const statusBadge = document.getElementById('userStatus') as HTMLSpanElement;
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
showRegisterLink.addEventListener('click', (e: Event) => {
    e.preventDefault();
    switchForm(loginForm, registerForm);
});

showLoginLink.addEventListener('click', (e: Event) => {
    e.preventDefault();
    switchForm(registerForm, loginForm);
});

// Inicialización
loadFromStorage();