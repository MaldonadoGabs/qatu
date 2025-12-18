import emailjs from '@emailjs/browser';

// Configuración de EmailJS - REEMPLAZA CON TUS CREDENCIALES
const EMAILJS_CONFIG = {
    serviceId: 'service_yrsn71a',      // ← Obtener de EmailJS dashboard
    templateId: 'template_gh7u1pp',    // ← Obtener de EmailJS dashboard
    publicKey: 'y1Bbn8Vr-JHJyI7rP'       // ← Obtener de EmailJS dashboard
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

export interface EmailParams {
    to_email: string;
    nombre: string;
    codigo: string;
}

export async function enviarCodigoVerificacion(params: EmailParams): Promise<boolean> {
    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                to_email: params.to_email,
                to_name: params.nombre,
                codigo: params.codigo,
                from_name: 'Qatu',
                message: `Tu código de verificación es: ${params.codigo}. Este código expirará en 15 minutos.`
            }
        );

        console.log('Email enviado exitosamente:', response);
        return true;
    } catch (error) {
        console.error('Error al enviar email:', error);
        return false;
    }
}

export async function enviarEmailBienvenida(email: string, nombre: string): Promise<boolean> {
    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            'template_bienvenida',
            {
                to_email: email,
                to_name: nombre,
                from_name: 'Qatu'
            }
        );

        console.log('Email de bienvenida enviado:', response);
        return true;
    } catch (error) {
        console.error('Error al enviar email de bienvenida:', error);
        return false;
    }
}