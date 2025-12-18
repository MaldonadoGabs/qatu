export interface EmailParams {
    to_email: string;
    nombre: string;
    codigo: string;
}
export declare function enviarCodigoVerificacion(params: EmailParams): Promise<boolean>;
export declare function enviarEmailBienvenida(email: string, nombre: string): Promise<boolean>;
//# sourceMappingURL=emailService.d.ts.map