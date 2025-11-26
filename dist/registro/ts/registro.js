var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { notifications } from '../../shared/notifications.js';
class RegistroPage {
    constructor() {
        this.tipoUsuario = 'comprador';
        this.form = document.getElementById('registro-form');
        this.btnComprador = document.getElementById('btn-comprador');
        this.btnVendedor = document.getElementById('btn-vendedor');
        this.init();
    }
    init() {
        this.configurarTipoUsuario();
        this.configurarFormulario();
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
        }
        else {
            this.btnVendedor.classList.add('active');
            this.btnComprador.classList.remove('active');
        }
        this.actualizarFormulario();
    }
    actualizarFormulario() {
        // Implementar lógica para mostrar/ocultar campos según tipo de usuario
        // Por ahora solo cambiaremos el placeholder del nombre
        const nombreInput = document.getElementById('nombre');
        if (nombreInput) {
            if (this.tipoUsuario === 'vendedor') {
                nombreInput.placeholder = 'Nombre de la empresa';
            }
            else {
                nombreInput.placeholder = 'Nombre completo';
            }
        }
    }
    configurarFormulario() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRegistro();
        });
    }
    procesarRegistro() {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData(this.form);
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm-password');
            const nombre = formData.get('nombre');
            // Validaciones
            if (!this.validarFormulario(email, password, confirmPassword, nombre)) {
                return;
            }
            // Verificar si el email ya existe
            if (this.emailYaRegistrado(email)) {
                notifications.error('Este correo electrónico ya está registrado');
                return;
            }
            // Generar código de verificación
            const codigoVerificacion = this.generarCodigoVerificacion();
            const fechaExpiracion = new Date();
            fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);
            // Crear usuario pendiente
            const usuarioPendiente = {
                email: email,
                password: password, // En producción, esto debería hashearse antes de guardar
                tipo: this.tipoUsuario,
                verificado: false,
                codigoVerificacion: codigoVerificacion,
                fechaExpiracionCodigo: fechaExpiracion.toISOString()
            };
            if (this.tipoUsuario === 'comprador') {
                usuarioPendiente.nombre = nombre;
            }
            else {
                usuarioPendiente.nombreEmpresa = nombre;
                usuarioPendiente.ruc = formData.get('ruc');
            }
            // Guardar en localStorage (temporal)
            this.guardarUsuarioPendiente(usuarioPendiente);
            // Enviar email de verificación
            try {
                // Por ahora seguimos mostrando en consola para pruebas
                console.log('Código de verificación:', codigoVerificacion);
                console.log('Email destinatario:', email);
                // TODO: Implementar envío real de email cuando se configure el backend
                // const emailService = new EmailService();
                // await emailService.sendVerificationEmail({
                //     email: email,
                //     verificationCode: codigoVerificacion
                // });
                notifications.success('Se ha enviado un código de verificación a tu correo electrónico');
            }
            catch (error) {
                console.error('Error al enviar email:', error);
                notifications.error('No se pudo enviar el código de verificación. Intenta nuevamente.');
                return;
            }
            // Redirigir a página de verificación después de 2 segundos
            setTimeout(() => {
                window.location.href = '/componentes/verificacion/verificacion.html';
            }, 2000);
        });
    }
    validarFormulario(email, password, confirmPassword, nombre) {
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            notifications.error('Por favor, ingresa un correo electrónico válido');
            return false;
        }
        // Validar nombre
        if (!nombre || nombre.trim().length < 3) {
            notifications.error('El nombre debe tener al menos 3 caracteres');
            return false;
        }
        // Validar contraseña
        if (password.length < 8) {
            notifications.error('La contraseña debe tener al menos 8 caracteres');
            return false;
        }
        // Validar confirmación de contraseña
        if (password !== confirmPassword) {
            notifications.error('Las contraseñas no coinciden');
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
//# sourceMappingURL=registro.js.map