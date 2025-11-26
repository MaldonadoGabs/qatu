var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*import nodemailer from 'nodemailer';*/
import * as nodemailer from 'nodemailer';
export class EmailService {
    constructor() {
        // Configurar con un servicio real como SendGrid, Mailgun, etc.
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    sendVerificationEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: '"Qatu Ecommerce" <noreply@qatu.com>',
                    to: data.email,
                    subject: 'Verifica tu correo electrónico - Qatu',
                    html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #e63946;">Bienvenido a Qatu</h2>
                        <p>Por favor, verifica tu correo electrónico usando el siguiente código:</p>
                        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
                            <strong>${data.verificationCode}</strong>
                        </div>
                        <p style="color: #666;">Este código expira en 15 minutos.</p>
                        <p style="color: #666;">Si no solicitaste este registro, puedes ignorar este correo.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #999; text-align: center;">© 2024 Qatu Ecommerce. Todos los derechos reservados.</p>
                    </div>
                `
                };
                yield this.transporter.sendMail(mailOptions);
                console.log('Email enviado exitosamente a:', data.email);
                return true;
            }
            catch (error) {
                console.error('Error al enviar email:', error);
                return false;
            }
        });
    }
    sendWelcomeEmail(email, nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: '"Qatu Ecommerce" <noreply@qatu.com>',
                    to: email,
                    subject: '¡Bienvenido a Qatu!',
                    html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #e63946;">¡Hola ${nombre}!</h2>
                        <p>Tu cuenta ha sido verificada exitosamente.</p>
                        <p>Ahora puedes disfrutar de todas las funcionalidades de Qatu.</p>
                        <a href="https://qatu.com" style="display: inline-block; padding: 12px 24px; background-color: #e63946; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Ir a Qatu</a>
                        <p style="color: #666;">¡Gracias por unirte a nosotros!</p>
                    </div>
                `
                };
                yield this.transporter.sendMail(mailOptions);
                return true;
            }
            catch (error) {
                console.error('Error al enviar email de bienvenida:', error);
                return false;
            }
        });
    }
}
//# sourceMappingURL=emailService.js.map