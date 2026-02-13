# NoporSearch - Matriz de Búsqueda Premium v2

NoporSearch es una herramienta de búsqueda avanzada diseñada para orquestar consultas a través de múltiples proveedores de contenido de forma simultánea. Esta versión cuenta con un rediseño completo de interfaz de usuario (GUI) con una estética futurista "High-End".

![Interfaz Premium](C:\Users\ferna\.gemini\antigravity\brain\9bba8c35-6eab-48f0-9837-32af8bd8f07d\premium_gui_verification_1770993592457.webp)

## ✨ Características Principales

- **Interfaz "Future Tech"**: Diseño moderno con modo oscuro premium, efectos de glassmorphism (vidrio esmerilado) y acentos en azul neón.
- **Matriz de Búsqueda**: Orquesta búsquedas en múltiples sitios simultáneamente con un solo clic.
- **Provider Cloud**: Gestiona tus proveedores de búsqueda de forma dinámica en una cuadrícula optimizada.
- **Selector de Navegador**: Cambia fácilmente entre Chrome, Firefox, Edge, Brave y más, directamente desde la cabecera.
- **Diseño Responsivo**: Interfaz optimizada que elimina barras de desplazamiento innecesarias y maximiza la visibilidad de los nodos activos.

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript + Vite
- **Estándares de Estilo**: Tailwind CSS 4 con utilidades personalizadas de glassmorphism y brillos neón.
- **Core**: Electron (para integración nativa y manejo de ventanas).
- **Iconografía**: Lucide React.

## 🛠️ Instalación y Desarrollo

Para ejecutar el proyecto localmente, sigue estos pasos:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/latinokodi/noporsearch.git
   cd noporsearch/app
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Lanzar la aplicación Electron**:
   Asegúrate de tener Electron configurado y ejecuta el comando de inicio definido en tu `package.json`.

## 📂 Estructura del Proyecto

- `app/src/App.tsx`: Orquestador principal de la interfaz y lógica de búsqueda.
- `app/src/index.css`: Sistema de diseño premium y tokens visuales.
- `app/src/components/`: Componentes modulares como `SiteCard` y `AddSiteModal`.
- `app/electron/main.ts`: Proceso principal de Electron y manejo de APIs nativas.

## 📜 Licencia

Este proyecto está bajo la **Licencia MIT**. Siéntete libre de descargar, modificar y usar este código para tus propios proyectos. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---
Desarrollado con enfoque en alto rendimiento visual y funcional.
