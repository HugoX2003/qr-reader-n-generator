# QR Reader & Generator

Una aplicación web moderna para generar y leer códigos QR directamente desde el navegador, sin necesidad de instalación ni servidor.

## 🚀 Características

### Generador de Códigos QR
- **Generación instantánea** de códigos QR desde texto o URLs 
- **Tamaños personalizables**: Pequeño (128×128), Mediano (256×256), Grande (400×400)
- **Niveles de corrección de errores**: Low (7%), Medium (15%), Quartile (25%), High (30%)
- **Descarga múltiple**: Exporta en formato PNG y SVG
- **URLs compartibles**: Los parámetros se guardan en la URL para fácil compartición

### Lector de Códigos QR
- **Escaneo en tiempo real** usando la cámara del dispositivo
- **Detección automática** de códigos QR en el video stream 
- **Copia al portapapeles** con un solo clic 
- **Apertura automática** de URLs detectadas 

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Librerías**:
  - [qrcodejs](https://github.com/davidshimjs/qrcodejs) v1.0.0 - Generación de códigos QR 
  - [jsQR](https://github.com/cozmo/jsQR) v1.4.0 - Lectura de códigos QR 
  - [Font Awesome](https://fontawesome.com/) v6.4.0 - Iconografía 

## 🚀 Instalación y Uso

### Opción 1: Uso Directo
1. Clona el repositorio:
```bash
git clone https://github.com/HugoX2003/qr-reader-n-generator.git
cd qr-reader-n-generator
```

2. Abre `index.html` en tu navegador web

### Opción 2: Servidor Local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve .

# Con PHP
php -S localhost:8000
```

## 📁 Estructura del Proyecto

```
qr-reader-n-generator/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos de la aplicación
├── js/
│   └── script.js       # Lógica de la aplicación
└── assets/
    └── favicon.svg     # Icono de la aplicación
```

## 🎨 Interfaz de Usuario

La aplicación cuenta con una interfaz moderna y responsiva con dos pestañas principales:

- **Generar**: Interfaz para crear códigos QR personalizados
- **Leer QR**: Interfaz para escanear códigos QR con la cámara

El diseño utiliza un esquema de colores moderno con gradientes y sombras suaves.

## 🔧 APIs del Navegador Utilizadas

- **MediaDevices API**: Para acceso a la cámara del dispositivo
- **Canvas API**: Para procesamiento de imágenes y generación de descargas
- **Clipboard API**: Para copiar resultados al portapapeles 
- **URL API**: Para validación de URLs y manejo de parámetros 

## 🌐 Compatibilidad

- **Navegadores modernos** con soporte para ES6+
- **Dispositivos móviles** con cámara para funcionalidad de lectura
- **HTTPS requerido** para acceso a la cámara en producción

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/FeatureInsana`)
3. Commit tus cambios (`git commit -m 'Added a pingaza'`)
4. Push a la rama (`git push origin feature/FeatureInsana`)
5. Abre un Pull Request
