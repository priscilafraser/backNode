const express = require('express')
const app = express()
const pg = require('pg')
const port = process.env.PORT

//para pegar os dados do formulario
app.use(express.urlencoded({extended: false}))
app.use(express.json())
const consStr = process.env.DATABASE_URL
const pool = new pg.Pool({connectionString: consStr})  //pool de conxao que utiliza a string de conexao


app.get('/conexao', (req, res) => {

    pool.connect((err, client) => {
        if(err) {
            return res.send({
                message: "Erro ao conectar ao database",
                erro: err.message
            })
        }
        return res.send({
            message: "Conectado com sucesso!"
        })
    })
})

app.get('/produtos', (req, res) => {
    pool.connect((err, client) => {
        if(err) {
            return res.status(401).send({
                message: "Erro ao conectar ao database"
            })
        }
        client.query("select * from produto", (error, result) => {
            if(error) {
                return res.send({
                    message: 'erro ao consultar dados',
                    error: error.message
                })
            }
            return res.status(200).send(result.rows)
        })
    })
})

app.post('/produtos', (req, res) => {
    pool.connect((err, client) => {
        if(err) {
            return res.status(401).send({
                message: "Erro ao conectar ao database"
            })
        }

        //listaProdutos = req.body.produtos
        var produto = {
        descricao: req.body.descricao,
        preco: req.body.preco
        }
        //sql = insert into produto(descricao, preco) values ($1, $2);
        //dados = [req.body.descricao, req.body.preco]
        //client.query(sql, [dados], (error, result))
        client.query(`insert into produto(descricao, preco) values ($1, $2);`, [produto.descricao, produto.preco], (error, result) => {
            if(error) {
                return res.send({
                    message: 'erro ao incluir dados',
                    error: error.message
                })
            }
            return res.status(200).send(produto)
        })
        
    })

})



app.get('/produtos/:idproduto', (req, res) => {
    pool.connect((err, client) => {
        if(err) {
            return res.status(401).send({
                message: "Erro ao conectar ao database"
            })
        }

        client.query("select * from produto where id = $1", [req.params.idproduto], (error, result) => {
            if(error) {
                res.send({
                    message: 'erro ao consultar dados',
                    error: error.message
                })
            }
            return res.status(200).send(result.rows[0])
        })
    })
})


app.delete('/produtos/:idproduto', (req, res) => {
    pool.connect((err, client) => {
        if(err) {
            return res.status(401).send({
                message: "Erro ao conectar ao database"
            })
        }

        client.query("delete from produto where id = $1", [req.params.idproduto], (error, result) => {
            if(error) {
                res.send({
                    message: 'erro ao excluir dados',
                    error: error.message
                })
            }
            return res.status(200).send({message: 'registro excluido com sucesso'})
        })
    })
})


app.put('/produtos/:idproduto', (req, res) => {
    pool.connect((err, client) => {
        if(err) {
            return res.status(401).send({
                message: "Erro ao conectar ao database"
            })
        }

        var produto = {
        descricao: req.body.descricao,
        preco: req.body.preco
        }
        client.query(`update produto set descricao=$1, preco=$2 where id=$3;`, [produto.descricao, produto.preco, req.params.idproduto], (error, result) => {
            if(error) {
                return res.send({
                    message: 'erro ao update dos dados',
                    error: error.message
                })
            }
            return res.status(200).send({message: 'produto alterado com sucesso'})
        })
        
    })

})





app.listen(port, () => {
    console.log(`Executando em http://localhost:${port}`)
})