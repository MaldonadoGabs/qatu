var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Importar servicio de email
import { enviarCodigoVerificacion } from '../../services/emailService.js';
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
            if (!this.validarFormulario(email, password, confirmPassword, nombre)) {
                return;
            }
            if (this.emailYaRegistrado(email)) {
                mostrarAlerta('Email ya registrado', 'Este correo electrónico ya está registrado. Por favor, inicia sesión.', 'error');
                return;
            }
            const codigoVerificacion = this.generarCodigoVerificacion();
            const fechaExpiracion = new Date();
            fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);
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
            yield this.guardarYRedirigir(usuarioPendiente, codigoVerificacion, email, `${nombre} ${apellido}`);
        });
    }
    procesarRegistroVendedor() {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData(this.formVendedor);
            const nombreEmpresa = formData.get('nombre-empresa');
            const email = formData.get('email-vendedor');
            const password = formData.get('password-vendedor');
            const confirmPassword = formData.get('confirm-password-vendedor');
            if (!this.validarFormulario(email, password, confirmPassword, nombreEmpresa)) {
                return;
            }
            if (this.emailYaRegistrado(email)) {
                mostrarAlerta('Email ya registrado', 'Este correo electrónico ya está registrado. Por favor, inicia sesión.', 'error');
                return;
            }
            const codigoVerificacion = this.generarCodigoVerificacion();
            const fechaExpiracion = new Date();
            fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);
            const usuarioPendiente = {
                email: email,
                password: password,
                tipo: 'vendedor',
                nombreEmpresa: nombreEmpresa,
                verificado: false,
                codigoVerificacion: codigoVerificacion,
                fechaExpiracionCodigo: fechaExpiracion.toISOString()
            };
            yield this.guardarYRedirigir(usuarioPendiente, codigoVerificacion, email, nombreEmpresa);
        });
    }
    guardarYRedirigir(usuario, codigo, email, nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            // Guardar SIEMPRE primero
            this.guardarUsuarioPendiente(usuario);
            // Mostrar mensaje de envío
            mostrarAlerta('Enviando código...', 'Por favor espera mientras enviamos el código de verificación a tu correo.', 'info');
            let emailEnviado = false;
            try {
                // Intentar enviar email con EmailJS
                emailEnviado = yield enviarCodigoVerificacion({
                    to_email: email,
                    nombre: nombre,
                    codigo: codigo
                });
                if (emailEnviado) {
                    console.log('✅ Código enviado exitosamente al email:', email);
                    mostrarAlerta('¡Registro exitoso!', 'Se ha enviado un código de verificación a tu correo electrónico. Por favor revisa tu bandeja de entrada (y spam).', 'exito');
                }
                else {
                    throw new Error('No se pudo enviar el email');
                }
            }
            catch (error) {
                console.error('❌ Error al enviar email:', error);
                console.log('🔢 Código de verificación (usar en consola):', codigo);
                mostrarAlerta('Código generado', `No se pudo enviar el email, pero tu registro fue exitoso.\n\nTu código de verificación es:\n\n${codigo}\n\n(También puedes verlo en la consola del navegador)`, 'error');
            }
            // SIEMPRE redirigir después de 3 segundos, sin importar si el email se envió o no
            setTimeout(() => {
                window.location.href = '/components/verificacion/verificacion.html';
            }, 3000);
        });
    }
    validarFormulario(email, password, confirmPassword, nombre) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarAlerta('Email inválido', 'Por favor, ingresa un correo electrónico válido.', 'error');
            return false;
        }
        if (!nombre || nombre.trim().length < 3) {
            mostrarAlerta('Nombre muy corto', 'El nombre debe tener al menos 3 caracteres.', 'error');
            return false;
        }
        if (password.length < 8) {
            mostrarAlerta('Contraseña débil', 'La contraseña debe tener al menos 8 caracteres para mayor seguridad.', 'error');
            return false;
        }
        if (password !== confirmPassword) {
            mostrarAlerta('Contraseñas no coinciden', 'Las contraseñas ingresadas no son iguales. Por favor, verifícalas.', 'error');
            return false;
        }
        return true;
    }
    emailYaRegistrado(email) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const existeVerificado = usuarios.some((u) => u.email === email);
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
document.addEventListener('DOMContentLoaded', () => {
    new RegistroPage();
});
//# sourceMappingURL=registro.js.map