Instrucciones de Despliegue en Entorno Local
Para ejecutar este proyecto en tu computadora, seguí estos pasos:

Clonar el repositorio:
```bash 
git clone https://github.com/chfede09/tpi-fotaza.git
cd TPI-fotaza
```
Instalar las dependencias:
Instalá los módulos de Node necesarios:
```bash 
npm install
```
Configurar las variables de entorno:
Creá un archivo .env en la raíz del proyecto y configurá tus credenciales locales (XAMPP). Ejemplo:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fotaza_db
DB_PORT=3306
PORT=3000
```
Inicializar la Base de Datos (XAMPP):
Asegurate de tener el módulo MySQL encendido en el panel de XAMPP. Luego, ejecutá el script automático para crear las tablas e inyectar los datos de prueba:
```bash 
npm run db:init
```
Iniciar el servidor:
Levantá la aplicación en modo desarrollo:
```bash
npm start
```
La app estará disponible en: http://localhost:3000



