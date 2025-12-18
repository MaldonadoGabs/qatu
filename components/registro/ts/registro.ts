// Declarar la función de alertas global
declare function mostrarAlerta(titulo: string, mensaje: string, tipo: 'exito' | 'error' | 'info'): void;

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

        // Validaciones
        if (!this.validarFormulario(email, password, confirmPassword, nombre)) {
            return;
        }

        // Verificar si el email ya existe
        if (this.emailYaRegistrado(email)) {
            mostrarAlerta(
                'Email ya registrado',
                'Este correo electrónico ya está registrado. Por favor, inicia sesión.',
                'error'
            );
            return;
        }

        // Generar código de verificación
        const codigoVerificacion = this.generarCodigoVerificacion();
        const fechaExpiracion = new Date();
        fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

        // Crear usuario pendiente
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

        this.guardarYRedirigir(usuarioPendiente, codigoVerificacion, email);
    }

    private async procesarRegistroVendedor(): Promise<void> {
        const formData = new FormData(this.formVendedor);
        
        const nombreEmpresa = formData.get('nombre-empresa') as string;
        const email = formData.get('email-vendedor') as string;
        const password = formData.get('password-vendedor') as string;
        const confirmPassword = formData.get('confirm-password-vendedor') as string;

        // Validaciones
        if (!this.validarFormulario(email, password, confirmPassword, nombreEmpresa)) {
            return;
        }

        // Verificar si el email ya existe
        if (this.emailYaRegistrado(email)) {
            mostrarAlerta(
                'Email ya registrado',
                'Este correo electrónico ya está registrado. Por favor, inicia sesión.',
                'error'
            );
            return;
        }

        // Generar código de verificación
        const codigoVerificacion = this.generarCodigoVerificacion();
        const fechaExpiracion = new Date();
        fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

        // Crear usuario pendiente
        const usuarioPendiente: UsuarioPendiente = {
            email: email,
            password: password,
            tipo: 'vendedor',
            nombreEmpresa: nombreEmpresa,
            verificado: false,
            codigoVerificacion: codigoVerificacion,
            fechaExpiracionCodigo: fechaExpiracion.toISOString()
        };

        this.guardarYRedirigir(usuarioPendiente, codigoVerificacion, email);
    }

    private guardarYRedirigir(usuario: UsuarioPendiente, codigo: string, email: string): void {
        // Guardar en localStorage
        this.guardarUsuarioPendiente(usuario);

        try {
            console.log('Código de verificación:', codigo);
            console.log('Email destinatario:', email);
            
            mostrarAlerta(
                '¡Registro exitoso!',
                'Se ha enviado un código de verificación a tu correo electrónico. Revisa tu bandeja de entrada.',
                'exito'
            );
            
            // Redirigir a página de verificación
            setTimeout(() => {
                window.location.href = '/components/verificacion/verificacion.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error al enviar email:', error);
            mostrarAlerta(
                'Error al enviar código',
                'No se pudo enviar el código de verificación. Por favor, intenta nuevamente.',
                'error'
            );
        }
    }

    private validarFormulario(email: string, password: string, confirmPassword: string, nombre: string): boolean {
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarAlerta(
                'Email inválido',
                'Por favor, ingresa un correo electrónico válido.',
                'error'
            );
            return false;
        }

        // Validar nombre
        if (!nombre || nombre.trim().length < 3) {
            mostrarAlerta(
                'Nombre muy corto',
                'El nombre debe tener al menos 3 caracteres.',
                'error'
            );
            return false;
        }

        // Validar contraseña
        if (password.length < 8) {
            mostrarAlerta(
                'Contraseña débil',
                'La contraseña debe tener al menos 8 caracteres para mayor seguridad.',
                'error'
            );
            return false;
        }

        // Validar confirmación de contraseña
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

export {};