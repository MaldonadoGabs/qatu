// Declarar la función de alertas global
declare function mostrarAlerta(titulo: string, mensaje: string, tipo: 'exito' | 'error' | 'info'): void;

// Importar servicio de email
import { enviarCodigoVerificacion } from '../../services/emailService.js';

interface UsuarioPendiente {
    email: string;
    password: string;
    tipo: 'comprador' | 'vendedor';
    nombre?: string;
    apellido?: string;
    nombreEmpresa?: string;
    ruc?: string;
    telefono?: string;
    direccion?: string;
    verificado: boolean;
    codigoVerificacion: string;
    fechaExpiracionCodigo: string;
}

class RegistroPage {
    private formComprador: HTMLFormElement;
    private formVendedor: HTMLFormElement;
    private tipoUsuario: 'comprador' | 'vendedor' = 'comprador';
    private btnComprador: HTMLButtonElement;
    private btnVendedor: HTMLButtonElement;

    constructor() {
        this.formComprador = document.getElementById('form-comprador') as HTMLFormElement;
        this.formVendedor = document.getElementById('form-vendedor') as HTMLFormElement;
        this.btnComprador = document.getElementById('btn-comprador') as HTMLButtonElement;
        this.btnVendedor = document.getElementById('btn-vendedor') as HTMLButtonElement;
        
        if (!this.formComprador || !this.formVendedor) {
            console.error('No se encontraron los formularios');
            return;
        }
        
        this.init();
    }

    private init(): void {
        this.configurarTipoUsuario();
        this.configurarFormularios();
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
            this.formComprador.style.display = 'block';
            this.formVendedor.style.display = 'none';
        } else {
            this.btnVendedor.classList.add('active');
            this.btnComprador.classList.remove('active');
            this.formVendedor.style.display = 'block';
            this.formComprador.style.display = 'none';
        }
    }

    private configurarFormularios(): void {
        this.formComprador.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRegistroComprador();
        });

        this.formVendedor.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRegistroVendedor();
        });
    }

    private async procesarRegistroComprador(): Promise<void> {
        const formData = new FormData(this.formComprador);
        
        const nombre = formData.get('nombre') as string;
        const apellido = formData.get('apellido') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm-password') as string;

        if (!this.validarFormulario(email, password, confirmPassword, nombre)) {
            return;
        }

        if (this.emailYaRegistrado(email)) {
            mostrarAlerta(
                'Email ya registrado',
                'Este correo electrónico ya está registrado. Por favor, inicia sesión.',
                'error'
            );
            return;
        }

        const codigoVerificacion = this.generarCodigoVerificacion();
        const fechaExpiracion = new Date();
        fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

        const usuarioPendiente: UsuarioPendiente = {
            email: email,
            password: password,
            tipo: 'comprador',
            nombre: nombre,
            apellido: apellido,
            verificado: false,
            codigoVerificacion: codigoVerificacion,
            fechaExpiracionCodigo: fechaExpiracion.toISOString()
        };

        await this.guardarYRedirigir(usuarioPendiente, codigoVerificacion, email, `${nombre} ${apellido}`);
    }

    private async procesarRegistroVendedor(): Promise<void> {
        const formData = new FormData(this.formVendedor);
        
        const nombreEmpresa = formData.get('nombre-empresa') as string;
        const email = formData.get('email-vendedor') as string;
        const password = formData.get('password-vendedor') as string;
        const confirmPassword = formData.get('confirm-password-vendedor') as string;

        if (!this.validarFormulario(email, password, confirmPassword, nombreEmpresa)) {
            return;
        }

        if (this.emailYaRegistrado(email)) {
            mostrarAlerta(
                'Email ya registrado',
                'Este correo electrónico ya está registrado. Por favor, inicia sesión.',
                'error'
            );
            return;
        }

        const codigoVerificacion = this.generarCodigoVerificacion();
        const fechaExpiracion = new Date();
        fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

        const usuarioPendiente: UsuarioPendiente = {
            email: email,
            password: password,
            tipo: 'vendedor',
            nombreEmpresa: nombreEmpresa,
            verificado: false,
            codigoVerificacion: codigoVerificacion,
            fechaExpiracionCodigo: fechaExpiracion.toISOString()
        };

        await this.guardarYRedirigir(usuarioPendiente, codigoVerificacion, email, nombreEmpresa);
    }

    private async guardarYRedirigir(usuario: UsuarioPendiente, codigo: string, email: string, nombre: string): Promise<void> {
        // Guardar SIEMPRE primero
        this.guardarUsuarioPendiente(usuario);

        // Mostrar mensaje de envío
        mostrarAlerta(
            'Enviando código...',
            'Por favor espera mientras enviamos el código de verificación a tu correo.',
            'info'
        );

        let emailEnviado = false;

        try {
            // Intentar enviar email con EmailJS
            emailEnviado = await enviarCodigoVerificacion({
                to_email: email,
                nombre: nombre,
                codigo: codigo
            });

            if (emailEnviado) {
                console.log('✅ Código enviado exitosamente al email:', email);
                
                mostrarAlerta(
                    '¡Registro exitoso!',
                    'Se ha enviado un código de verificación a tu correo electrónico. Por favor revisa tu bandeja de entrada (y spam).',
                    'exito'
                );
            } else {
                throw new Error('No se pudo enviar el email');
            }
            
        } catch (error) {
            console.error('❌ Error al enviar email:', error);
            console.log('🔢 Código de verificación (usar en consola):', codigo);
            
            mostrarAlerta(
                'Código generado',
                `No se pudo enviar el email, pero tu registro fue exitoso.\n\nTu código de verificación es:\n\n${codigo}\n\n(También puedes verlo en la consola del navegador)`,
                'error'
            );
        }

        // SIEMPRE redirigir después de 3 segundos, sin importar si el email se envió o no
        setTimeout(() => {
            window.location.href = '/components/verificacion/verificacion.html';
        }, 3000);
    }

    private validarFormulario(email: string, password: string, confirmPassword: string, nombre: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarAlerta(
                'Email inválido',
                'Por favor, ingresa un correo electrónico válido.',
                'error'
            );
            return false;
        }

        if (!nombre || nombre.trim().length < 3) {
            mostrarAlerta(
                'Nombre muy corto',
                'El nombre debe tener al menos 3 caracteres.',
                'error'
            );
            return false;
        }

        if (password.length < 8) {
            mostrarAlerta(
                'Contraseña débil',
                'La contraseña debe tener al menos 8 caracteres para mayor seguridad.',
                'error'
            );
            return false;
        }

        if (password !== confirmPassword) {
            mostrarAlerta(
                'Contraseñas no coinciden',
                'Las contraseñas ingresadas no son iguales. Por favor, verifícalas.',
                'error'
            );
            return false;
        }

        return true;
    }

    private emailYaRegistrado(email: string): boolean {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const existeVerificado = usuarios.some((u: any) => u.email === email);

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

document.addEventListener('DOMContentLoaded', () => {
    new RegistroPage();
});

export {};