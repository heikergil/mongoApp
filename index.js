const express = require('express')
const app = express()
const path = require('path')
const port = 3000;
const mongoose = require('mongoose');
const Product = require('./models/product')
const methodOverride = require('method-override')





mongoose.connect('mongodb://localhost/mongoAPP', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('CONECTED TO DBS')
})
.catch((err) => {
    console.log('OH NO ERROR')
    console.log(err)
});


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


const categories = ['fruit', 'vegetable', 'dairy', 'baked goods'];

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
} )

app.get('/products', async (req, res) => {
    const product = await Product.find({})
    res.render('products/index.ejs', { product })     
  })

  app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories })
})



app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true, useFindAndModify: false })
    res.redirect(`/products/${product._id}`) 
})


  app.get('/products/:id', async (req, res) => {
      const { id } = req.params;
      const product = await Product.findById(id)
      res.render('products/show', { product })
  })

  

  app.post('/products', async (req, res) => {
      const newProduct = new Product(req.body)
      await newProduct.save()
      res.redirect('products')

  })

  app.delete('/products/:id', async (req, res) => {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      res.redirect('/products');
  })
  


  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })