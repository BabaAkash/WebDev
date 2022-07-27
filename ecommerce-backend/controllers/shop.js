const Product = require('../models/product');
const Cart = require('../models/cart');
const { json } = require('body-parser');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.json({products})
    //   res.render('shop/product-list', {
    //     prods: products,
    //     pageTitle: 'All Products',
    //     path: '/products'
    //   });
     })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          console.log(products)
          res.json({products})
          // res.render('shop/cart', {
          //   path: '/cart',
          //   pageTitle: 'Your Cart',
          //   products: products
          // });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  
  const prodId = req.body.productId;
  console.log(prodId)
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.send("Item added to cartDB");
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where:{id:prodId}})
  }).then(products=>{
    const product = products[0]
    return product.cartItem.destroy()
  }).then(result=>{
    res.redirect('/cart')
  })
  .catch()
  Product.findByPk(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    //res.redirect('/cart');
    res.send("Deleted successfully")
  });
};

exports.postOrders=(req,res,next)=>{
  let odersDetails
  let fetchedCart
  req.user.getCart().then(cart=>{
    fetchedCart=cart
    return cart.getProducts();
  })
  .then(products =>{
   return req.user.createOrder()
   .then(order=>{
    odersDetails=order;
    return order.addProducts(products.map(product=>{
       product.orderItem= {quantity:product.cartItem.quantity}       
       return product;
     }))    
   })   
  })
  .then(result=>{   
    fetchedCart.setProducts(null)
    res.status(200).json({orderDetails:odersDetails})
    
  })

}

exports.getOrders = (req, res, next) => {

  req.user.getOrders({include:['products']})
  .then(orders=>{
    res.status(200).json(orders)
  }).catch(err=>{
    console.log(err)
  })
  //http://107.21.158.228:3000/create-orders
  // res.render('shop/orders', {
  //   path: '/orders',
  //   pageTitle: 'Your Orders'
  // });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
