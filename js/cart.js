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
    updateCartCountBadge(); // <-- actualiza el badge de la navbar
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
    updateCartCountBadge(); // <-- actualiza el badge de la navbar
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
  priceElement.textContent = `${product.currency} ${(product.cost * product.quantity).toLocaleString('es-UY')}`; //CAMBIA EL PRECIO TOTAL, LO MULTIPLICA POR LA CANTIDAD DE ESE PRODUCTO, Y TAMBIÉN LO ADAPTA SEGÚN LA MONEDA <- seguro?...
}

// NUEVA FUNCIÓN PARA EL ENVÍO
function getShippingPercentage() {
  // DEVUELVE EL PORCENTAJE SEGÚN EL RADIO SELECCIONADO
  if (document.getElementById("premium-shipping").checked) return 15;
  if (document.getElementById("express-shipping").checked) return 7;
  if (document.getElementById("standard-shipping").checked) return 5; // STANDARD

  else return '0';
}

function updateCartTotal() { //RECUPERO EL CARRITO DESDE localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;

//RECORRE CADA PRODUCTO DEL CARRITO Y SEGÚN SU CANTIDAD LO MULTIPLICA POR EL PRECIO Y ME DA EL NUEVO PRECIO  
  cart.forEach(item => {
    subtotal += item.cost * item.quantity;
  });
  
  const cartTotalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const productosElement = document.querySelector(".cart-summary .product-description p:first-child");
  const productsSubtotalElement = document.getElementById("cart-products-display-price");
  const shippingElement = document.getElementById("cart-shipping-price");
  const subtotalElement = document.querySelector(".cart-summary .cart-subtotal:last-child"); 
  const totalElement = document.getElementById("cart-total");

  // SUMO EL ENVÍO AL TOTAL
  const shippingPercent = getShippingPercentage(); // OBTENGO EL %
  const shippingCost = Math.round(subtotal * (shippingPercent / 100)); // CALCULO EL COSTO
  
  if (subtotalElement) {
    subtotalElement.textContent = `UYU ${(subtotal).toLocaleString("es-UY")}`;
    productsSubtotalElement.textContent = `UYU ${(subtotal).toLocaleString("es-UY")}`;
}

  if (productosElement) {
    productosElement.textContent = `Productos (${cartTotalQuantity})`; // ACTUALIZA LA CANTIDAD DEL PRODUCTO CUANDO AGREGO O QUITO UNO NUEVO.
  }

  if (totalElement) {
    totalElement.textContent = `UYU ${(subtotal + shippingCost).toLocaleString("es-UY")}`;
  }

  if (shippingElement) {
    shippingElement.textContent = `UYU ${shippingCost.toLocaleString("es-UY")}`;
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
              <span class="down" onclick='decreaseCount(event, this)'><i class="ph ph-minus"></i></span>
              <input type="text" value="${item.quantity}">
              <span class="up" onclick='increaseCount(event, this)'><i class="ph ph-plus"></i></span>
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
      updateCartCountBadge(); // <-- actualiza el badge de la navbar
    });
  });

  updateCartTotal();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  cartModalPaymentSetUp();
  cartModalPaymentShowDetails();

    // ACTUALIZA EL TOTAL CUANDO CAMBIO EL ENVÍO
  document.querySelectorAll("input[name='shipping']").forEach(radio => {
    radio.addEventListener("change", updateCartTotal);
  });
});

// modal de los métodos de pago
function cartModalPaymentSetUp() { 
  const openModalPaymentButton = document.getElementById("open-modal-payment");
  const closeModalPaymentButton = document.getElementById("close-modal-payment");
  const modalPayment = document.getElementById("modal-payment");

  openModalPaymentButton.addEventListener("click", () => {
    modalPayment.showModal();
  });
  closeModalPaymentButton.addEventListener("click", () => {
    modalPayment.close();
  });

  modalPayment.addEventListener("click", (e) => {
    const dialogDimensions = modalPayment.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modalPayment.close();
    }
  });

  // funcionalidad de los dropdowns
  const paymentDropdowns = document.querySelectorAll(".payment-method-dropdown");
  
  paymentDropdowns.forEach(dropdown => {
    const addButton = dropdown.querySelector(".payment-method-button");
    const paymentBlock = dropdown.querySelector(".payment-method-block");
    
    addButton.addEventListener('click', () => {
      paymentDropdowns.forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
          const otherPaymentBlock = otherDropdown.querySelector(".payment-method-block");
          otherPaymentBlock.classList.remove("open");
        }
      });

      paymentBlock.classList.toggle("open");
    });
  });

  // oculta los detalles del método de pago para que no se creen espacios raros
  const paymentDetailsDisplay = {
    title: document.getElementById("payment-method-display"),
    details: document.getElementById("payment-method-display-details"),
  }
  paymentDetailsDisplay.title.style.display = "none";
  paymentDetailsDisplay.details.style.display = "none";
};


// función para mostrar el método de pago seleccionado en la sección de "método de pago" del carrito
function cartModalPaymentShowDetails() {
  const paymentDetailsDisplay = {
    title: document.getElementById("payment-method-display"),
    details: document.getElementById("payment-method-display-details"),
  }

  const paymentConfig = [
    {
      buttonId: "debit-card-add",
      title: "Tarjeta de débito",
      nameId: "debit-card-name",
      numberId: "debit-card-number",
    },
    {
      buttonId: "credit-card-add",
      title: "Tarjeta de crédito",
      nameId: "credit-card-name",
      numberId: "credit-card-number",
      paymentsId: "credit-card-payments"
    },
    {
      buttonId: "bank-account-add",
      title: "Transferencia bancaria",
      nameId: "bank-account-holder",
      numberId: "bank-account-number"
    }
  ];

  function showPaymentDetails(title, name, number, payments) {
    paymentDetailsDisplay.title.style.display = "block";
    paymentDetailsDisplay.details.style.display = "block";
    paymentDetailsDisplay.title.textContent = title;
    paymentDetailsDisplay.details.textContent = payments === "" 
      ? `${name} — ${number.slice(-4)}`
      : `${name} — ${number.slice(-4)} — ${payments} cuotas`;
  }

  paymentConfig.forEach(config => {
    const addButton = document.getElementById(config.buttonId);
    if (addButton) {
      addButton.addEventListener("click", () => {
        const name = document.getElementById(config.nameId).value;
        const number = document.getElementById(config.numberId).value;
        const payments = config.paymentsId ? document.getElementById(config.paymentsId).value : "";
        showPaymentDetails(config.title, name, number, payments);

        const modalPayment = document.getElementById("modal-payment");
        modalPayment.close();
      });
    }
  });
};
