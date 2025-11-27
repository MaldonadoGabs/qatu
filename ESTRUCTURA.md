# Estructura del Proyecto Qatu

## 📁 Estructura de Carpetas

```
qatu/
├── index.html                 # Página principal (dashboard de compradores)
├── package.json              # Configuración de npm
├── tsconfig.json            # Configuración de TypeScript
├── README.md                # Documentación del proyecto
├── ESTRUCTURA.md            # Este archivo
│
├── src/                     # Código fuente
│   ├── pages/              # Páginas HTML de la aplicación
│   │   ├── login.html
│   │   ├── registro.html
│   │   └── dashboard-vendedor.html
│   │
│   ├── scripts/            # Archivos TypeScript
│   │   ├── dashboard.ts
│   │   ├── dashboard-vendedor.ts
│   │   ├── login.ts
│   │   └── registro.ts
│   │
│   ├── styles/             # Hojas de estilo CSS
│   │   ├── style.css
│   │   ├── login.css
│   │   ├── registro.css
│   │   └── dashboard-vendedor.css
│   │
│   └── types/              # Tipos TypeScript personalizados
│
├── public/                 # Recursos estáticos
│   ├── images/            # Imágenes y logotipos
│   │   ├── logo-qatu-rojo.png
│   │   ├── logo-qatu-blanco.png
│   │   ├── isotipo-qatu-rojo.png
│   │   ├── isotipo-qatu-blanco.png
│   │   ├── isotipo-qatu-svg.svg
│   │   └── logotipo-qatu.svg
│   │
│   └── icons/             # Iconos SVG
│       ├── flecha-volver.svg
│       └── persona-cuenta.svg
│
└── dist/                  # Archivos compilados (generados)
    ├── dashboard.js
    ├── dashboard-vendedor.js
    ├── login.js
    └── registro.js
```

## 📝 Descripción de Carpetas

### `/src` - Código Fuente
Contiene todo el código fuente del proyecto organizado por tipo de archivo.

- **`/pages`**: Contiene las páginas HTML secundarias. El `index.html` permanece en la raíz como punto de entrada principal.

- **`/scripts`**: Archivos TypeScript que contienen la lógica de la aplicación. Se compilan a JavaScript en la carpeta `dist/`.

- **`/styles`**: Hojas de estilo CSS organizadas por página o componente.

- **`/types`**: (Opcional) Definiciones de tipos TypeScript personalizados o interfaces compartidas.

### `/public` - Recursos Estáticos
Contiene todos los archivos estáticos que no requieren procesamiento.

- **`/images`**: Logotipos, imágenes de marca y recursos visuales.

- **`/icons`**: Iconos SVG utilizados en la interfaz.

### `/dist` - Distribución
Carpeta generada automáticamente por el compilador de TypeScript. Contiene los archivos JavaScript compilados listos para producción.

**⚠️ No editar manualmente - Se genera automáticamente**

## 🔧 Compilación de TypeScript

Para compilar los archivos TypeScript:

```bash
# Compilar una vez
npx tsc

# Compilar y observar cambios
npx tsc --watch
```

## 🚀 Buenas Prácticas Implementadas

1. **Separación de Responsabilidades**: Código fuente, estilos y recursos estáticos en carpetas separadas.

2. **Organización Clara**: Estructura intuitiva que facilita encontrar archivos.

3. **Build Separado**: Los archivos compilados se mantienen en `dist/` separados del código fuente.

4. **Recursos Públicos**: Imágenes e iconos organizados por tipo en `public/`.

5. **Configuración Centralizada**: `tsconfig.json` configurado con las rutas correctas (`rootDir` y `outDir`).

6. **Versionamiento Limpio**: `.gitignore` actualizado para excluir archivos generados y dependencias.

## 📌 Rutas de Importación

### Desde `index.html` (raíz):
```html
<link rel="stylesheet" href="./src/styles/style.css" />
<script type="module" src="./dist/dashboard.js" defer></script>
<img src="./public/images/logo-qatu-rojo.png" />
```

### Desde páginas en `src/pages/`:
```html
<link rel="stylesheet" href="../styles/login.css" />
<script type="module" src="../../dist/login.js" defer></script>
<img src="../../public/images/logo-qatu-rojo.png" />
<img src="../../public/icons/flecha-volver.svg" />
```

## 🔄 Migración Completada

- ✅ Archivos HTML organizados
- ✅ CSS movido a `src/styles/`
- ✅ TypeScript movido a `src/scripts/`
- ✅ Assets reorganizados en `public/`
- ✅ Rutas actualizadas en todos los archivos
- ✅ TypeScript configurado correctamente
- ✅ `.gitignore` actualizado
