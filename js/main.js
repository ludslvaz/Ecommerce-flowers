// Cart
const cartIcon = document.querySelector('#cart-icon');
const cart = document.querySelector(".cart");
const closeCart = document.querySelector('#close-cart');

// Open Cart
cartIcon.addEventListener('click', () => {
    cart.classList.add("active");
});

// Close Cart
closeCart.addEventListener('click', () => {
    cart.classList.remove("active");
});

// Cart Working JS
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// Making Function
function ready() {
    // Remove Items From Cart
    const removeCartButtons = document.querySelectorAll('.cart-remove');
    removeCartButtons.forEach((button) => {
        button.addEventListener('click', removeCartItem);
    });

    // Quantity Changes
    const quantityInputs = document.querySelectorAll('.cart-quantity');
    quantityInputs.forEach((input) => {
        input.addEventListener('change', quantityChanged);
    });

    // Add To Cart
    const addCartButtons = document.querySelectorAll('.add-cart');
    addCartButtons.forEach((button) => {
        button.addEventListener('click', addCartClicked);
    });

    // Buy Button Work
    document.querySelector('.btn-buy').addEventListener('click', buyButtonClicked);

    loadCartItems();
}
// Buy Button
function buyButtonClicked(){
    // Mensage (alert) when user finish the buy
    alert("Seu pedido foi feito")
    // Remove all items from cart
    const cartContent = document.querySelector(".cart-content")
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild)
    }
    updatetotal()
    updateCartIcon()
    localStorage.removeItem('cartItems')
    localStorage.removeItem('cartTotal')
}

// Remove Items From Cart
function removeCartItem(event) {
    const buttonClicked = event.target
    buttonClicked.parentElement.remove()
    updatetotal()
    saveCartItems()
    updateCartIcon()
}

// Quantity Changes 
    //(garante que apenas valores numéricos válidos sejam aceitos)
function quantityChanged(event){
    //O event.target se refere ao elemento que disparou o evento.
    const input = event.target
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
    const button = event.target
    //parentElement -> obtém o elemento pai do botão clicado
    const shopProducts = button.parentElement
    const title = shopProducts.querySelector('.product-title').innerText
    const price = shopProducts.querySelector('.price').innerText
    const productImg = shopProducts.querySelector('.product-img').src
    addProductToCart(title, price, productImg)
    updatetotal()
    saveCartItems()
    updateCartIcon()
}

function addProductToCart(title, price, productImg){
    const cartShopBox = document.createElement('div')
    cartShopBox.classList.add('cart-box')
    //Esse elemento é onde os produtos do carrinho são exibidos.
    const cartItems = document.querySelector('.cart-content')
    //Se encontrar um item com o msm título q o produto q está sendo add, vai pro alert
    //Evita duplicações no carrinho
    let itemAlreadyExists = false
    const cartItemsNames = cartItems.getElementsByClassName('cart-product-title')
    Array.from(cartItemsNames).forEach(cartItem => {
        if (cartItem.innerText == title){
            // Mensage (alert) when user add some product in the cart
            alert('Você adicionou esse produto ao seu carrinho')
            itemAlreadyExists = true
        } 
    })
    if (itemAlreadyExists) {
        return // Não executa o restante da função se o item já existir no carrinho.
    }
    //Creates the HTML content for the cart item
        //O icon "trash" está sendo add aqui
    const cartBoxContent = `
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
    cartShopBox.querySelector('.cart-remove')
    .addEventListener('click', removeCartItem)

    cartShopBox.querySelector('.cart-quantity')
    .addEventListener('change', quantityChanged)
    saveCartItems() //Função do LocalStorage
    updateCartIcon()
}

// Update Total
function updatetotal() {
    const cartContent = document.querySelector('.cart-content');
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    
    let total = 0;

    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector('.cart-price');
        const quantityElement = cartBox.querySelector('.cart-quantity');
        const price = parseFloat(priceElement.innerText.replace("$", ""));
        const quantity = parseInt(quantityElement.value);

        if(quantity > 4) {
            alert("Não temos mais este produto em estoque.")
            quantity = 4;
        }

        total += price * quantity;
        
        //Atualiza a quantidade no elemento HTML
        quantityElement.value = quantity
    });

    // if price contains some Cents Value (casas decimais)
    total = Math.round(total * 100) / 100;

    document.querySelector('.total-price').innerText = "$" + total;

    // Save Total To Localstorage
    localStorage.setItem('cartTotal', total);
}

// Localstorage
function saveCartItems() {
    const cartContent = document.querySelector('.cart-content');
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    const cartItems = [];

    // O loop percorre cada elemento no carrinho e extrai o que se pede
    cartBoxes.forEach(cartBox => {
        const titleElement = cartBox.querySelector('.cart-product-title');
        const priceElement = cartBox.querySelector('.cart-price');
        const quantityElement = cartBox.querySelector('.cart-quantity');
        const productImg = cartBox.querySelector('.cart-img').src;

        const item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };

        // Esses dados são armazenados em um objeto e adicionados ao array
        cartItems.push(item);
    });

    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Pega tudo que está no objeto e transforma para string
}
// Loads In Cart 
function loadCartItems() {
    const cartItems = localStorage.getItem('cartItems');

    if (cartItems) {
        const parsedCartItems = JSON.parse(cartItems);

        parsedCartItems.forEach(item => {
            addProductToCart(item.title, item.price, item.productImg);

            const cartBoxes = document.getElementsByClassName('cart-box');
            const cartBox = cartBoxes[cartBoxes.length - 1];
            const quantityElement = cartBox.querySelector('.cart-quantity');
            quantityElement.value = item.quantity;
        });
    }

    const cartTotal = localStorage.getItem('cartTotal');
    if (cartTotal) {
        document.querySelector('.total-price').innerText = "$" + cartTotal;
    }

    updateCartIcon();
}

// Quantity In Cart Icon 
//A função itera pelos elementos do carrinho e obtém a quantidade de cada item.
function updateCartIcon() {
    const cartBoxes = document.getElementsByClassName('cart-box');
    let quantity = 0;

    Array.from(cartBoxes).forEach(cartBox => {
        const quantityElement = cartBox.querySelector('.cart-quantity');
        quantity += parseInt(quantityElement.value);
    });

    if (quantity === 0) {
        quantity = 0;
    }

    const cartIcon = document.querySelector('#cart-icon');
    cartIcon.setAttribute('data-quantity', quantity);
}
