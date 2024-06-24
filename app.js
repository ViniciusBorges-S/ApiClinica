const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaMedicos = require('./routes/medicos');
const rotaPacientes = require('./routes/pacientes')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false})); //apenas dados simples
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Aloow-Origin', '*');
    res.header(
        'Access-Control-Aloow-Header', 
        'Content-Type, Origin, X-Requrested-With, Accept, Autorization'
    );

    if(req.method === 'OPITIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATHC, GET, DELETE');
        return res.status(200).send({});
    }

    next();
})

app.use('/medicos', rotaMedicos)
app.use('/pacientes', rotaPacientes)

//QUANDO NÃO ACHA ROTA
app.use((req, res, next) => {
    const error = new Error('Rota não encontrada');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro:{
            mensagem: error.message
        }
    })
})


module.exports = app;