const express = require('express')
const app = express()
const pg = require('pg')
const port = process.env.PORT
const bcrypt = require('bcrypt')  //criptografia
const jwt = require('jsonwebtoken');  //token


//para pegar os dados do formulario
app.use(express.urlencoded({extended: false}))
app.use(express.json())

const consStr = process.env.DATABASE_URL
const pool = new pg.Pool({connectionString: consStr}) 

//rota de cadastro
app.post('/usuarios', (req, res) => {
    // var usuario = {
    //     nome : req.body.nome,
    //     email : req.body.email,
    //     senha : req.body.senha,
    //     perfil : req.body.perfil

    // }
    pool.connect((err, client) => {
        if(err) {
            return res.status(401).send({
                message: 'Conexão nao autorizada'
            })
        }

        bcrypt.hash(req.body.senha, 10, (error, hash) => {
            if(error) {
                return res.status(500).send({message: 'erro de autenticação'})
            }

            var sql = 'insert into usuario (nome, email, senha, perfil) values ($1, $2, $3, $4)'
            var dados = [req.body.nome, req.body.email, hash, req.body.perfil]
            client.query(sql, dados, (error, result) => {
                if(error) {
                    return res.status(500).send({
                        message: 'Erro ao inserir usuario'
                    })
                }
                return res.status(201).send({
                    message: 'Usuario cadastrado com sucesso'
                })
            })
        })


        
    })


    //res.send('rota usuario')
})


//rota de login
app.post('/usuarios/login', (req,res) => {
    pool.connect((err, client) => {
        if(err) {
            return res.status(401).send({message: 'conexao nao autorizada'})
        }
        var sql = 'select * from usuario where email = $1'
        var dados = [req.body.email]
        client.query(sql, dados, (error, result) => {
            if(error) {
                return res.status(500).send({ message: 'erro ao selecionar usuario'})
            }
            if(result.rowCount>0) { //.rowCount>0
                bcrypt.compare(req.body.senha, result.rows[0].senha, (error, results) => {  //primeira senha digitada, segunda senha recuperada do banco
                    if(error) {
                        return res.status(401).send({
                            message: 'falha de autenticação'
                        })
                    }
                    if(results) {
                        let token = jwt.sign({
                            //o que quero que tenha dentro do meu token
                            nome: result.rows[0].nome,
                            email: result.rows[0].email,
                            perfil: result.rows[0].perfil

                        }, 'chave secreta', {expiresIn: '1h'})

                        return res.status(200).send({
                        message: 'login realizado com sucesso',
                        token: token
                        })
                    }  //primeira senha digitada, segunda senha recuperada do banco
                
                    return res.status(401).send({message: 'senha não confere'})
                })
                //aqui geramos o token
                //teste do token               
            } else {
                return res.status(404).send({
                    message: 'usuario nao encontrado'
                })
            }

        })



    })



})



app.listen(port, () => {
    console.log(`Executando em http://localhost:${port}`)
})