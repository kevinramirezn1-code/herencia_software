# API de Autenticación y Usuarios

Documentación de los endpoints para registro de usuarios e inicio de sesión.

---

## 1. Registrar Usuario (Registro)

### Endpoint
`POST /api/auth/register`

### Descripción
Registra un nuevo usuario en la base de datos y le inicia la sesión automáticamente devolviendo un token JWT.

### Request Body (JSON)
```json
{
  "nombre_usuario": "Juan",
  "apellido_usuario": "Pérez",
  "correo_usuario": "juan.perez@example.com",
  "contraseña_usuario": "password123",
  "telefono_usuario": "3001234567",
  "fk_usuario_id_rol": 1
}
```

### Respuestas

#### Response 201 (Creado exitosamente)
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...",
  "data": {
    "idusuario": 1,
    "nombre_usuario": "Juan",
    "apellido_usuario": "Pérez",
    "correo_usuario": "juan.perez@example.com",
    "telefono_usuario": "3001234567",
    "fk_usuario_id_rol": 1,
    "rol": {
      "idrol": 1,
      "nombre_rol": "Administrador",
      "descripcion": "Rol con todos los privilegios"
    }
  }
}
```

#### Response 400 (Error de validación de formato)
```json
{
  "success": false,
  "message": "Error de validacion en los datos enviados.",
  "detalles": {
    "correo_usuario": "El campo correo_usuario debe ser un correo electrónico válido.",
    "contraseña_usuario": "La contraseña debe tener al menos 6 caracteres."
  }
}
```

#### Response 404 (El rol no existe)
```json
{
  "success": false,
  "message": "El rol con id 99 no existe."
}
```

#### Response 409 (El correo ya está registrado)
```json
{
  "success": false,
  "message": "El correo 'juan.perez@example.com' ya está registrado."
}
```

---

## 2. Iniciar Sesión (Login)

### Endpoint
`POST /api/auth/login`

### Descripción
Autentica las credenciales de un usuario y devuelve un token JWT para poder realizar peticiones a rutas protegidas.

### Request Body (JSON)
```json
{
  "correo_usuario": "juan.perez@example.com",
  "contraseña_usuario": "password123"
}
```

### Respuestas

#### Response 200 (Autenticación Exitosa)
```json
{
  "success": true,
  "message": "Sesión iniciada exitosamente.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...",
  "data": {
    "idusuario": 1,
    "nombre_usuario": "Juan",
    "apellido_usuario": "Pérez",
    "correo_usuario": "juan.perez@example.com",
    "telefono_usuario": "3001234567",
    "fk_usuario_id_rol": 1,
    "rol": {
      "idrol": 1,
      "nombre_rol": "Administrador",
      "descripcion": "Rol con todos los privilegios"
    }
  }
}
```

#### Response 400 (Error de validación)
```json
{
  "success": false,
  "message": "Error de validacion en los datos enviados.",
  "detalles": {
    "correo_usuario": "El campo correo_usuario debe ser un correo electrónico válido."
  }
}
```

#### Response 401 (Credenciales Incorrectas)
```json
{
  "success": false,
  "message": "Credenciales incorrectas."
}
```
