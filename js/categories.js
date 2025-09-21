// init de las constantes necesarias para la API (llamadas a la API)
const categoriesURL = "https://patata-kun.github.io/e-mercado-API/cats/cat.json"

const productsURL = "https://patata-kun.github.io/e-mercado-API/cats_products/"
const productInfoURL = "https://patata-kun.github.io/e-mercado-API/products/"
const productCommentsURL = "https://patata-kun.github.io/e-mercado-API/products_comments/"
const publishProductURL  = "https://patata-kun.github.io/e-mercado-API/sell/publish.json"

const cartInfoURL = "https://patata-kun.github.io/e-mercado-API/user_cart/"
const cartBuyURL = "https://patata-kun.github.io/e-mercado-API/cart/buy.json"

// init de las constantes y variables necesarias para el filtrado y ordenamiento de categorías
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

// Función para obtener datos JSON
function getJSONData(url) {
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(data => {
      return {
        status: "ok",
        data: data
      };
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      return {
        status: "error",
        data: null
      };
    });
}

// función de ordenamiento de categorías
function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

// función para setear el id de la categoría seleccionada y redirigir a products.html
function setCatID(id) {
  localStorage.setItem('catID', id);
  window.location = "products.html";
}

function showCategories() {
  let htmlCategoriesContent = "";
  for(let i = 0; i < currentCategoriesArray.length; i++){
      let category = currentCategoriesArray[i];

            htmlCategoriesContent += `
            <div onclick="setCatID(${category.id})" class="categories-product">
              <img class="product-image" src="${category.imgSrc}" alt="${category.description}">
              <div class="product-description">
                <h2 class="product-name"> ${category.name} </h2>
                <p>${category.description}</p>
                <div class="product-price-sold">
                  <p>${category.productCount} vendidos</p>
                </div>
              </div>
            </div>
            `;
  }
  document.getElementById("categories-list").innerHTML = htmlCategoriesContent;
}

document.addEventListener('DOMContentLoaded', function(e) {
  getJSONData(categoriesURL).then(function(resultObj) {
    if (resultObj.status === "ok") {
      currentCategoriesArray = resultObj.data;
      showCategories();
    }
});

});

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    showCategories();
}


// fetch de carga de los productos de la categoría específica (por ahora es solo de autos [101.json])
fetch(productsURL + '/101.json')
  .then(response => response.json())
  .then(data => {
    const wrapper = document.getElementById('categories-cars');
    wrapper.innerHTML = ""; 
    data.products.forEach(auto => {
      const carDiv = document.createElement('div');
      carDiv.classList.add('categories-product');

      carDiv.innerHTML = `
      <div class="categories-product">
        <img class="product-image" src=${auto.image} alt="${auto.name}">

        <div class="product-description">
          <h2 class="product-name">
            ${auto['icon-car-type'] && getCarIconPath(auto['icon-car-type']) ? 
              `<svg class="icon-car-type" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#7F7F7F" viewBox="0 0 256 256">
                <path d="${getCarIconPath(auto['icon-car-type'])}"></path>
              </svg>` : ''} 
            ${auto.name}
          </h2>
          <p>${auto.description.map(desc => `-> ${desc}`).join('<br>')}</p>
          <div class="product-price-sold">
            <div class="product-price">
              <h4> Desde: </h4>
              <h2> USD ${auto.cost.toLocaleString('es-UY')} </h2>
            </div>
            <p>${auto.soldCount} vendidos</p>
          </div>
        </div>
      </div>
      `;
      wrapper.appendChild(carDiv);
    });
  })
  .catch(error => console.error('Error loading category:', error));

// esta función asocia un ícono según el tipo de auto (car o suv)
function getCarIconPath(iconType) {
  const iconPaths = {
    'car': 'M240 104H229.2L201.42 41.5A16 16 0 00186.8 32H69.2A16 16 0 0054.58 41.5L26.8 104H16a8 8 0 000 16h8v80a16 16 0 0016 16H64a16 16 0 0016-16v-8h96v8a16 16 0 0016 16h24a16 16 0 0016-16V120h8a8 8 0 000-16ZM80 152H56a8 8 0 010-16H80a8 8 0 010 16Zm120 0H176a8 8 0 010-16h24a8 8 0 010 16ZM44.31 104 69.2 48H186.8l24.89 56Z',
    'suv': 'M248 103.47A8.17 8.17 0 00239.73 96H232a8 8 0 00-.18-1.68L221.18 44.65A16.08 16.08 0 00205.53 32H50.47A16.08 16.08 0 0034.82 44.65L24.18 94.32A8 8 0 0024 96H16.27A8.17 8.17 0 008 103.47 8 8 0 0016 112h8v88a16 16 0 0016 16H64a16 16 0 0016-16V184h20a4 4 0 004-4V128.27a8.17 8.17 0 017.47-8.25 8 8 0 018.53 8v52a4 4 0 004 4h8a4 4 0 004-4V128.27a8.17 8.17 0 017.47-8.25 8 8 0 018.53 8v52a4 4 0 004 4h20v16a16 16 0 0016 16h24a16 16 0 0016-16V112h8a8 8 0 008-8.53ZM68 144a12 12 0 1112-12A12 12 0 0168 144Zm120 0a12 12 0 1112-12 12 12 0 01-12 12ZM40.18 96 50.47 48H205.53l10.29 48Z'
  };
  return iconPaths[iconType] || null;
}

const filterButton = document.getElementById('filter-button'); //BUSCA EN HTML EL ELEMENTO SEGUN LA ID "filter-button", QUE ES EL BOTÓN FILTRAR//
const minPriceInput = document.getElementById('min-price'); //BUSCA EN HTML EL INPUT SEGUN LA ID "min-price"//
const maxPriceInput = document.getElementById('max-price'); //BUSCA EN HTML EL INPUT SEGUN LA ID "max-price"//
let currentProductsArray = [];


function renderProducts(productsList) {
  const wrapper = document.getElementById('categories-cars');
  wrapper.innerHTML = "";


  if (productsList.length === 0) {
    wrapper.innerHTML = "<p>No hay productos en este rango de precio.</p>";
    return;
  }


  productsList.forEach(auto => {
    const carDiv = document.createElement('div');
    carDiv.classList.add('categories-product');


    carDiv.innerHTML = `
      <div class="categories-product">
        <img class="product-image" src=${auto.image} alt="${auto.name}">
        <div class="product-description">
          <h2 class="product-name">
            ${auto['icon-car-type'] && getCarIconPath(auto['icon-car-type']) ?
              `<svg class="icon-car-type" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#7F7F7F" viewBox="0 0 256 256">
                <path d="${getCarIconPath(auto['icon-car-type'])}"></path>
              </svg>` : ''}
            ${auto.name}
          </h2>
          <p>${auto.description.map(desc => `-> ${desc}`).join('<br>')}</p>
          <div class="product-price-sold">
            <div class="product-price">
              <h4> Desde: </h4>
              <h2> USD ${auto.cost.toLocaleString('es-UY')} </h2>
            </div>
            <p>${auto.soldCount} vendidos</p>
          </div>
        </div>
      </div>
    `;
    wrapper.appendChild(carDiv);
  });
}


fetch(productsURL + '/101.json') // TRAE LOS PRODUCTOS DESDE EL JSON
  .then(response => response.json()) // CONVIERTE LA RESPUESTA A JSON
  .then(data => {
    currentProductsArray = data.products; // GUARDA LOS PRODUCTOS EN EL ARREGLO GLOBAL
    renderProducts(currentProductsArray); // MUESTRA LOS PRODUCTOS EN PANTALLA
  })
  .catch(error => console.error('Error loading category:', error)); // MUESTRA ERROR SI FALLA




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
