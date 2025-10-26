// función para setear el id del producto seleccionado y redirigir a product-info.html
function setProductID(id) {
  localStorage.setItem('ProdID', id);
  window.location = "product-info.html";
}

// función que asocia un ícono según el tipo de auto (car o suv)
function getCarIconPath(iconType) {
  const iconPaths = {
    'car': 'M240 104H229.2L201.42 41.5A16 16 0 00186.8 32H69.2A16 16 0 0054.58 41.5L26.8 104H16a8 8 0 000 16h8v80a16 16 0 0016 16H64a16 16 0 0016-16v-8h96v8a16 16 0 0016 16h24a16 16 0 0016-16V120h8a8 8 0 000-16ZM80 152H56a8 8 0 010-16H80a8 8 0 010 16Zm120 0H176a8 8 0 010-16h24a8 8 0 010 16ZM44.31 104 69.2 48H186.8l24.89 56Z',
    'suv': 'M248 103.47A8.17 8.17 0 00239.73 96H232a8 8 0 00-.18-1.68L221.18 44.65A16.08 16.08 0 00205.53 32H50.47A16.08 16.08 0 0034.82 44.65L24.18 94.32A8 8 0 0024 96H16.27A8.17 8.17 0 008 103.47 8 8 0 0016 112h8v88a16 16 0 0016 16H64a16 16 0 0016-16V184h20a4 4 0 004-4V128.27a8.17 8.17 0 017.47-8.25 8 8 0 018.53 8v52a4 4 0 004 4h8a4 4 0 004-4V128.27a8.17 8.17 0 017.47-8.25 8 8 0 018.53 8v52a4 4 0 004 4h20v16a16 16 0 0016 16h24a16 16 0 0016-16V112h8a8 8 0 008-8.53ZM68 144a12 12 0 1112-12A12 12 0 0168 144Zm120 0a12 12 0 1112-12 12 12 0 01-12 12ZM40.18 96 50.47 48H205.53l10.29 48Z'
  };
  return iconPaths[iconType] || null;
}

// fetch para los productos dentro de una categoría
fetch(productsURL + '/' + localStorage.getItem('catID') + '.json')
  .then(response => response.json()) // CONVIERTE LA RESPUESTA A JSON
  .then(data => {
    currentProductsArray = data.products; // GUARDA LOS PRODUCTOS EN EL ARREGLO GLOBAL
    renderProducts(currentProductsArray); // MUESTRA LOS PRODUCTOS EN PANTALLA
    // actualizar el subtítulo de la página según la categoría seleccionada
    updateProductPageSubtitle();
  })
  .catch(error => console.error('Error loading category:', error));

filterButton.addEventListener('click', () => { // EVENTO AL HACER CLIC EN EL BOTON FILTRAR
  const minPrice = parseFloat(minPriceInput.value) || 0; // OBTIENE EL PRECIO MINIMO (O 0 SI ESTA VACIO)
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity; // OBTIENE EL PRECIO MAXIMO (O INFINITO SI ESTA VACIO)

  const filtered = currentProductsArray.filter(p => p.cost >= minPrice && p.cost <= maxPrice); // FILTRA PRODUCTOS SEGUN RANGO
  renderProducts(filtered); // MUESTRA SOLO LOS PRODUCTOS FILTRADOS
});

//--- ORDENAS PRODUCTOS SEGÚN PRECIO, Y CANTIDAD DE VENDIDOS---//

const sortOptions = document.getElementById("sort-options"); // OBTIENE EL SELECT DEL ORDENAMIENTO

function sortProducts(criteria, array) { // FUNCION PARA ORDENAR PRODUCTOS
  let result = [...array]; // CREA UNA COPIA DEL ARREGLO

  if (criteria === "asc-price") { // ORDENAR POR PRECIO ASCENDENTE
    result.sort((a, b) => a.cost - b.cost);
  } else if (criteria === "desc-price") { // ORDENAR POR PRECIO DESCENDENTE
    result.sort((a, b) => b.cost - a.cost);
  } else if (criteria === "desc-sold") { // ORDENAR POR CANTIDAD DE VENTAS DEL MAS VENDIDO AL MENOS VENDIDO
    result.sort((a, b) => b.soldCount - a.soldCount);
  }
  return result; // DEVUELVE EL ARREGLO ORDENADO
}

sortOptions.addEventListener("change", () => { // EVENTO AL CAMBIAR EL SELECT DE ORDEN
  const sorted = sortProducts(sortOptions.value, currentProductsArray); // ORDENA SEGUN EL CRITERIO SELECCIONADO
  renderProducts(sorted); // MUESTRA LOS PRODUCTOS ORDENADOS
});

function renderProducts(productsList) {
  const wrapper = document.getElementById('products-list');
  wrapper.innerHTML = "";

  if (productsList.length === 0) {
    wrapper.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }

  productsList.forEach(product => {
    const productContainer = document.createElement('div');
    productContainer.classList.add('categories-product');

    productContainer.innerHTML = `
      <div onclick="setProductID(${product.id})" class="categories-product">
        <img class="product-image" src=${product.image} alt="${product.name}">
        <div class="product-description">
          <h2 class="product-name">
            ${getCarIconPath(product['icon-car-type']) ?
              `<svg class="icon-car-type" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--color-grey50)" viewBox="0 0 256 256">
                <path d="${getCarIconPath(product['icon-car-type'])}"></path>
              </svg>` : ''}
            ${product.name}
          </h2>
          <p>${
            Array.isArray(product.description)
              ? product.description.join('<br>')
              : product.description
                ? `${product.description}`
                : ''
          }</p>
          <div class="product-price-sold">
            <div class="product-price">
              <h2>${product.currency} ${product.cost.toLocaleString('es-UY')}</h2>
            </div>
            <p>${product.soldCount} vendidos</p>
          </div>
        </div>
      </div>
    `;
    wrapper.appendChild(productContainer);
  });
}

function updateProductPageSubtitle() {
  const categoriesTitleText = document.getElementById('product-title-text');

  fetch(productsURL + '/' + localStorage.getItem('catID') + '.json')
    .then(response => response.json())
    .then(category => {
      const catName = category.catName;
      categoriesTitleText.innerText = `Verás aquí todos los productos de la categoría ${catName ? String(catName).toLowerCase() : ''}.`;
    })
    .catch(error => {
      console.error('Error loading category title:', error);
    });
}

