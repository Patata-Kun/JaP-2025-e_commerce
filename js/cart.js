// init de la función del valor del dólar
const USDValueUYU = "https://uy.dolarapi.com/v1/cotizaciones/usd"

fetch(USDValueUYU)
  .then(response => response.json())
  .then(data => {
    localStorage.setItem("USDValue", data.venta);
  })
  .catch(error => {
    console.error("Error al obtener el valor del dólar:", error);
  });

function validateNumberInput(input) {
  input.value = input.value.replace(/[^0-9]/g, ''); // Impide que se coloquen caracteres que no sean un número reemplazándolos por nada
  
  if (parseInt(input.value) > 100) {
    input.value = '100';
  }
  
  if (input.value === '' || parseInt(input.value) < 1) {
    input.value = '1';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('input', function(e) {
    if (e.target && e.target.matches('.cart-product-counter input')) {
      validateNumberInput(e.target);
    }
  });
});


// PARA AGREGAR X CANTIDAD DE PRODUCTOS AL CARRITO
function increaseCount(e, btn) {
  const input = btn.previousElementSibling;
  let value = parseInt(input.value, 10); // CONVIERTE EL VALOR DEL INPUT A NUMERO ENTERO

  if (value < 100) { // LIMITA EL VALOR A 100 MÁXIMO
    value = isNaN(value) ? 1 : value + 1; // SI EL VALOR NO ES UN NUMERO, QUEDA EN 1 , SINO LO AUMENTA EN 1
    input.value = value; // ACTUALIZA LO MOSTRADO EN INPUT.
    updateCartQuantity(btn, value); // GUARDA LA NUEVA CANTIDAD EN localStorage , CALCULA EL PRECIO DEL PRODUCTO Y ACTUALIZA EL VALOR EN EL CARRITO.
  }
}

//PARA QUITAR PRODUCTOS
function decreaseCount(e, btn) {
  const input = btn.nextElementSibling;
  let value = parseInt(input.value, 10); // CONVIERTE EL VALOR DEL INPUT A NUMERO ENTERO

  if (value > 1) { // LIMITA EL VALOR A 1 MÍNIMO
    value = isNaN(value) ? 1 : value - 1; // SI EL VALOR NO ES UN NUMERO, QUEDA EN 1 , SINO LE RESTA 1
    input.value = value; 
    updateCartQuantity(btn, value); 
  }
}

// ACTUALIZA LA CANTIDAD DE UN PRODUCTO EN EL CARRITO
function updateCartQuantity(btn, newQuantity) {
  const itemElement = btn.closest(".cart-product-item"); //BUSCA EL CONTENEDOR DEL PRODUCTO EN EL CUAL HICE CLICK
  const name = itemElement.querySelector(".cart-product-info h4").textContent; //BUSCA EL <h4> QUE CONTIENE EL NOMBRE DEL PRODUCTO, Y DESPUÉS ESA VARIABLE name SE LA USA PARA ENCONTRAR EL PRODUCTO EN EL localStorage.

  let cart = JSON.parse(localStorage.getItem("cart")) || []; //RECUPERA EL CARRITO DEL localStorage. SI NO HAY NADA CREA UN ARRAY VACIO
  const product = cart.find(p => p.name === name);  //BUSCA EN EL CARRITO UN NOMBRE QUE COINCIDA CON EL name DEL PRODUCTO. Y LUEGO ME LO DEVUELVE.

  if (product) { //SI LO ENCUENTRA...
    product.quantity = newQuantity; // LE DA UN NUEVO VALOR AL PRODUCTO
    localStorage.setItem("cart", JSON.stringify(cart)); //GUARDA EL CARRITO ACTUALIZADO EN localStorage
  }

//ACTUALIZA EL PRECIO
  updateCartItemPrice(itemElement, product); 
  updateCartTotal();
}


// MODIFICA EL PRECIO SEGÚN AGREGAMOS O QUITAMOS UN PRODUCTO AL CARRITO
function updateCartItemPrice(itemElement, product) { 
  const priceElement = itemElement.querySelector(".cart-product-price h4"); //AL PRODUCTO ACTUAL, LE BUSCA EL PRECIO
  priceElement.textContent = `${product.currency} ${(product.cost * product.quantity).toLocaleString('es-UY')}`; //CAMBIA EL PRECIO TOTAL, LO MULTIPLICA POR LA CANTIDAD DE ESE PRODUCTO, Y TAMBIÉN LO ADAPTA SEGÚN LA MONEDA.
}

function updateCartTotal() { //RECUPERO EL CARRITO DESDE localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

//RECORRE CADA PRODUCTO DEL CARRITO Y SEGÚN SU CANTIDAD LO MULTIPLICA POR EL PRECIO Y ME DA EL NUEVO PRECIO  
  cart.forEach(item => {
    total += item.cost * item.quantity;
  });


  const subtotalElement = document.querySelector(".cart-summary .cart-total:last-child"); 
  const productosElement = document.querySelector(".cart-summary .product-description p:first-child");

  if (subtotalElement) {
    subtotalElement.textContent = `UYU ${total.toLocaleString("es-UY")}`; //ACTUALIZA EL TOTAL EN DINERO.
  }

  if (productosElement) {
    productosElement.textContent = `Productos (${cart.length})`; // ACTUALIZA LA CANTIDAD DEL PRODUCTO CUANDO AGREGO O QUITO UNO NUEVO.
  }
}

// PARA DARLE FUNCIONALIDAD AL BOTÓN DE ELIMINAR UN PRODUCTO, USANDO SU NOMBRE COMO REFERENCIA

function removeCartItem(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));

  // PARA ACTUALIZAR EL CARRITO EN VIVO AL ELIMINAR UN PRODUCTO
  renderCart();
}

//FUNCION PARA ACTUALIZAR EL CARRITO
function renderCart() {
  const cartContainer = document.querySelector(".categories-container"); //BUSCA EL ELEMENTO CON ESA CLASE <div class="categories-container"> -- LINEA 35 cart.HTML
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSummary = document.querySelector(".cart-summary");
  const cartSubContainer = document.getElementById("cart-container");

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartSummary.style.display = "none";
    cartSubContainer.style.gridTemplateColumns = "1fr";

    cartContainer.innerHTML = "<p>Tu carrito está vacío</p>";
    return;
  }


  cartContainer.innerHTML = ""; //RECORRE EL CONTENEDOR ANTES DE RENDERIZAR

// RECORRE EL CART, Y PARA CADA PRODUCTO GUARDADO, CREA UN CONTENEDOR Y LE INSERTA LA IMAGEN, NOMBRE Y LA INFO DEL PRODUCTO.
  cart.forEach(item => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("cart-product-item");

    productDiv.innerHTML = `
      <img class="cart-product-image" src="${item.image}" alt="${item.name}">
      <div class="cart-product-details">
        <div class="cart-product-info">
          <h4>${item.name}</h4>
        </div>

        <div class="cart-product-numbers">
          <div class="cart-product-quantity">
            <div class="cart-product-counter">
              <span class="down" onclick='decreaseCount(event, this)'><i class="ph ph-minus" style="font-size: 0.75rem"></i></span>
              <input type="text" value="${item.quantity}">
              <span class="up" onclick='increaseCount(event, this)'><i class="ph ph-plus" style="font-size: 0.75rem"></i></span>
            </div>
            <button class="button-tertiary" data-name="${item.name}">
              <i class="ph-fill ph-trash"></i>
            </button>
          </div>

          <div class="cart-product-price">
            <h4>${item.currency} ${(item.cost * item.quantity).toLocaleString('es-UY')}</h4>
          </div>
        </div>
      </div>
    `;

    cartContainer.appendChild(productDiv);
  });



// PARA DARLE FUNCIÓN A LOS BOTONES DE ELIMINAR
//SELECCIONA TODOS LOS BOTONES CON ESA CLASE Y PARA CADA UNO LE AGREGA UN EVENTO AL HACER CLICK.

  document.querySelectorAll(".button-tertiary").forEach(btn => { 
    btn.addEventListener("click", (e) => {
      const name = e.currentTarget.dataset.name;
      removeCartItem(name);
    });
  });

  updateCartTotal(); 
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});

