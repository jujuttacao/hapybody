# HapyBody+ ⚡ | Tu Asistente de Bienestar Fitness v2.0

HapyBody+ es una aplicación web responsiva e independiente de dependencias (SPA) diseñada para ayudarte a organizar entrenamientos, alimentación, suplementos, medicamentos, hidratación y hábitos de bienestar físico día a día.

## ✨ Características Principales

*   **Panel de Control Inteligente (Dashboard)**: Resumen del progreso diario con frases motivacionales dinámicas, metas del día, pendientes y recordatorios rápidos.
*   **Gestor de Entrenamientos**: Planifica y completa tus rutinas diarias divididas por grupos musculares y días de la semana.
*   **Seguimiento de Suplementos y Medicación**: Recordatorios visuales para tus tomas diarias con estados de pendientes y completados.
*   **Evaluador del Plato de Comida (Nutrición)**: Registra tus comidas (Desayuno, Almuerzo, Cena, Snacks) y evalúa el equilibrio del plato (proteínas, carbohidratos, verduras, frutas, agua) con puntuaciones dinámicas.
*   **Hábitos y Consumo de Agua**: Registra hábitos clave y vasos de agua tomados de forma interactiva.
*   **Historial de Medidas Físicas y Evolución de Peso**: Registra tus medidas corporales (peso, cintura, brazo, pecho) y visualiza tu evolución a través de una gráfica dinámica de Canvas optimizada para pantallas de alta densidad física.
*   **Temas Oscuro / Claro**: Cambia de tema fácilmente desde cualquier vista, con almacenamiento persistente del tema sin parpadeos (*theme flash*).
*   **Sin dependencias externas**: Rápido, ligero y optimizado para ejecutarse localmente.

---

## 📁 Estructura del Proyecto

```
Hapubody+/
├── css/
│   ├── main.css          # Variables globales, reset de estilos y temas (oscuro/claro)
│   ├── components.css    # Estilos de botones, tarjetas, modales y componentes UI
│   └── views.css         # Estilos específicos para cada vista de la SPA
├── js/
│   ├── app.js            # Inicializador de la SPA, router y theme-manager
│   ├── storage.js        # Capa de almacenamiento y abstracción (IIFE) para localStorage
│   ├── dashboard.js      # Lógica e interacciones del panel de control
│   ├── training.js       # Registro y completado de entrenamientos
│   ├── nutrition.js      # Evaluador de plato y comidas
│   ├── progress.js       # Seguimiento físico, hábitos y renderizado de la gráfica de canvas
│   ├── supplements.js    # Manejo de suplementos y medicamentos
│   ├── profile.js        # Configuración del perfil de usuario y objetivos
│   └── settings.js       # Exportación, importación y reseteo de datos
├── index.html            # Estructura HTML base de la aplicación y modales
└── .gitignore            # Archivos excluidos del control de versiones (Git)
```

---

## 🚀 Guía de Despliegue

### 1. Subir el proyecto a GitHub (Paso a Paso)

Abre la terminal en la carpeta raíz del proyecto (`Hapubody+`) y ejecuta los siguientes comandos en orden:

```bash
# 1. Inicializar el repositorio Git local
git init

# 2. Agregar todos los archivos al área de preparación (stage)
git add .

# 3. Crear el primer commit de confirmación
git commit -m "Initial commit: HapyBody+ v2.0 con mejoras visuales y de persistencia"

# 4. Crear la rama principal llamada main
git branch -M main

# 5. Conectar el repositorio local con tu repositorio remoto de GitHub
# (Reemplaza la URL con la dirección de tu repositorio en GitHub)
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# 6. Subir tus archivos a GitHub
git push -u origin main
```

*(Nota: Asegúrate de haber creado primero el repositorio vacío en tu cuenta de GitHub).*

---

### 2. Desplegar en Vercel (Paso a Paso)

Puedes subir el proyecto a Vercel de dos formas fáciles:

#### Opción A: Vinculación desde GitHub (Recomendado)
1. Ve a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **Add New...** ➜ **Project**.
3. Selecciona tu repositorio recién subido (`Hapubody+`) y haz clic en **Import**.
4. En la configuración del proyecto, deja los valores predeterminados (Vercel detectará que es un proyecto HTML/CSS/JS estático y configurará el build automáticamente).
5. Haz clic en **Deploy**. ¡Listo! Tendrás tu enlace de producción en segundos.

#### Opción B: Mediante Vercel CLI (Línea de Comandos)
Si prefieres desplegar directamente desde tu terminal:
1. Instala el CLI de Vercel globalmente (si no lo tienes):
   ```bash
   npm install -g vercel
   ```
2. Inicia sesión en Vercel desde la terminal:
   ```bash
   vercel login
   ```
3. Ejecuta el comando de despliegue en la raíz del proyecto:
   ```bash
   vercel
   ```
4. Sigue las breves preguntas en consola (usualmente puedes presionar Enter para aceptar las opciones por defecto).
5. Para pasar a producción ejecutas:
   ```bash
   vercel --prod
   ```

---

## 🧬 Siguientes Pasos (Próxima Integración)
*   **Supabase Backend**: Configurar la conexión con Supabase para implementar Autenticación de usuarios y sincronizar los datos de `localStorage` con una base de datos PostgreSQL en tiempo real por cada usuario.
