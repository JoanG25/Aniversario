# Invitación web · Bodas de Plata de Edgar & Vilma

Web estática, responsiva, preparada para **GitHub Pages gratuito**. Incluye fotografías, cuenta regresiva, cronograma, botón de Google Maps, formulario de confirmación y panel privado de organizadores con exportación CSV.

**Fecha del evento:** sábado 28 de noviembre de 2026.
**Recepción:** 5:00 p. m. · **Sorpresa:** 6:00 p. m.
**Dirección:** calle Gregorio Mendoza N.º 503, La Paz, Bolivia.

## 1. Abrir en VS Code

1. Descomprime el archivo ZIP y abre la carpeta `invitacion-bodas-plata` en VS Code.
2. Para previsualizar, usa la extensión **Live Server** sobre `index.html`, o ejecuta `python -m http.server 5500` en la terminal y abre `http://localhost:5500`.
3. La página se puede visualizar sin configurar nada; **el envío de confirmaciones requiere configurar Supabase primero**.

## 2. Crear base de datos gratis (Supabase)

GitHub Pages solo aloja archivos estáticos, por lo que **no puede guardar por sí solo las respuestas**. Para que las confirmaciones se compartan entre todos los invitados y se vean desde el panel, usamos Supabase (plan gratuito sujeto a sus límites).

1. Entra a https://supabase.com y crea una cuenta y un proyecto nuevo. Guarda la contraseña del proyecto de forma segura.
2. En **Authentication > Users**, crea un usuario organizador desde **Add user** (correo + contraseña). Si aparece una opción de confirmación automática de correo, úsala únicamente para esa cuenta que controlas; de lo contrario confirma el email antes de iniciar sesión.
3. Abre `supabase.sql` en VS Code. **Reemplaza `organizador@ejemplo.com` con el correo EXACTO** del usuario administrador que acabas de crear.
4. Copia el contenido del archivo `supabase.sql` y ejecútalo desde **Supabase > SQL Editor > New query > Run**.
5. En **Project Settings > API Keys** (o Connect, según la versión del panel), busca la **Project URL** y la **publishable key** o la clave pública legacy **anon**. Nunca uses la clave `service_role` / `secret`.
6. Abre `config.js` y reemplaza `PEGA_AQUI_TU_SUPABASE_URL` por la URL (`https://xxxx.supabase.co`) y `PEGA_AQUI_TU_SUPABASE_ANON_KEY` por la clave pública.
7. Guarda. Abre `index.html` con Live Server y envía una confirmación de prueba. Comprueba la fila en **Table Editor > confirmaciones**.
8. Abre `admin.html` e inicia sesión con el correo y contraseña de organizador. Verás la lista de invitados, su puntualidad, mensajes y la opción **Exportar CSV**.

### Privacidad y seguridad

- El archivo `config.js` contiene únicamente la URL y **clave pública**, que pueden ser visibles en GitHub y en el navegador. Esto es normal en Supabase con políticas RLS configuradas.
- **Nunca** subas claves secretas, `service_role`, contraseñas o tokens privados al repositorio.
- Las políticas RLS de `supabase.sql` permiten **insertar** respuestas sin iniciar sesión y **leerlas** únicamente al correo administrador indicado en el SQL. No habilites políticas públicas de SELECT.
- El link de `admin.html` no constituye protección: la protección real es la autenticación y la política RLS.
- Un formulario público puede recibir respuestas falsas o spam. Antes de difundir masivamente, considera protección adicional CAPTCHA y limitación de frecuencia por servidor (por ejemplo, Edge Functions). El formulario incluye un campo trampa básico, que no sustituye estas protecciones.
- No es recomendable publicar la lista de invitados ni datos de contacto.

## 3. Publicar GRATIS con GitHub Pages

1. Crea un **repositorio público** nuevo en GitHub, por ejemplo `bodas-plata-edgar-vilma`.
2. En VS Code, abre la terminal **dentro de la carpeta** `invitacion-bodas-plata` y ejecuta:

```bash
git init
git add .
git commit -m "Invitacion bodas de plata"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/bodas-plata-edgar-vilma.git
git push -u origin main
```

3. En GitHub entra a **Settings > Pages**; en **Build and deployment**, elige **Deploy from a branch**, selecciona `main` y carpeta `/(root)`, luego **Save**.
4. La dirección será aproximadamente `https://TU_USUARIO.github.io/bodas-plata-edgar-vilma/`. En el repositorio verás la dirección exacta cuando GitHub termine de publicar.
5. Si modificas algo, vuelve a ejecutar:

```bash
git add .
git commit -m "Actualizacion de la invitacion"
git push
```

**Alternativa sin comandos:** desde GitHub puedes elegir **Add file > Upload files** y subir el contenido de la carpeta (no el archivo ZIP). Habilita Pages igual que arriba.

## 4. Archivos

- `index.html`: invitación pública y formulario de asistencia.
- `styles.css`: diseño responsivo, colores y tipografías.
- `app.js`: cuenta regresiva, validación y guardado de confirmaciones.
- `admin.html`, `admin.js`: acceso privado, tabla y exportación CSV.
- `config.js`: URL y clave pública de Supabase (debes completarlas).
- `supabase.sql`: tabla y políticas de seguridad para la base de datos.
- `assets/`: fotos optimizadas, incluidas en el ZIP.

## 5. Personalización rápida

- Fecha, horario y nombre: buscar y editar en `index.html`. **Si cambias la fecha**, actualizar también `eventDate` en `app.js` (incluido el huso horario `-04:00`).
- Dirección y enlace Google Maps: sección `id="ubicacion"` de `index.html`.
- Fotografías: `assets/novio.webp`, `assets/novia.webp`, `assets/pareja.webp`. Puedes reemplazarlas sin cambiar sus nombres.
- Colores y estilo: variables CSS al inicio de `styles.css`.
- El panel no cuenta asistentes adicionales por respuesta: **cada envío registra a una persona**. Para grupos o familias, cada invitado debe enviar su propia respuesta.

## Nota sobre el enlace de Maps

Se utilizó el enlace enviado por la familia. Revisa que apunte exactamente al lugar correcto antes de compartir públicamente la invitación.
