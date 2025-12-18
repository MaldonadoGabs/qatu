var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Configuración de EmailJS - REEMPLAZA CON TUS CREDENCIALES
const EMAILJS_CONFIG = {
    serviceId: 'service_yrsn71a', // ← Obtener de EmailJS dashboard
    templateId: 'template_gh7u1pp', // ← Obtener de EmailJS dashboard
    publicKey: 'y1Bbn8Vr-JHJyI7rP' // ← Obtener de EmailJS dashboard
};
// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);
export function enviarCodigoVerificacion(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
                to_email: params.to_email,
                to_name: params.nombre,
                codigo: params.codigo,
                from_name: 'Qatu',
                message: `Tu código de verificación es: ${params.codigo}. Este código expirará en 15 minutos.`
            });
            console.log('Email enviado exitosamente:', response);
            return true;
        }
        catch (error) {
            console.error('Error al enviar email:', error);
            return false;
        }
    });
}
export function enviarEmailBienvenida(email, nombre) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield emailjs.send(EMAILJS_CONFIG.serviceId, 'template_bienvenida', {
                to_email: email,
                to_name: nombre,
                from_name: 'Qatu'
            });
            console.log('Email de bienvenida enviado:', response);
            return true;
        }
        catch (error) {
            console.error('Error al enviar email de bienvenida:', error);
            return false;
        }
    });
}
//# sourceMappingURL=emailService.js.map