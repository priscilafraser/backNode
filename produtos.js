const express = require('express')
const app = express()
const port = process.env.PORT

listaProdutos = [
    {
        id: 1,
        descricao: 'milho',
        preco: 7.89
    },
    {
        id: 2,
        descricao: 'feijao',
        preco: 7.89
    }
]

//para pegar os dados do formulario
app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.get('/produtos', (req, res) => {
    res.status(200).send({ produtos: listaProdutos })
})

app.post('/produtos', (req, res) => {
    var produto = {
        id: listaProdutos.length + 1,
        descricao: req.body.descricao,
        preco: req.body.preco
    }
    listaProdutos.push(produto)                                      //x:
    res.status(201).send({ message: 'produto inserido com sucesso', produto: produto })
})

app.get('/produtos/:idproduto', (req, res) => {
    var idproduto = req.params.idproduto
    var produto = ''

    for(let prod of listaProdutos) {
        if(prod.id == idproduto)
        produto = prod
    }

    if(produto == "") {
        res.status(404).send({
            message: 'produto nao encontrado'
        })
    } else {
        res.status(200).send(produto)
    }
})


app.put('/produtos/:idproduto', (req, res) => {
    var idproduto = req.params.idproduto
    var produto = ''

    for(let prod of listaProdutos) {
        if(prod.id == idproduto) {
            prod.descricao = req.body.descricao
            prod.preco = req.body.preco
            produto = prod
        }
        
    }

    if(produto == "") {
        res.status(404).send({
            message: 'produto nao encontrado'
        })
    } else {
        res.status(200).send(produto)
    }

})


app.delete('/produtos/:idproduto', (req, res) => {
    var idproduto = req.params.idproduto
    

    for(let i=0; i < listaProdutos.length; i++) {
        if(listaProdutos[i].id == idproduto) {
            listaProdutos.splice(i, 1)  //posição de partida e até 1
        }    
    }

    res.status(200).send({
        message: "registro excluido com sucesso!",
        id: idproduto
    })
})



app.listen(port, () => {
    console.log(`Executando em http://localhost:${port}`)
})