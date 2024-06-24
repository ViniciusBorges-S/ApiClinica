const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM pacientes;',
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error})}
                return res.status(200).send({response: result})
            }
        )
    });
});

//RETORNA PACIENTE ESPECIFICO
router.get('/:id_paciente', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM pacientes WHERE idpacientes = ?;',
            [req.params.id_paciente],
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error})}
                return res.status(200).send({response: result})
            }
        )
    });
});

//INSERE 1
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO pacientes (nome) VALUE (?)',
            [req.body.nome],
            (error, result, field) => {
                conn.release();

                if(error) {return res.status(500).send({error: error})}

                res.status(201).send({
                    mensagem: 'Novo paciente cadastrado',
                    id_paciente: result.insertId
                });
            }
        )
    });

    
});

//ALTERA UM PACIENTE
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE pacientes
                SET nome            = ?
              WHERE idpacientes       = ?`,
            [
                req.body.nome, 
                req.body.idpacientes
        ],

            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                res.status(202).send({
                    mensagem: 'Paciente alterado com sucesso'
                });
            }
        )
    });
});

//DELETA UM PACIENTE
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM pacientes WHERE idpacientes = ?;`, [req.body.idpacientes],

            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                res.status(202).send({
                    mensagem: 'Paciente removido com sucesso'
                });
            }
        )
    });
});

module.exports = router;