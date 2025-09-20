// init de las constantes necesarias para la API
const categoriesURL = "https://patata-kun.github.io/e-mercado-API/cats/cat.json"

const productsURL = "https://patata-kun.github.io/e-mercado-API/cats_products/"
const productInfoURL = "https://patata-kun.github.io/e-mercado-API/products/"
const productCommentsURL = "https://patata-kun.github.io/e-mercado-API/products_comments/"
const publishProductURL  = "https://patata-kun.github.io/e-mercado-API/sell/publish.json"

const cartInfoURL = "https://patata-kun.github.io/e-mercado-API/user_cart/"
const cartBuyURL = "https://patata-kun.github.io/e-mercado-API/cart/buy.json"

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

// ↓ copiado del workspace inicial de JaP ↓
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

// esta función asocia un ícono según el tipo de auto (car o suv)
function getCarIconPath(iconType) {
  const iconPaths = {
    'car': 'M240 104H229.2L201.42 41.5A16 16 0 00186.8 32H69.2A16 16 0 0054.58 41.5L26.8 104H16a8 8 0 000 16h8v80a16 16 0 0016 16H64a16 16 0 0016-16v-8h96v8a16 16 0 0016 16h24a16 16 0 0016-16V120h8a8 8 0 000-16ZM80 152H56a8 8 0 010-16H80a8 8 0 010 16Zm120 0H176a8 8 0 010-16h24a8 8 0 010 16ZM44.31 104 69.2 48H186.8l24.89 56Z',
    'suv': 'M248 103.47A8.17 8.17 0 00239.73 96H232a8 8 0 00-.18-1.68L221.18 44.65A16.08 16.08 0 00205.53 32H50.47A16.08 16.08 0 0034.82 44.65L24.18 94.32A8 8 0 0024 96H16.27A8.17 8.17 0 008 103.47 8 8 0 0016 112h8v88a16 16 0 0016 16H64a16 16 0 0016-16V184h20a4 4 0 004-4V128.27a8.17 8.17 0 017.47-8.25 8 8 0 018.53 8v52a4 4 0 004 4h8a4 4 0 004-4V128.27a8.17 8.17 0 017.47-8.25 8 8 0 018.53 8v52a4 4 0 004 4h20v16a16 16 0 0016 16h24a16 16 0 0016-16V112h8a8 8 0 008-8.53ZM68 144a12 12 0 1112-12A12 12 0 0168 144Zm120 0a12 12 0 1112-12 12 12 0 01-12 12ZM40.18 96 50.47 48H205.53l10.29 48Z'
  };
  return iconPaths[iconType] || null;
}

// // fetch de carga del título de la categoría específica
// const categoryId = localStorage.getItem('catID') || null;


// fetch(categoriesURL)
//   .then(response => response.json())
//   .then(data => {
//     const categoriesTitle = document.querySelector('.categories-title');
//     if (categoriesTitle) {
//       const selectedCategory = data.find(category => category.id == categoryId);
      
//       if (selectedCategory) {
//         categoriesTitle.innerHTML = `
//           <div class="category-item">
//             <h1>${selectedCategory.name}</h1>
//             <p>${selectedCategory.description}</p>
//           </div>
//         `;
//       } else {
//         console.warn(`Categoría con ID ${categoryId} no encontrada`);
//       }
//     }
//   })
//   .catch(error => console.error('Error al cargar títulos:', error));
  

// fetch de carga de las categorías mostradas en categories.html
// fetch (categoriesURL)
//   .then(response => response.json())
//   .then(data => {
//     const categoriesList = document.querySelector('.categories-container');

//   })
//   .catch(error => console.error('Error al cargar las categorías:', error));

function setCatID(id) {
  localStorage.setItem('catID', id);
  window.location = "products.html";
}

// const categoryId = localStorage.getItem('catID') || null

function showCategories() {
  let htmlCategoriesContent = "";
  for(let i = 0; i < currentCategoriesArray.length; i++){
      let category = currentCategoriesArray[i];

            htmlCategoriesContent += `
            <div class="categories-product" data-cat-id="${category.id}">
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

  // Add event listeners to category items
  const categoryItems = document.querySelectorAll('.categories-product[data-cat-id]');
  categoryItems.forEach(item => {
    item.addEventListener('click', function() {
      const catId = this.getAttribute('data-cat-id');
      setCatID(catId);
    });
  });
}

document.addEventListener('DOMContentLoaded', function(e) {
  getJSONData(categoriesURL).then(function(resultObj) {
    if (resultObj.status === "ok") {
      currentCategoriesArray = resultObj.data;
      showCategories();
    }
});

});


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

const filterButton = document.getElementById('filter-button');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
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

fetch(productsURL + '/101.json')
  .then(response => response.json())
  .then(data => {
    currentProductsArray = data.products;
    renderProducts(currentProductsArray);
  })
  .catch(error => console.error('Error loading category:', error));

filterButton.addEventListener('click', () => {
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

  const filtered = currentProductsArray.filter(p => p.cost >= minPrice && p.cost <= maxPrice);
  renderProducts(filtered);
});

