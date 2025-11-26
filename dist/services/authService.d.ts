export declare class AuthService {
    private secretKey;
    /**
     * Hashear contraseña con SHA256
     */
    hashPassword(password: string): string;
    /**
     * Verificar si la contraseña coincide con el hash
     */
    verifyPassword(password: string, hashedPassword: string): boolean;
    /**
     * Registrar nuevo usuario
     */
    registrarUsuario(datosUsuario: any): {
        success: boolean;
        message: string;
    };
    /**
     * Iniciar sesión
     */
    login(email: string, password: string): {
        success: boolean;
        message: string;
        usuario?: any;
    };
    /**
     * Cerrar sesión
     */
    logout(): void;
    /**
     * Obtener usuario actual
     */
    obtenerUsuarioActual(): any | null;
    /**
     * Verificar si hay sesión activa
     */
    estaAutenticado(): boolean;
    /**
     * Obtener usuarios desde storage encriptado
     */
    private obtenerUsuarios;
    /**
     * Guardar usuarios en storage encriptado
     */
    private guardarUsuarios;
    /**
     * Cambiar contraseña
     */
    cambiarPassword(email: string, passwordActual: string, passwordNuevo: string): {
        success: boolean;
        message: string;
    };
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map