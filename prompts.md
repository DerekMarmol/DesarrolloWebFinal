# Prompts utilizados

Prompts enviados al asistente durante el desarrollo, en orden.

## 1. Requisitos e inicio del backend

```text
Ayudame a realizar lo siguiente:

Una app web que nos sirva para registrar incidencias tecnicas de un laboratorio.

El funcionamiento de la app debe ser el registro de fichas tecnicas de incidencias ocurridas a equipos, componentes, etc de un laboratorio. Con el objetivo de mantener un orden y llevar una estructura organizada.

Como stack se usará Node.JS + Sequelize, con una base de datos SQlite, por su simplicidad, en el backend, React basico en el frontend, y sesión mediante cookies.

Los requisitos son los siguientes:
Un login de usuario con sesión de cookie. Deben existir dos roles: usuario y tecnico
Listado de equipos y formulario para registrar una incidencia (equipo, descripción)
Regla: Una incidencia solo puede cerrarla el usuario que la registró o un usuario con rol técnico.
La sesión debe distinguir el rol y el endpoint de cierre debe verificarlo en el backend.

Vamos a dividirlo en minimo 2 commits. Uno para el backend y uno pues para el frontend.

Los modelos a usar a mi parecer son pocos, unicamente estos 3: 
Modelo Usuario
Tabla para el usuario con los siguientes campos: username, nombre, password y rol.

Modelo Equipo
Tabla para los equipos del laboratorio con los siguientes campos: codigo, nombre y ubicación.

Modelo Incidencia
Tabla para las incidencias con los siguientes campos: descripción, estado y cerrada.

Creo que solo esos. No son necesarios más.

Comienza primero con el backend.
```

## 2. Consulta sobre el commit

```text
Haz hecho tú el commit?
```

## 3. Deshacer el commit

```text
Deshace eso por favor. Los commits los haré yo. Haz eso, luego yo agregaré el repositorio a la carpeta.
```

## 4. Frontend

```text
Listo, ya agregué el repositorio y realicé el commit. Prosigue ahora con el frontend.
```

## 5. Registro de usuarios

```text
Funciona, pero hay un detalle en el login. Hay unicamente inicio se sesión. Un login se compone de un registro de usuarios. No hay forma actual que un usuario se registre. Agregalo
```
