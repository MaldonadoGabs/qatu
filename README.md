# qatu
Qatu - Ecommerce

# 🧪 GUÍA DE PRUEBA 1 Sprint - Sistema de Autenticación Qatu

## 📋 Estructura de Archivos

```
proyecto-qatu/
├── index.html          ← Dashboard principal (público y privado)
├── login.html          ← Inicio de sesión
├── registro.html       ← Registro de usuarios
├── verificacion.html   ← Verificación de código
├── style.css           ← Estilos del dashboard
├── auth.css            ← Estilos de autenticación
├── app.js              ← Lógica de autenticación
├── dashboard.js        ← Lógica del carrusel
└── assets/
    ├── qatu (1).png
    ├── qatu-_1_.svg
    ├── qatu-Photoroom.png
    ├── qatu.png
    └── qatu.svg
```

## 🔄 Flujo de Usuario

### 1️⃣ PRIMERA VISITA (Usuario NO logueado)
**Página: `index.html`**
- ✅ Debe mostrar el botón "Iniciar Sesión" en el header
- ✅ NO debe mostrar información de usuario
- ✅ El carrusel de productos debe funcionar
- ✅ Al hacer clic en "Iniciar Sesión" → redirige a `login.html`

### 2️⃣ PROCESO DE REGISTRO
**Página: `registro.html`**

**Paso 1: Llenar formulario**
- Nombre completo
- Email
- Contraseña (mínimo 6 caracteres)
- Confirmar contraseña
- Tipo de usuario: Comprador / Vendedor / Administrador

**Paso 2: Enviar formulario**
- ✅ Notificación verde: "Registro exitoso. Código de verificación: XXXXXX"
- ✅ La notificación permanece 5 segundos
- ✅ Después de 5 segundos → redirige a `verificacion.html`

### 3️⃣ VERIFICACIÓN DE CUENTA
**Página: `verificacion.html`**

**Escenario A: Código Correcto**
- Ingresar el código de 6 dígitos
- ✅ Notificación verde: "¡Verificación exitosa! Redirigiendo al login..."
- ✅ Después de 2 segundos → redirige a `login.html`

**Escenario B: Código Incorrecto**
- Ingresar código erróneo
- ❌ Notificación roja: "Código de verificación incorrecto"
- ✅ **PERMANECE en la página** para reintentar

**Opción: Reenviar código**
- Hacer clic en "Reenviar código"
- ✅ Notificación azul con nuevo código (5 segundos)

### 4️⃣ INICIO DE SESIÓN
**Página: `login.html`**

**Escenario A: Usuario Verificado**
- Ingresar email y contraseña
- ✅ Notificación verde: "¡Bienvenido de nuevo!"
- ✅ Redirige a `index.html` con sesión activa

**Escenario B: Usuario NO Verificado**
- ✅ Notificación azul con código de verificación
- ✅ Redirige a `verificacion.html`

### 5️⃣ DASHBOARD CON SESIÓN ACTIVA
**Página: `index.html` (logueado)**

**Debe mostrar:**
- ✅ Header con: "Hola, **[Nombre del Usuario]**"
- ✅ Botón "Cerrar Sesión" (reemplaza "Iniciar Sesión")
- ✅ El botón original "Iniciar Sesión" está OCULTO
- ✅ Carrusel de productos funcional

**Al hacer clic en "Cerrar Sesión":**
- ✅ Notificación: "Sesión cerrada exitosamente"
- ✅ Vuelve al estado inicial (sin usuario)
- ✅ Muestra botón "Iniciar Sesión" nuevamente

## 🐛 Solución de Problemas

### Problema: "No aparece mi nombre en el dashboard"
**Solución:**
1. Abre la consola del navegador (F12)
2. Verifica que aparezca: "Usuario logueado detectado: [tu nombre]"
3. Si no aparece, revisa localStorage:
   ```javascript
   console.log(localStorage.getItem('qatu_current_user'));
   ```

### Problema: "Los datos no persisten al recargar"
**Causa:** localStorage puede estar deshabilitado
**Solución temporal:** No recargar la página durante las pruebas

### Problema: "Aparece usuario anterior"
**Solución:** Limpiar localStorage
```javascript
// En la consola del navegador:
localStorage.clear();
location.reload();
```

## 📊 Datos de Prueba

### Usuario de Ejemplo
```
Nombre: Juan Pérez
Email: juan@example.com
Contraseña: 123456
Rol: Comprador
```

## 🔍 Verificaciones en Consola

**Para ver usuarios registrados:**
```javascript
JSON.parse(localStorage.getItem('qatu_users'));
```

**Para ver usuario actual:**
```javascript
JSON.parse(localStorage.getItem('qatu_current_user'));
```

**Para simular logout manual:**
```javascript
localStorage.setItem('qatu_current_user', null);
location.reload();
```

## ✅ Checklist de Pruebas

- [ ] Registro con contraseñas que no coinciden → Error
- [ ] Registro con contraseña menor a 6 caracteres → Error
- [ ] Registro con email duplicado → Error
- [ ] Registro exitoso → Código visible 5 segundos
- [ ] Verificación con código correcto → Redirige a login
- [ ] Verificación con código incorrecto → Permanece en página
- [ ] Login con credenciales incorrectas → Error
- [ ] Login con usuario no verificado → Pide verificación
- [ ] Login exitoso → Dashboard con nombre de usuario
- [ ] Cerrar sesión → Vuelve a estado inicial
- [ ] Recargar página con sesión activa → Mantiene sesión
- [ ] Carrusel funciona en todas las vistas
- [ ] Notificaciones se muestran correctamente
- [ ] Diseño responsive en móvil

## 🎨 Estilos Aplicados

- **Dashboard (index.html):** Tema rojo (#E43636)
- **Autenticación (login, registro, verificación):** Tema azul-morado degradado
- **Notificaciones:**
  - Verde: Éxito
  - Rojo: Error
  - Azul: Información

## 📝 Notas Importantes

1. **localStorage** se usa para persistencia básica
2. En producción se debe usar una **base de datos real**
3. Las **contraseñas deben hashearse** en producción
4. Los **códigos de verificación** deben enviarse por email
5. El **orden de los scripts** es importante: app.js antes que dashboard.js