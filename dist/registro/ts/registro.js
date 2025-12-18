var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class RegistroPage {
    constructor() {
        this.tipoUsuario = 'comprador';
        this.formComprador = document.getElementById('form-comprador');
        this.formVendedor = document.getElementById('form-vendedor');
        this.btnComprador = document.getElementById('btn-comprador');
        this.btnVendedor = document.getElementById('btn-vendedor');
        if (!this.formComprador || !this.formVendedor) {
            console.error('No se encontraron los formularios');
            return;
        }
        this.init();
    }
    init() {
        this.configurarTipoUsuario();
        this.configurarFormularios();
    }
    configurarTipoUsuario() {
        this.btnComprador.addEventListener('click', () => {
            this.cambiarTipoUsuario('comprador');
        });
        this.btnVendedor.addEventListener('click', () => {
            this.cambiarTipoUsuario('vendedor');
        });
    }
    cambiarTipoUsuario(tipo) {
        this.tipoUsuario = tipo;
        if (tipo === 'comprador') {
            this.btnComprador.classList.add('active');
            this.btnVendedor.classList.remove('active');
            this.formComprador.style.display = 'block';
            this.formVendedor.style.display = 'none';
        }
        else {
            this.btnVendedor.classList.add('active');
            this.btnComprador.classList.remove('active');
            this.formVendedor.style.display = 'block';
            this.formComprador.style.display = 'none';
        }
    }
    configurarFormularios() {
        this.formComprador.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRegistroComprador();
        });
        this.formVendedor.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRegistroVendedor();
        });
    }
    procesarRegistroComprador() {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData(this.formComprador);
            const nombre = formData.get('nombre');
            const apellido = formData.get('apellido');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm-password');
            // Validaciones
            if (!this.validarFormulario(email, password, confirmPassword, nombre)) {
                return;
            }
            // Verificar si el email ya existe
            if (this.emailYaRegistrado(email)) {
                mostrarAlerta('Email ya registrado', 'Este correo electrónico ya está registrado. Por favor, inicia sesión.', 'error');
                return;
            }
            // Generar código de verificación
            const codigoVerificacion = this.generarCodigoVerificacion();
            const fechaExpiracion = new Date();
            fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);
            // Crear usuario pendiente
            const usuarioPendiente = {
                email: email,
                password: password,
                tipo: 'comprador',
                nombre: nombre,
                apellido: apellido,
                verificado: false,
                codigoVerificacion: codigoVerificacion,
                fechaExpiracionCodigo: fechaExpiracion.toISOString()
            };
            this.guardarYRedirigir(usuarioPendiente, codigoVerificacion, email);
        });
    }
    procesarRegistroVendedor() {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData(this.formVendedor);
            const nombreEmpresa = formData.get('nombre-empresa');
            const email = formData.get('email-vendedor');
            const password = formData.get('password-vendedor');
            const confirmPassword = formData.get('confirm-password-vendedor');
            // Validaciones
            if (!this.validarFormulario(email, password, confirmPassword, nombreEmpresa)) {
                return;
            }
            // Verificar si el email ya existe
            if (this.emailYaRegistrado(email)) {
                mostrarAlerta('Email ya registrado', 'Este correo electrónico ya está registrado. Por favor, inicia sesión.', 'error');
                return;
            }
            // Generar código de verificación
            const codigoVerificacion = this.generarCodigoVerificacion();
            const fechaExpiracion = new Date();
            fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);
            // Crear usuario pendiente
            const usuarioPendiente = {
                email: email,
                password: password,
                tipo: 'vendedor',
                nombreEmpresa: nombreEmpresa,
                verificado: false,
                codigoVerificacion: codigoVerificacion,
                fechaExpiracionCodigo: fechaExpiracion.toISOString()
            };
            this.guardarYRedirigir(usuarioPendiente, codigoVerificacion, email);
        });
    }
    guardarYRedirigir(usuario, codigo, email) {
        // Guardar en localStorage
        this.guardarUsuarioPendiente(usuario);
        try {
            console.log('Código de verificación:', codigo);
            console.log('Email destinatario:', email);
            mostrarAlerta('¡Registro exitoso!', 'Se ha enviado un código de verificación a tu correo electrónico. Revisa tu bandeja de entrada.', 'exito');
            // Redirigir a página de verificación
            setTimeout(() => {
                window.location.href = '/components/verificacion/verificacion.html';
            }, 2000);
        }
        catch (error) {
            console.error('Error al enviar email:', error);
            mostrarAlerta('Error al enviar código', 'No se pudo enviar el código de verificación. Por favor, intenta nuevamente.', 'error');
        }
    }
    validarFormulario(email, password, confirmPassword, nombre) {
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarAlerta('Email inválido', 'Por favor, ingresa un correo electrónico válido.', 'error');
            return false;
        }
        // Validar nombre
        if (!nombre || nombre.trim().length < 3) {
            mostrarAlerta('Nombre muy corto', 'El nombre debe tener al menos 3 caracteres.', 'error');
            return false;
        }
        // Validar contraseña
        if (password.length < 8) {
            mostrarAlerta('Contraseña débil', 'La contraseña debe tener al menos 8 caracteres para mayor seguridad.', 'error');
            return false;
        }
        // Validar confirmación de contraseña
        if (password !== confirmPassword) {
            mostrarAlerta('Contraseñas no coinciden', 'Las contraseñas ingresadas no son iguales. Por favor, verifícalas.', 'error');
            return false;
        }
        return true;
    }
    emailYaRegistrado(email) {
        // Verificar en usuarios verificados
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const existeVerificado = usuarios.some((u) => u.email === email);
        // Verificar en usuarios pendientes
        const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes') || '[]');
        const existePendiente = usuariosPendientes.some((u) => u.email === email);
        return existeVerificado || existePendiente;
    }
    guardarUsuarioPendiente(usuario) {
        const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes') || '[]');
        usuariosPendientes.push(usuario);
        localStorage.setItem('usuariosPendientes', JSON.stringify(usuariosPendientes));
    }
    generarCodigoVerificacion() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RegistroPage();
});
export {};
//# sourceMappingURL=registro.js.map