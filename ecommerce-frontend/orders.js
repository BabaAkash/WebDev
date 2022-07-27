const oders_container=document.getElementById('oders_container')

window.addEventListener("DOMContentLoaded", () => {
    getOrders()
})
const caritem=document.getElementById('card-item-cont')

function getOrders(){
    axios.get('http://107.21.158.228:4000/orders').then(data=>{
        console.log(data.data)
        const orders=data.data
        var totalprice=0;

        for(let i=0;i<orders.length;i++){
            const orderitesm=` <div class="orders-cart">
            <div class="order-header">
              <h3>order id:${orders[i].id}</h3>
              <h3>${orders[i].createdAt}</h3>
              <p hidden>${totalprice = 0}</p>
            </div>
            
            <div class="card-item-cont">
            ${
                
                orders[i].products.map(product=>
                   ` <div class="card-item">
                    <img
                      class="order-img"
                      src=${product.imageUrl}
                      alt=""
                    />
                    <div class="card-item-desc" >
                      <h4>${product.title}</h4>
                      <h4>$${product.price}</h4>
                      <h4>qty:${product.orderItem.quantity}</h4>
                      <h4>${product.description}</h4>
                      <p hidden>${totalprice+=parseFloat(product.price)*parseInt(product.orderItem.quantity)}</p>
                    </div>   
                  </div>`
            )}
             
            </div>
            <h4 class='totalPrice'> Total:${totalprice}</h4>
        
          </div>`
          oders_container.innerHTML=  oders_container.innerHTML+orderitesm

        }

    })
}