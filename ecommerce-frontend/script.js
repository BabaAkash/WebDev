const cartBtn = document.querySelector('.cart-btn')
const closeBtn = document.querySelector('.close-btn')
const cart = document.querySelector('.content-section')

const removeCartItemButtons = document.querySelectorAll('.btn-danger')

const purschaseButton = document.querySelector('.btn-purchase')

purschaseButton.addEventListener('click', purchaseClicked)

window.addEventListener('DOMContentLoaded', ()=>{
    axios.get('http://107.21.158.228:4000/products')
    .then(result=>{
        // console.log(result.data.products)

        displayProducts(result.data.products)

        axios.get('http://107.21.158.228:4000/cart')
        .then(result=>{
            //console.log(result)
            let products = result.data.products
            if(products.length>0){
                //console.log( product.title, product.cartItem.quantity, product.price)

                for(let i=0; i<products.length; i++){
                    let cartRow = document.createElement('div')
                    let cart = document.querySelectorAll('.cart-items')[0]
    
                    cartRow.classList.add('cart-row')
                    cartRow.id = products[i].id
                    cartRow.innerHTML = `
                    <div class="cart-item cart-column">
                                    <img class="cart-item-image" src="${products[i].imageUrl}" width="100" height="100">
                                    <span class="cart-item-title">${products[i].title}</span>
                                </div>
                                <span class="cart-price cart-column">$${products[i].price}</span>
                                <div class="cart-quantity cart-column">
                                    <input class="cart-quantity-input" type="number" value="${products[i].cartItem.quantity}">
                                    <button class="btn btn-danger" type="button">REMOVE</button>
                                </div>
                    `
                    cart.append(cartRow)
                    cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem)
                    cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged)
                
                    
                }
                updateCartTotal()
            }

        })
    })
})


cartBtn.addEventListener('click' , ()=>{
    cart.classList.toggle('active')
})

closeBtn.addEventListener('click',()=>{
    cart.classList.toggle('active')
})



for(let i=0; i<removeCartItemButtons.length; i++){
    let button = removeCartItemButtons[i]
    button.addEventListener('click', removeCartItem)
}

let quantityInputs = document.querySelectorAll('.cart-quantity-input')
for(let i=0; i<quantityInputs.length; i++){
    let input = quantityInputs[i]

    input.addEventListener('change', quantityChanged)
}

function displayProducts(products){
    //console.log(products)
    let musicContent = document.querySelector('#music-content')
    musicContent.appendChild

    for(let i=0; i<products.length; i++){
        let musicItem = document.createElement('div')
        musicItem.id = products[i].id

        musicItem.innerHTML =  `
        <h3>${products[i].title}</h3>
        <div class="image-container">
            <img class="prod-images" src="${products[i].imageUrl}" alt="">
        </div>
        <div class="prod-details">
            <span>$<span>${products[i].price}</span></span>
            <button class="shop-item-button" type="button">ADD TO CART</button>
        </div>
        `
    
        musicContent.append(musicItem)
    }

    const addToCartButtons = document.querySelectorAll('.shop-item-button')
    
    for(let i=0; i<addToCartButtons.length; i++){
        let button = addToCartButtons[i]
        button.addEventListener('click', addTocart)
    }
    
}

function purchaseClicked(){
    // let productId = 1

    popupNotification('Thank you for your purchase')
    let cartContainer = document.querySelector('.cart-items')
    let cartItems = cartContainer.querySelectorAll('.cart-row')
    while(cartContainer.hasChildNodes()){
        cartContainer.removeChild(cartContainer.firstChild)
    }
    updateCartTotal()
    axios.post("http://107.21.158.228:4000/orders")
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
    // for(let i=0; i<cartItems.length; i++){
    //     let productId = cartItems[i].id
    //     axios.post("http://107.21.158.228:3000/orders", {productId})
    //     .then(res=>console.log(res))
    //     .catch(err=>console.log(err))
    // }
    
}

function addTocart(e){
    let item = e.target.parentElement.parentElement
    let productId = item.id
    let title = item.querySelector('h3').innerText
    let imgSrc = item.querySelector('.prod-images').src
    let price = item.querySelector('.prod-details').querySelector('span').querySelector('span').innerText
    let message = `Item: ${title} added to cart.`
    
    console.log(productId, title, imgSrc, price)

    axios.post("http://107.21.158.228:4000/cart", {productId})
    .then((result)=>{
        addItemToCart(productId, title, imgSrc, price)
        popupNotification(message)
    }).catch(err=>console.log(err))
}

function addItemToCart(productId ,title, imgSrc, price){
    let cartRow = document.createElement('div')
    let cart = document.querySelectorAll('.cart-items')[0]
    let cartItemNames = cart.querySelectorAll('.cart-item-title')
    
    let present = false
    for(let i=0; i<cartItemNames.length; i++){
        if(cartItemNames[i].innerText == title){
            present = true           
        }
    }

    if(present){
        setTimeout(()=>{
            location.reload()
            updateCartTotal()
        },2000)
    }else{
        cartRow.classList.add('cart-row')
        cartRow.id = productId
        cartRow.innerHTML = `
        <div class="cart-item cart-column">
                        <img class="cart-item-image" src="${imgSrc}" width="100" height="100">
                        <span class="cart-item-title">${title}</span>
                    </div>
                    <span class="cart-price cart-column">$${price}</span>
                    <div class="cart-quantity cart-column">
                        <input class="cart-quantity-input" type="number" value="1">
                        <button class="btn btn-danger" type="button">REMOVE</button>
                    </div>
        `
        cart.append(cartRow)
        cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem)
        cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged)
        updateCartTotal()
    }
    
}

function quantityChanged(e){
    let input = e.target
    if(isNaN(input.value) || input.value<=0){
        input.value = 1
    }
    updateCartTotal()
}

function removeCartItem(e){
    let buttonClicked = e.target
    productId = buttonClicked.parentElement.parentElement.id
    console.log(productId)
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()

    axios.post("http://107.21.158.228:4000/cart-delete-item", {productId})
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
}

function updateCartTotal(){

    let cartContainer = document.querySelectorAll('.cart-items')[0]
    let cartRows = cartContainer.querySelectorAll('.cart-row')
    let totalPrice = 0
    for(let i=0; i<cartRows.length; i++){
        let cartRow = cartRows[i]
        let price = parseFloat(cartRow.querySelector('.cart-price').innerText.slice(1))
        let quantity = parseInt(cartRow.querySelector('.cart-quantity-input').value)

        //console.log(price, quantity)

        totalPrice += price*quantity
        //console.log(totalPrice)
    }
    totalPrice = Math.round(totalPrice*100)/100
    document.querySelector('.cart-total').querySelector('.cart-total-price').innerHTML = '$'+totalPrice
}

function popupNotification(message){
    const container = document.getElementById("container");
    console.log(message)
    let popup = document.querySelector('.popup')
    let mess = document.createElement('p')
    mess.innerHTML = message
    popup.append(mess)

    container.classList.add("active");

    setTimeout(()=>{
        container.classList.remove("active");
        mess.innerHTML = null
    }, 2000)
}


// const close = document.getElementById("close");
// const container = document.getElementById("container");

// open.addEventListener("click", () => {
//     container.classList.add("active");
// });

// close.addEventListener("click", () => {
//     container.classList.remove("active");
// });