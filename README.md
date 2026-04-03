# 🚀 OpsFlow Backend

Backend desarrollado con **NestJS + Prisma + PostgreSQL**, implementando autenticación segura con **JWT** y arquitectura modular.

---

## 🧠 Tecnologías utilizadas

* ⚡ NestJS (Framework backend)
* 🧬 Prisma ORM
* 🐘 PostgreSQL
* 🔐 JWT Authentication
* 🔑 Bcrypt (hash de contraseñas)
* 🧪 Thunder Client (testing API)

---

## 📦 Instalación

```bash
npm install
```

---

## ⚙️ Configuración

Crear un archivo `.env` en la raíz:

```env
DATABASE_URL="postgres://usuario:password@host:puerto/db"
JWT_SECRET="supersecret"
```

---

## 🚀 Ejecutar el proyecto

```bash
npm run start:dev
```

Servidor corriendo en:

```
http://localhost:3000
```

---

## 🔐 Autenticación

### 📌 Registro de usuario

```
POST /users
```

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

---

### 🔑 Login

```
POST /auth/login
```

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "access_token": "TOKEN_JWT"
}
```

---

## 🛡️ Rutas protegidas

Para acceder a rutas protegidas, enviar el token en headers:

```
Authorization: Bearer TU_TOKEN
```

---

## 👑 Roles (opcional)

El sistema soporta roles:

* `user`
* `admin`

---

## 📁 Estructura del proyecto

```
src/
 ├── auth/
 ├── users/
 ├── prisma.service.ts
 └── main.ts
```

---

## 🎯 Características

* ✅ CRUD de usuarios
* ✅ Login con JWT
* ✅ Encriptación de contraseñas
* ✅ Guards de autenticación
* ✅ Arquitectura escalable

---

## 📌 Autor

👨‍💻 Juan José Cuautle
🚀 Backend Developer en crecimiento

---

## ⭐ Nota

Proyecto desarrollado como práctica profesional para backend moderno con NestJS.
