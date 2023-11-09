// Cart
let cartIcon = document.querySelector('#cart-icon')
let cart = document.querySelector(".cart")
let closeCart = document.querySelector('#close-cart')

// Open Cart
cartIcon.onclick = () => {
    cart.classList.add("active")
}         //classList -> permite manipular as classes de um elemento HTML de forma simples
// Close Cart
closeCart.onclick = () => {
    cart.classList.remove("active")
}

// Cart Working JS
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}  //DOMContentLoaded: é acionado quando todo o HTML foi completamente carregado e analisado, sem aguardar pelo CSS.
   //Prepara o documento para interações

// Making Function
function ready(){
    // Remove Items From Cart
    var removeCartButtons = document.getElementsByClassName('cart-remove')
        //imprime a lista de elementos com a classe 'cart-remove' no console
    console.log(removeCartButtons)
        //FOR -> loop que percorre os elementos da lista
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
    // Remove all items from cart
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
    //(garante que apenas valores numéricos válidos sejam aceitos)
function quantityChanged(event){
    //O event.target se refere ao elemento que disparou o evento.
    var input = event.target
    //isNaN -> se não for um num
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
    //parentElement -> obtém o elemento pai do botão clicado
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
    //Esse elemento é onde os produtos do carrinho são exibidos.
    var cartItems = document.getElementsByClassName('cart-content')[0]
    //Se encontrar um item com o msm título q o produto q está sendo add, vai pro alert
    //Evita duplicações no carrinho
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title')
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title){
            // Mensage (alert) when user add some product in the cart
            alert('Você adicionou esse produto ao seu carrinho')
            return
        } 
    }
    //Creates the HTML content for the cart item
        //O icon "trash" está sendo add aqui
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

    //Adding Events to Buttons:
    cartShopBox.getElementsByClassName('cart-remove')[0]
    .addEventListener('click', removeCartItem)

    cartShopBox.getElementsByClassName('cart-quantity')[0]
    .addEventListener('change', quantityChanged)
    saveCartItems() //Função do LocalStorage
    updateCartIcon()
}

// Update Total
function updatetotal(){
    // (é responsável por calcular o total dos itens no carrinho de compras e exibi-lo na página)
    var cartContent = document.getElementsByClassName('cart-content')[0]
    var cartBoxes = cartContent.getElementsByClassName('cart-box')
    //Loop para Calcular o Total:
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
    //O loop percorre cada elemento no carrinho e extrai oq se pede
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
        //Esses dados são armazenados em um objeto e adicionados ao array 
        cartItems.push(item)
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems)) //pega tudo que está no objeto e transforma pra string
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
    //A função itera pelos elementos do carrinho e obtém a quantidade de cada item.
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
