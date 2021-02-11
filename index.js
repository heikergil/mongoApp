const express = require('express')
const app = express()
const path = require('path')
const port = 3000
const Product = require('./models/product')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongoAPP', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('CONECTED TO DBS')
})
.catch((err) => {
    console.log('OH NO ERROR')
    console.log(err)
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/products/new', (req, res) => {
    res.render('products/new')
} )

app.get('/products', async (req, res) => {
    const product = await Product.find({})
    res.render('products/index.ejs', { product })     
  })

  app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    console.log(product)
    res.render('products/edit', { product })
})

  app.get('/products/:id', async (req, res) => {
      const { id } = req.params;
      const product = await Product.findById(id)
      console.log(product)
      res.render('products/show', { product })
  })

  

  app.post('/products', async (req, res) => {
      const newProduct = new Product(req.body)
      await newProduct.save()
      res.redirect('products')

  })
  