const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM medicos;',
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error})}
                return res.status(200).send({response: result})
            }
        )
    });
});

//RETORNA MEDICO ESPECIFICO
router.get('/:id_medico', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM medicos WHERE idmedicos = ?;',
            [req.params.id_medico],
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
            'INSERT INTO medicos (nome, especialidade) VALUES (?,?)',
            [req.body.nome, req.body.especialidade],
            (error, result, field) => {
                conn.release();

                if(error) {return res.status(500).send({error: error})}

                res.status(201).send({
                    mensagem: 'Novo médico cadastrado',
                    id_medico: result.insertId
                });
            }
        )
    });

    
});

//ALTERA UM MÉDICO
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE medicos
                SET nome            = ?,
                    especialidade   = ?
              WHERE idmedicos       = ?`,
            [
                req.body.nome, 
                req.body.especialidade, 
                req.body.idmedicos
        ],

            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                res.status(202).send({
                    mensagem: 'Médico alterado com sucesso'
                });
            }
        )
    });
});

//DELETA UM MÉDICO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM medicos WHERE idmedicos = ?;`, [req.body.idmedicos],

            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                res.status(202).send({
                    mensagem: 'Médico removido com sucesso'
                });
            }
        )
    });
});

module.exports = router;