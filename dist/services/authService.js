import CryptoJS from 'crypto-js';
export class AuthService {
    constructor() {
        this.secretKey = 'qatu-secret-key-2024'; // En producción, usar variable de entorno
    }
    /**
     * Hashear contraseña con SHA256
     */
    hashPassword(password) {
        return CryptoJS.SHA256(password + this.secretKey).toString();
    }
    /**
     * Verificar si la contraseña coincide con el hash
     */
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }
    /**
     * Registrar nuevo usuario
     */
    registrarUsuario(datosUsuario) {
        try {
            // Validar si el email ya existe
            const usuarios = this.obtenerUsuarios();
            const emailExiste = usuarios.some((u) => u.email === datosUsuario.email);
            if (emailExiste) {
                return { success: false, message: 'El correo electrónico ya está registrado' };
            }
            // Crear nuevo usuario
            const nuevoUsuario = {
                id: Date.now().toString(),
                email: datosUsuario.email,
                passwordHash: this.hashPassword(datosUsuario.password),
                tipo: datosUsuario.tipo,
                nombre: datosUsuario.nombre,
                nombreEmpresa: datosUsuario.nombreEmpresa,
                ruc: datosUsuario.ruc,
                verificado: false,
                fechaRegistro: new Date().toISOString()
            };
            // Guardar en storage encriptado
            usuarios.push(nuevoUsuario);
            this.guardarUsuarios(usuarios);
            return { success: true, message: 'Usuario registrado exitosamente' };
        }
        catch (error) {
            console.error('Error al registrar usuario:', error);
            return { success: false, message: 'Error al registrar usuario' };
        }
    }
    /**
     * Iniciar sesión
     */
    login(email, password) {
        try {
            const usuarios = this.obtenerUsuarios();
            const usuario = usuarios.find((u) => u.email === email);
            // NO revelar si el email existe o no (seguridad)
            if (!usuario) {
                return { success: false, message: 'Credenciales incorrectas' };
            }
            // Verificar si está verificado
            if (!usuario.verificado) {
                return { success: false, message: 'Por favor verifica tu correo electrónico antes de iniciar sesión' };
            }
            // Verificar contraseña
            if (!this.verifyPassword(password, usuario.passwordHash)) {
                return { success: false, message: 'Credenciales incorrectas' };
            }
            // Login exitoso - NO enviar el hash de contraseña
            const usuarioSeguro = {
                id: usuario.id,
                email: usuario.email,
                tipo: usuario.tipo,
                nombre: usuario.nombre,
                nombreEmpresa: usuario.nombreEmpresa,
                ruc: usuario.ruc
            };
            // Guardar sesión
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioSeguro));
            return { success: true, message: 'Inicio de sesión exitoso', usuario: usuarioSeguro };
        }
        catch (error) {
            console.error('Error al iniciar sesión:', error);
            return { success: false, message: 'Error al iniciar sesión' };
        }
    }
    /**
     * Cerrar sesión
     */
    logout() {
        localStorage.removeItem('usuarioActivo');
    }
    /**
     * Obtener usuario actual
     */
    obtenerUsuarioActual() {
        const usuarioActivo = localStorage.getItem('usuarioActivo');
        return usuarioActivo ? JSON.parse(usuarioActivo) : null;
    }
    /**
     * Verificar si hay sesión activa
     */
    estaAutenticado() {
        return this.obtenerUsuarioActual() !== null;
    }
    /**
     * Obtener usuarios desde storage encriptado
     */
    obtenerUsuarios() {
        try {
            const encrypted = localStorage.getItem('usuarios_encrypted');
            if (!encrypted) {
                return [];
            }
            const decrypted = CryptoJS.AES.decrypt(encrypted, this.secretKey).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decrypted);
        }
        catch (error) {
            console.error('Error al obtener usuarios:', error);
            return [];
        }
    }
    /**
     * Guardar usuarios en storage encriptado
     */
    guardarUsuarios(usuarios) {
        try {
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(usuarios), this.secretKey).toString();
            localStorage.setItem('usuarios_encrypted', encrypted);
        }
        catch (error) {
            console.error('Error al guardar usuarios:', error);
        }
    }
    /**
     * Cambiar contraseña
     */
    cambiarPassword(email, passwordActual, passwordNuevo) {
        try {
            const usuarios = this.obtenerUsuarios();
            const index = usuarios.findIndex((u) => u.email === email);
            if (index === -1) {
                return { success: false, message: 'Usuario no encontrado' };
            }
            // Verificar contraseña actual
            if (!this.verifyPassword(passwordActual, usuarios[index].passwordHash)) {
                return { success: false, message: 'Contraseña actual incorrecta' };
            }
            // Actualizar contraseña
            usuarios[index].passwordHash = this.hashPassword(passwordNuevo);
            this.guardarUsuarios(usuarios);
            return { success: true, message: 'Contraseña actualizada exitosamente' };
        }
        catch (error) {
            console.error('Error al cambiar contraseña:', error);
            return { success: false, message: 'Error al cambiar contraseña' };
        }
    }
}
// Exportar instancia única
export const authService = new AuthService();
//# sourceMappingURL=authService.js.map