// Declarar la función de alertas global
declare function mostrarAlerta(titulo: string, mensaje: string, tipo: 'exito' | 'error' | 'info'): void;

import { enviarCodigoVerificacion } from '../../services/emailService.js';

interface UsuarioPendiente {
    email: string;
    password: string;
    tipo: 'comprador' | 'vendedor';
    nombre?: string;
    apellido?: string;
    nombreEmpresa?: string;
    verificado: boolean;
    codigoVerificacion: string;
    fechaExpiracionCodigo: string;
}

class VerificacionPage {
    private form: HTMLFormElement;
    private inputs: NodeListOf<HTMLInputElement>;
    private btnReenviar: HTMLButtonElement;

    constructor() {
        this.form = document.getElementById('form-verificacion') as HTMLFormElement;
        this.inputs = document.querySelectorAll('.codigo-input');
        this.btnReenviar = document.getElementById('btn-reenviar') as HTMLButtonElement;

        if (!this.form || !this.inputs.length) {
            console.error('No se encontraron los elementos necesarios');
            return;
        }

        this.init();
    }

    private init(): void {
        this.configurarInputs();
        this.configurarFormulario();
        this.configurarReenvio();
        
        // Enfocar el primer input
        this.inputs[0]?.focus();
    }

    private configurarInputs(): void {
        this.inputs.forEach((input, index) => {
            // Permitir solo números
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, '');

                // Auto-focus al siguiente input
                if (target.value && index < this.inputs.length - 1) {
                    this.inputs[index + 1].focus();
                }
            });

            // Manejar backspace
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    this.inputs[index - 1].focus();
                }
            });

            // Manejar paste
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = e.clipboardData?.getData('text');
                if (pastedData && /^\d{6}$/.test(pastedData)) {
                    pastedData.split('').forEach((char, i) => {
                        if (this.inputs[i]) {
                            this.inputs[i].value = char;
                        }
                    });
                    this.inputs[5]?.focus();
                }
            });
        });
    }

    private configurarFormulario(): void {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.verificarCodigo();
        });
    }

    private configurarReenvio(): void {
        this.btnReenviar.addEventListener('click', () => {
            this.reenviarCodigo();
        });
    }

    private verificarCodigo(): void {
        const codigo = Array.from(this.inputs)
            .map(input => input.value)
            .join('');

        if (codigo.length !== 6) {
            mostrarAlerta(
                'Código incompleto',
                'Por favor, ingresa los 6 dígitos del código.',
                'error'
            );
            return;
        }

        // Obtener usuario pendiente
        const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes') || '[]');
        const usuarioIndex = usuariosPendientes.findIndex((u: UsuarioPendiente) => 
            u.codigoVerificacion === codigo && !u.verificado
        );

        if (usuarioIndex === -1) {
            mostrarAlerta(
                'Código inválido',
                'El código ingresado es incorrecto o ha expirado.',
                'error'
            );
            this.limpiarInputs();
            return;
        }

        const usuario = usuariosPendientes[usuarioIndex];

        // Verificar expiración
        const fechaExpiracion = new Date(usuario.fechaExpiracionCodigo);
        if (new Date() > fechaExpiracion) {
            mostrarAlerta(
                'Código expirado',
                'El código ha expirado. Por favor, solicita uno nuevo.',
                'error'
            );
            this.limpiarInputs();
            return;
        }

        // Mover usuario a la lista de verificados
        usuario.verificado = true;
        usuariosPendientes.splice(usuarioIndex, 1);
        
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        usuarios.push(usuario);
        
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuariosPendientes', JSON.stringify(usuariosPendientes));
        localStorage.setItem('usuarioActivo', JSON.stringify(usuario));

        mostrarAlerta(
            '¡Verificación exitosa!',
            'Tu cuenta ha sido verificada correctamente. Redirigiendo...',
            'exito'
        );

        // Redirigir según tipo de usuario
        setTimeout(() => {
            if (usuario.tipo === 'vendedor') {
                window.location.href = '/components/dashboard/dashboard-vendedor.html';
            } else {
                window.location.href = '/index.html';
            }
        }, 2000);
    }

    private async reenviarCodigo(): Promise<void> {
        const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes') || '[]');
        
        if (usuariosPendientes.length === 0) {
            mostrarAlerta(
                'Sin usuarios pendientes',
                'No hay ninguna cuenta pendiente de verificación.',
                'error'
            );
            return;
        }

        // Tomar el último usuario pendiente
        const usuario = usuariosPendientes[usuariosPendientes.length - 1];

        // Generar nuevo código
        const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
        const fechaExpiracion = new Date();
        fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

        usuario.codigoVerificacion = nuevoCodigo;
        usuario.fechaExpiracionCodigo = fechaExpiracion.toISOString();

        localStorage.setItem('usuariosPendientes', JSON.stringify(usuariosPendientes));

        // Mostrar alerta de envío
        mostrarAlerta(
            'Reenviando código...',
            'Por favor espera mientras enviamos el nuevo código a tu correo.',
            'info'
        );

        try {
            // Enviar email con EmailJS
            const nombreCompleto = usuario.nombre 
                ? `${usuario.nombre} ${usuario.apellido || ''}`.trim() 
                : usuario.nombreEmpresa || 'Usuario';

            const emailEnviado = await enviarCodigoVerificacion({
                to_email: usuario.email,
                nombre: nombreCompleto,
                codigo: nuevoCodigo
            });

            if (emailEnviado) {
                console.log('✅ Nuevo código enviado exitosamente');
                console.log('📧 Email:', usuario.email);
                console.log('🔢 Código:', nuevoCodigo);
                
                mostrarAlerta(
                    '✅ Código reenviado',
                    'Se ha enviado un nuevo código de verificación a tu correo electrónico. Por favor revisa tu bandeja de entrada (y spam).',
                    'exito'
                );
            } else {
                throw new Error('No se pudo enviar el email');
            }
        } catch (error) {
            console.error('❌ Error al reenviar código:', error);
            console.log('🔢 Código temporal (usar en consola):', nuevoCodigo);
            
            mostrarAlerta(
                'Error al enviar email',
                `No se pudo enviar el código por correo electrónico.\n\nTu código temporal es:\n\n${nuevoCodigo}\n\n(También puedes verlo en la consola del navegador)`,
                'error'
            );
        }

        this.limpiarInputs();
    }

    private limpiarInputs(): void {
        this.inputs.forEach(input => {
            input.value = '';
        });
        this.inputs[0]?.focus();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new VerificacionPage();
});

export {};