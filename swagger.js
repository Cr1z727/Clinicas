const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Metadata informacion. Pilas, el versionamiento es por que es comun tener 
// diferentes versiones de nuestra API
const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "Api para historia clinica",
            version: "1.1.0",
        }
    },
    apis:[
        './index.js'
    ]
}

// Documentacion en formato Json
// Obviamente json!!!
const swaggerSpec = swaggerJSDOC(options);

const swaggerDocs = (app,port)=>{
    app.use('/doc',swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    
}

module.exports = {swaggerDocs}