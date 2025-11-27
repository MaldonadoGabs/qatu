import { notifications } from '../../shared/notifications';
class VerificacionPage {
    constructor() {
        this.emailUsuario = '';
        this.inputs = document.querySelectorAll('.codigo-input');
        this.form = document.getElementById('form-verificacion');
        this.btnReenviar = document.getElementById('btn-reenviar');
        this.init();
    }
    init() {
        // Obtener email del usuario pendiente
        const usuarioPendiente = this.obtenerUsuarioPendiente();
        if (!usuarioPendiente) {
            notifications.error('No hay proceso de verificación en curso');
            setTimeout(() => {
                window.location.href = './registro/registro.html';
            }, 2000);
            return;
        }
        this.emailUsuario = usuarioPendiente.email;
        this.configurarInputs();
        this.configurarFormulario();
        this.configurarReenvio();
    }
    obtenerUsuarioPendiente() {
        const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes') || '[]');
        return usuariosPendientes[usuariosPendientes.length - 1] || null;
    }
    configurarInputs() {
        this.inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => this.manejarInput(e, index));
            input.addEventListener('keydown', (e) => this.manejarKeydown(e, index));
            input.addEventListener('paste', (e) => this.manejarPaste(e));
        });
        // Enfocar el primer input
        this.inputs[0].focus();
    }
    manejarInput(e, index) {
        const input = e.target;
        const valor = input.value;
        // Solo permitir números
        if (!/^\d*$/.test(valor)) {
            input.value = '';
            return;
        }
        // Remover clase de error si existe
        input.classList.remove('error');
        // Mover al siguiente input si hay valor
        if (valor && index < this.inputs.length - 1) {
            this.inputs[index + 1].focus();
        }
    }
    manejarKeydown(e, index) {
        const input = e.target;
        // Retroceso: mover al input anterior
        if (e.key === 'Backspace' && !input.value && index > 0) {
            this.inputs[index - 1].focus();
        }
        // Flecha izquierda
        if (e.key === 'ArrowLeft' && index > 0) {
            this.inputs[index - 1].focus();
        }
        // Flecha derecha
        if (e.key === 'ArrowRight' && index < this.inputs.length - 1) {
            this.inputs[index + 1].focus();
        }
    }
    manejarPaste(e) {
        var _a;
        e.preventDefault();
        const pasteData = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text');
        if (!pasteData)
            return;
        const codigo = pasteData.replace(/\D/g, '').slice(0, 6);
        codigo.split('').forEach((digito, index) => {
            if (index < this.inputs.length) {
                this.inputs[index].value = digito;
            }
        });
        // Enfocar el último input con valor o el último disponible
        const ultimoIndex = Math.min(codigo.length, this.inputs.length - 1);
        this.inputs[ultimoIndex].focus();
    }
    configurarFormulario() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.verificarCodigo();
        });
    }
    configurarReenvio() {
        this.btnReenviar.addEventListener('click', () => {
            this.reenviarCodigo();
        });
    }
    obtenerCodigoIngresado() {
        let codigo = '';
        this.inputs.forEach(input => {
            codigo += input.value;
        });
        return codigo;
    }
    verificarCodigo() {
        const codigoIngresado = this.obtenerCodigoIngresado();
        if (codigoIngresado.length !== 6) {
            notifications.error('Por favor, ingresa el código completo');
            this.marcarInputsComoError();
            return;
        }
        const usuarioPendiente = this.obtenerUsuarioPendiente();
        if (!usuarioPendiente) {
            notifications.error('No se encontró información de verificación');
            return;
        }
        // Verificar si el código expiró
        const ahora = new Date();
        const fechaExpiracion = new Date(usuarioPendiente.fechaExpiracionCodigo);
        if (ahora > fechaExpiracion) {
            notifications.error('El código ha expirado. Por favor, solicita uno nuevo');
            this.marcarInputsComoError();
            return;
        }
        // Verificar el código
        if (codigoIngresado === usuarioPendiente.codigoVerificacion) {
            this.procesarVerificacionExitosa(usuarioPendiente);
        }
        else {
            notifications.error('Código incorrecto. Por favor, verifica e intenta nuevamente');
            this.marcarInputsComoError();
            this.limpiarInputs();
        }
    }
    procesarVerificacionExitosa(usuario) {
        // Marcar como verificado
        usuario.verificado = true;
        delete usuario.codigoVerificacion;
        delete usuario.fechaExpiracionCodigo;
        // Guardar en usuarios verificados
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        usuarios.push(usuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        // Eliminar de usuarios pendientes
        const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes') || '[]');
        const nuevosPendientes = usuariosPendientes.filter((u) => u.email !== usuario.email);
        localStorage.setItem('usuariosPendientes', JSON.stringify(nuevosPendientes));
        // Guardar sesión activa
        const usuarioActivo = {
            id: usuario.email,
            email: usuario.email,
            tipo: usuario.tipo,
            nombre: usuario.nombre,
            nombreEmpresa: usuario.nombreEmpresa,
            ruc: usuario.ruc
        };
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
        // Mostrar notificación de éxito
        notifications.success('¡Cuenta verificada exitosamente!');
        // Obtener la URL base
        const baseUrl = window.location.origin;
        // Redirigir al login después de 2 segundos
        // Redirigir según el tipo de usuario
        setTimeout(() => {
            if (usuario.tipo === 'vendedor') {
                window.location.href = './components/dashboard/dashboard-vendedor.html';
            }
            else {
                window.location.href = './public/index.html';
            }
        }, 2000);
    }
    marcarInputsComoError() {
        this.inputs.forEach(input => {
            input.classList.add('error');
        });
        setTimeout(() => {
            this.inputs.forEach(input => {
                input.classList.remove('error');
            });
        }, 1000);
    }
    limpiarInputs() {
        this.inputs.forEach(input => {
            input.value = '';
        });
        this.inputs[0].focus();
    }
    reenviarCodigo() {
        // Deshabilitar botón temporalmente
        this.btnReenviar.disabled = true;
        const usuarioPendiente = this.obtenerUsuarioPendiente();
        if (!usuarioPendiente) {
            notifications.error('No se encontró información de verificación');
            this.btnReenviar.disabled = false;
            return;
        }
        // Generar nuevo código
        const nuevoCodigoVerificacion = this.generarCodigoVerificacion();
        const fechaExpiracion = new Date();
        fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);
        // Actualizar usuario pendiente
        usuarioPendiente.codigoVerificacion = nuevoCodigoVerificacion;
        usuarioPendiente.fechaExpiracionCodigo = fechaExpiracion.toISOString();
        const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes') || '[]');
        const index = usuariosPendientes.findIndex((u) => u.email === usuarioPendiente.email);
        if (index !== -1) {
            usuariosPendientes[index] = usuarioPendiente;
            localStorage.setItem('usuariosPendientes', JSON.stringify(usuariosPendientes));
        }
        // Simular envío de email (en producción, aquí iría la llamada al servicio de email)
        console.log('Nuevo código de verificación:', nuevoCodigoVerificacion);
        notifications.success('Se ha enviado un nuevo código a tu correo electrónico');
        // Habilitar botón después de 30 segundos
        setTimeout(() => {
            this.btnReenviar.disabled = false;
        }, 30000);
    }
    generarCodigoVerificacion() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new VerificacionPage();
});
//# sourceMappingURL=verificacion.js.map