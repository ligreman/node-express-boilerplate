DEBUG mode
----------------------
Linux: DEBUG=express:* node index.js
Windows: set DEBUG=express:* & node index.js

El * puede cambiarse a "router" para ver s�lo el direccionador, o "application" para ver s�lo la aplicaci�n

AUDITAR
----------------------
npm audit --audit-level high

LINTERS
----------------------
npx eslint .\**\*.js

GLOBALS
----------------------
npm i -g yarn gulp npx