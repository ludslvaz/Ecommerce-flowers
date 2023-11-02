// Cart
let cartIcon = document.querySelector('#cart-icon')
let cart = document.querySelector(".cart")
let closeCart = document.querySelector('#close-cart')

// Open Cart
cartIcon.onclick = () => {
    cart.classList.add("active")
}
// Close Cart
closeCart.onclick = () => {
    cart.classList.remove("active")
}

// Cart Working JS
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

// Making Function
function ready(){
    // Remove Items From Cart
    var removeCartButtons = document.getElementsByClassName('cart-remove')
    console.log(removeCartButtons)
    for (var i = 0; i < removeCartButtons.length; i++){
        var button = removeCartButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    // Quantity Changes
    var quantityInputs = document.getElementsByClassName('cart-quantity')
    for (var i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i]
        input.addEventListener("change", quantityChanged)
    }
    // Add To Cart
    var addCart = document.getElementsByClassName('add-cart')
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i]
        button.addEventListener("click", addCartClicked)
    }
    // Buy Button Work
    document.getElementsByClassName('btn-buy')[0]
    .addEventListener('click', buyButtonClicked)
    loadCartItems()
}
// Buy Button
function buyButtonClicked(){
    // Mensage (alert) when user finish the buy
    alert("Seu pedido foi feito")
    var cartContent = document.getElementsByClassName("cart-content")[0]
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild)
    }
    updatetotal()
}


// Remove Items From Cart
function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.remove()
    updatetotal()
    saveCartItems()
    updateCartIcon()
}

// Quantity Changes
function quantityChanged(event){
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updatetotal()
    saveCartItems()
    updateCartIcon()
}

// Add To Cart
function addCartClicked(event){
    var button = event.target
    var shopProducts = button.parentElement
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText
    var price = shopProducts.getElementsByClassName('price')[0].innerText
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src
    addProductToCart(title, price, productImg)
    updatetotal()
    saveCartItems()
    updateCartIcon()
}

function addProductToCart(title, price, productImg){
    var cartShopBox = document.createElement('div')
    cartShopBox.classList.add('cart-box')
    var cartItems = document.getElementsByClassName('cart-content')[0]
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title')
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title){
            // Mensage (alert) when user add some product in the cart
            alert('Você adicionou esse produto ao seu carrinho')
            return
        } 
    }
    var cartBoxContent = `
                        <img src="${productImg}" alt="" class="cart-img">
                        <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <input type="number" value="1" class="cart-quantity">
                        </div>
                        <!-- Remove Cart -->
                        <i class='bx bxs-trash-alt cart-remove'></i>`
    cartShopBox.innerHTML = cartBoxContent
    cartItems.append(cartShopBox)

    cartShopBox.getElementsByClassName('cart-remove')[0]
    .addEventListener('click', removeCartItem)

    cartShopBox.getElementsByClassName('cart-quantity')[0]
    .addEventListener('change', quantityChanged)
    saveCartItems()
    updateCartIcon()
}

// Update Total
function updatetotal(){
    var cartContent = document.getElementsByClassName('cart-content')[0]
    var cartBoxes = cartContent.getElementsByClassName('cart-box')
    var total = 0
    for (var i = 0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i]
        var priceElement = cartBox.getElementsByClassName('cart-price')[0]
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0]
        var price = parseFloat(priceElement.innerText.replace("$", ""))
        var quantity = quantityElement.value
        total += price * quantity
    }
    // if price Contain some Cents Value (regular as casas decimais)
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('total-price')[0].innerText = "$" + total
    // Save Total To Localstorage
    localStorage.setItem('cartTotal', total)   
}

// Localstorage
function saveCartItems(){
    var cartContent = document.getElementsByClassName('cart-content')[0]
    var cartBoxes = cartContent.getElementsByClassName('cart-box')
    var cartItems = []

    for (var i = 0; i < cartBoxes.length; i++) {
        cartBox = cartBoxes[i]
        var titleElement = cartBox.getElementsByClassName('cart-product-title')[0]
        var priceElement = cart.getElementsByClassName('cart-price')[0]
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0]
        var productImg = cartBox.getElementsByClassName('cart-img')[0].src

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        }
        cartItems.push(item)
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
}
// Loads In Cart 
function loadCartItems() {
    var cartItems = localStorage.getItem('cartItems')
    if (cartItems) {
        cartItems = JSON.parse(cartItems)

        for(var i = 0; i < cartItems.length; i++) {
            var item = cartItems[i]
            addProductToCart(item.title, item.price, item.productImg)

            var cartBoxes = document.getElementsByClassName('cart-box')
            var cartBox = cartBoxes[cartBoxes.length - 1]
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0]
            quantityElement.value = item.quantity
        }
    }
    var cartTotal = localStorage.getItem('cartTotal')
    if(cartTotal) {
        document.getElementsByClassName('total-price')[0].innerText = "$" + cartTotal
    }
    updateCartIcon()
}

// Quantity In Cart Icon 
function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName('cart-box')
    var quantity = 0

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i]
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0]
        quantity += parseInt(quantityElement.value)

    }

    if (quantity == 0) {
        quantity = 0;
    }

    var cartIcon = document.querySelector('#cart-icon')
    cartIcon.setAttribute('data-quantity', quantity)
}
