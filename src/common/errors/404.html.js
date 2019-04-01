/**
 * Plantilla HTML para el error 404
 * @type {string}
 */
module.exports = ` 
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>404 Not Found</title>
        <style type="text/css">
            body {
                height: 100vh;
            }
            .center {
                text-align: center;
            }       
            img {
                height: 50vh;
            } 
            section {
                display: flex;
                flex-direction: row;
                align-items: center;
                height: 100%;
            }
            p {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <section>
            <p class="center">404 Not Found</p>
        </section>
    </body>
    </html>
    `;
