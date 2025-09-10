# FacturaPro COMEX

> Sistema Inteligente de Gestión Documental para Comercio Exterior

[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Características

- **Gestión Inteligente de Clientes**: Administra clientes con configuraciones personalizadas
- **Templates Personalizables**: Edita plantillas para cada tipo de documento
- **Procesamiento con IA**: Extracción automática de datos de documentos
- **Múltiples Tipos de Documentos**:
  - 📄 Commercial Invoice (Factura Comercial)
  - 📦 Packing List (Lista de Empaque)
  - 💰 Price List (Lista de Precios)
  - 🏆 Quality Certificate (Certificado de Calidad)
- **Generación de PDFs**: Documentos profesionales listos para usar
- **Interfaz Moderna**: Diseño responsivo y fácil de usar

## 🚀 Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/facturapro-comex.git
cd facturapro-comex

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir http://localhost:3000
```

## 📋 Requisitos

- Node.js 18.0 o superior
- npm 9.0 o superior
- Navegador moderno con soporte para ES2020

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Procesamiento**: PDF-Parse, Mammoth, XLSX
- **Generación PDF**: jsPDF, html2canvas

## 📖 Guía de Uso

### 1. Crear un Cliente
1. Haz clic en "Nuevo Cliente"
2. Completa la información básica
3. Selecciona los tipos de documentos necesarios
4. Guarda el cliente

### 2. Personalizar Templates
1. Ve al detalle del cliente
2. Haz clic en "Editar Template" para cada tipo de documento
3. Personaliza los campos según tus necesidades
4. Guarda los cambios

### 3. Procesar Documentos
1. Crea una nueva orden para el cliente
2. Sube los documentos (PDF, Excel, Word, CSV)
3. Haz clic en "Procesar con IA"
4. Revisa los datos extraídos
5. Descarga los documentos generados

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=FacturaPro COMEX
NEXT_PUBLIC_APP_VERSION=1.0.0

# Configuración de IA (opcional)
OPENAI_API_KEY=tu_api_key_aqui
CLAUDE_API_KEY=tu_api_key_aqui

# Configuración de almacenamiento (opcional)
DATABASE_URL=postgresql://...
```

### Personalización

El sistema es altamente personalizable. Puedes:

- Agregar nuevos tipos de documentos en `src/lib/documentConfig.ts`
- Personalizar templates en `src/data/templates/`
- Modificar el procesamiento de IA en `src/lib/aiProcessor.ts`

## 📁 Estructura del Proyecto

```
src/
├── app/                 # Páginas y rutas de Next.js
├── components/          # Componentes reutilizables
├── lib/                 # Lógica de negocio y utilidades
├── data/                # Datos estáticos y templates
└── utils/               # Funciones auxiliares
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación](docs/)
2. Busca en los [issues existentes](https://github.com/tu-usuario/facturapro-comex/issues)
3. Crea un nuevo issue si es necesario

## 📝 Changelog

### v1.0.0 (2025-01-XX)
- ✨ Lanzamiento inicial
- 🎯 Gestión de clientes
- 📄 Templates personalizables
- 🤖 Procesamiento con IA
- 📱 Interfaz responsiva

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [Tailwind CSS](https://tailwindcss.com/) por los estilos
- [Lucide](https://lucide.dev/) por los iconos
- Comunidad open source por las librerías utilizadas

---

**FacturaPro COMEX** - Simplificando la documentación de comercio exterior con inteligencia artificial.