## Que entendí del problema:
El funcionamiento de la app debe ser el registro de fichas tecnicas de incidencias ocurridas a equipos, componentes, etc de un laboratorio. Con el objetivo de mantener un orden y llevar una estructura organizada.

## Que tablas/modelos se planearon:
Identifique los siguientes modelos:
**Modelo Usuario**
Tabla para el usuario con los siguientes campos: username, nombre, password y rol.

**Modelo Equipo**
Tabla para los equipos del laboratorio con los siguientes campos: codigo, nombre y ubicación.

**Modelo Incidencia**
Tabla para las incidencias con los siguientes campos: descripción, estado y cerradaEn.

## Modelo de IA usado
Se usó Claude Opus 5.5 en su instancia de claude code.

## Que partes se delegaron a la IA:
A claude se le delegó la realización del codigo.

## Cosas que la IA hizo mal o tuvo que corregir.

Una de las principales cosas que claude hace mal a diferencia de otras IA es la toma de libertades. Claude toma varias decisiones sin realizar preguntas al usuario si es correcto o no. Como la realización de commits y creación de repositorios.

Una cosa que cometió mal, o corrigió fue el apartado del login, no incluía un registro de usuarios para poder crear nuevos, unicamente permitía el inicio con los ya creados por el mismo.