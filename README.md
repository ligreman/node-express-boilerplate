DEBUG mode
----------------------
Linux: DEBUG=express:* node index.js

Windows: set DEBUG=express:* & node index.js

El * puede cambiarse a "router" para ver sólo el direccionador, o "application" para ver sólo la aplicación

AUDITAR
----------------------
npm audit --audit-level high

LINTERS
----------------------
npx eslint .\**\*.js

GLOBALS
----------------------
npm i -g yarn gulp npx
