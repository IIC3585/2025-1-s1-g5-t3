# MyBooks - Aplicación de Gestión de Libros

![MyBooks Logo](https://openlibrary.org/static/images/openlibrary-logo-tighter.svg)

## Descripción
MyBooks es una aplicación web que permite buscar, guardar y organizar tus libros favoritos. Está disponible en dos versiones tecnológicamente idénticas: una implementada con Vue.js y otra con Svelte.

Los usuarios pueden:
- Mantener listas de libros **leídos**, **recomendados** y **por leer**.  
- Buscar libros mediante peticiones a la API de OpenLibrary.  
- Calificar libros de 1 a 5 estrellas y ver detalles en un modal.  
- Persistir el estado localmente usando `localStorage`, de modo que los datos sobreviven recargas de página.

## ✨ Características Principales
- **Búsqueda de libros** usando la API de OpenLibrary
- **Colecciones personalizadas**: Organiza tus libros en tres categorías:
  - 📕 Leídos
  - 👍 Recomendados
  - 📝 Quiero leer
- **Sistema de valoración**: Califica tus libros leídos de 1 a 5 estrellas
- **Recomendaciones inteligentes** basadas en tus libros favoritos (4+ estrellas)
- **Visualizaciones organizadas**:
  - Por autor
  - Por género/tema
  - Vista completa de tu biblioteca
- **Persistencia local**: Todos tus datos se guardan automáticamente en el navegador

## 🛠️ Tecnologías utilizadas

### Versión Vue
- **Framework/Librerías**: Vue 3 + Vite + Pinia + Vue Router.  
- **Estructura**: Componentes en `.vue` con separación de `<template>`, `<script>` y `<style>`.  
- **DevTools**: Integración con Vue Devtools para depuración de estado y componentes.

### Versión Svelte
- **Framework/Librerías**: Svelte + Vite (no se requieren librerías externas para estado).  
- **Estructura**: Componentes en `.svelte` con reactividad directa; no hay runtime de reactividad pesada.  
- **Bundles**: Menor tamaño por compilación a JavaScript plano, sin sobrecarga de un _framework_ en tiempo de ejecución.

### Común a ambas versiones
- OpenLibrary API para datos de libros
- JavaScript ES6+
- CSS3 con diseño responsivo
- LocalStorage para persistencia de datos

## Estado Global y Características CRUD
- **Estado Global**:  
  - En Vue, gestionado con Pinia (`bookStore.js`) y suscripción mediante `useBookStore()`.  
  - En Svelte, a través de sus _stores_ integrados y el contexto de la aplicación.
- **Persistencia Automática**: Watchers sobre las listas de libros que sincronizan cambios con `localStorage`.
- **Getters Computados**: Derivaciones de datos (por ejemplo, contar libros por lista) usando `computed` (Vue) o `$:` reactivo (Svelte).
- **Acciones CRUD**:  
  - `addBook(book, listName)`  
  - `removeBook(bookKey, listName)`  
  - `setSelectedList(listName)`  
  - `rateBook(bookKey, rating)`  
  - `openBookModal(book)` / `closeBookModal()`

## 🚀 Instalación y configuración

### Versión Vue

```bash
# Navega al directorio del proyecto Vue
cd vue-mybooks

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev

# Para construir para producción
npm run build
```

### Versión Svelte

```bash
# Navega al directorio del proyecto Svelte
cd svelte-mybooks

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev

# Para construir para producción
npm run build
```

## 📖 Uso

1. **Buscar libros**: Usa la barra de búsqueda para encontrar libros por título o autor
2. **Guardar libros**: Haz clic en un libro para ver sus detalles y agregarlo a una de tus colecciones
3. **Valorar libros**: Califica tus libros leídos para obtener mejores recomendaciones
4. **Explorar recomendaciones**: Visita la sección de recomendaciones para descubrir nuevos libros basados en tus gustos
5. **Ver tu biblioteca**: Explora tus libros organizados por autor, tema o en una vista completa

## Comparativa de Frameworks

| Aspecto                   | Vue                                                                  | Svelte                                                                                                                                 |
|---------------------------|----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Ecosistema                | Madura: Pinia, Vue Router y amplio catálogo de componentes listos. | Más ligero: stores, animaciones y transiciones integrados; menos dependencias externas.                             |
| Curva de aprendizaje      | Suave: archivos `.vue` separan claramente HTML/CSS/JS.    | Muy directa: reasignación de variables activa la reactividad; menos conceptos nuevos que aprender.                 |
| DevTools                  | Muy potentes para inspección en vivo de estado y componentes. | Menos enfocado en herramientas de depuración nativas; aprovecha herramientas genéricas de navegador.               |
| Tamaño del bundle         | Incluye runtime de Vue: tamaño moderado.              | Bundle mínimo al compilar a JS plano: carga más rápida, ideal en dispositivos modestos.                             |
| Flexibilidad arquitectónica | Múltiples opciones de plugins y librerías; requiere decisiones de configuración. | Modelo simple de aplicación: menos decisiones de arquitectura, más enfoque en código de componentes.               |

## 🌐 APIs utilizadas

- **OpenLibrary Search API**: Búsqueda de libros
- **OpenLibrary Cover API**: Obtención de portadas
- **OpenLibrary Works API**: Detalles y metadatos de libros

---

> **Conclusión**:  
> - **Vue** destaca en proyectos donde se valora un ecosistema robusto, herramientas de depuración avanzadas y una curva de adopción gradual.  
> - **Svelte** brilla en aplicaciones donde el rendimiento y el tamaño del bundle son críticos, con una experiencia de desarrollo más directa y menos dependencias externas.
