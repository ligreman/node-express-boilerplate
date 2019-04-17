## DEBUG mode
Linux: DEBUG=express:* node index.js

Windows: set DEBUG=express:* & node index.js

El * puede cambiarse a "router" para ver sólo el direccionador, o "application" para ver sólo la aplicación

## AUDITAR
npm audit --audit-level high

## LINTERS
npx eslint .\**\*.js

## GLOBALS
npm i -g yarn gulp npx

## SEQUELIZE CONFIG

#### Dependencias
* sequelize
* mariadb (o los drivers que correspondan)

#### Configuración
Fichero config/database.js y en el json de configuración.

#### Inicialización
En app.js se inicializa la base de datos y se obtienen los modelos para trabajar con ellos.

## PASSPORT CONFIG

#### Dependencias
* passport
* passport-local
* express-session (para soporte de sesiones de Express)
* connect-session-sequelize (para sesiones Express + Passport + Sequelize)

#### Configuración
Fichero config/passport.js y en el json de configuración.

#### Inicialización
En app.js simplemente se requiere el fichero de configuración de passport.

Luego se gestiona la autenticación en las rutas.

Se especifican rutas especiales para el /login y /logout.
