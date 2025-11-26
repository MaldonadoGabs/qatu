interface EmailVerificationData {
    email: string;
    verificationCode: string;
}
export declare class EmailService {
    private transporter;
    constructor();
    sendVerificationEmail(data: EmailVerificationData): Promise<boolean>;
    sendWelcomeEmail(email: string, nombre: string): Promise<boolean>;
}
export {};
//# sourceMappingURL=emailService.d.ts.map