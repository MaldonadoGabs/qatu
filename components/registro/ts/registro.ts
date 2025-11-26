import { notifications } from '../../shared/notifications.js';

interface UsuarioPendiente {
    email: string;
    password: string;
    tipo: 'comprador' | 'vendedor';
    nombre?: string;
    nombreEmpresa?: string;
    ruc?: string;
    telefono?: string;
    direccion?: string;
    verificado: boolean;
    codigoVerificacion: string;
    fechaExpiracionCodigo: string;
}

class RegistroPage {
    private form: HTMLFormElement;
    private tipoUsuario: 'comprador' | 'vendedor' = 'comprador';
    private btnComprador: HTMLButtonElement;
    private btnVendedor: HTMLButtonElement;

    constructor() {
        this.form = document.getElementById('registro-form') as HTMLFormElement;
        this.btnComprador = document.getElementById('btn-comprador') as HTMLButtonElement;
        this.btnVendedor = document.getElementById('btn-vendedor') as HTMLButtonElement;
        
        this.init();
    }

    private init(): void {
        this.configurarTipoUsuario();
        this.configurarFormulario();
    }

    private configurarTipoUsuario(): void {
        this.btnComprador.addEventListener('click', () => {
            this.cambiarTipoUsuario('comprador');
        });

        this.btnVendedor.addEventListener('click', () => {
            this.cambiarTipoUsuario('vendedor');
        });
    }

    private cambiarTipoUsuario(tipo: 'comprador' | 'vendedor'): void {
        this.tipoUsuario = tipo;

        if (tipo === 'comprador') {
            this.btnComprador.classList.add('active');
            this.btnVendedor.classList.remove('active');
        } else {
            this.btnVendedor.classList.add('active');
            this.btnComprador.classList.remove('active');
        }

        this.actualizarFormulario();
    }

    private actualizarFormulario(): void {
        // Implementar lógica para mostrar/ocultar campos según tipo de usuario
        // Por ahora solo cambiaremos el placeholder del nombre
        const nombreInput = document.getElementById('nombre') as HTMLInputElement;
        if (nombreInput) {
            if (this.tipoUsuario === 'vendedor') {
                nombreInput.placeholder = 'Nombre de la empresa';
            } else {
                nombreInput.placeholder = 'Nombre completo';
            }
        }
    }

    private configurarFormulario(): void {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRegistro();
        });
    }

    private async procesarRegistro(): Promise<void> {
        const formData = new FormData(this.form);
        
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm-password') as string;
        const nombre = formData.get('nombre') as string;

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
        const usuarioPendiente: UsuarioPendiente = {
            email: email,
            password: password, // En producción, esto debería hashearse antes de guardar
            tipo: this.tipoUsuario,
            verificado: false,
            codigoVerificacion: codigoVerificacion,
            fechaExpiracionCodigo: fechaExpiracion.toISOString()
        };

        if (this.tipoUsuario === 'comprador') {
            usuarioPendiente.nombre = nombre;
        } else {
            usuarioPendiente.nombreEmpresa = nombre;
            usuarioPendiente.ruc = formData.get('ruc') as string;
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
        } catch (error) {
            console.error('Error al enviar email:', error);
            notifications.error('No se pudo enviar el código de verificación. Intenta nuevamente.');
            return;
        }

        // Redirigir a página de verificación después de 2 segundos
        setTimeout(() => {
            window.location.href = '/componentes/verificacion/verificacion.html';
        }, 2000);
    }

    private validarFormulario(email: string, password: string, confirmPassword: string, nombre: string): boolean {
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

    private emailYaRegistrado(email: string): boolean {
        // Verificar en usuarios verificados
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const existeVerificado = usuarios.some((u: any) => u.email === email);

        // Verificar en usuarios pendientes
        const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes') || '[]');
        const existePendiente = usuariosPendientes.some((u: any) => u.email === email);

        return existeVerificado || existePendiente;
    }

    private guardarUsuarioPendiente(usuario: UsuarioPendiente): void {
        const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes') || '[]');
        usuariosPendientes.push(usuario);
        localStorage.setItem('usuariosPendientes', JSON.stringify(usuariosPendientes));
    }

    private generarCodigoVerificacion(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RegistroPage();
});