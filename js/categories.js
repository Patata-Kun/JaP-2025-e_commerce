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

// función para setear el id de la categoría seleccionada y redirigir a products.html
function setCatID(id) {
  localStorage.setItem('catID', id);
  window.location = "products.html";
}

// función que muestra las categorías en categories.html
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
                  <p>${category.productCount} artículos</p>
                </div>
              </div>
            </div>
            `;
  }
  document.getElementById("categories-list").innerHTML = htmlCategoriesContent;
}

// función que carga las categorías al cargar completamente la página
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

const filterButton = document.getElementById('filter-button'); //BUSCA EN HTML EL ELEMENTO SEGUN LA ID "filter-button", QUE ES EL BOTÓN FILTRAR//
const minPriceInput = document.getElementById('min-price'); //BUSCA EN HTML EL INPUT SEGUN LA ID "min-price"//
const maxPriceInput = document.getElementById('max-price'); //BUSCA EN HTML EL INPUT SEGUN LA ID "max-price"//
let currentProductsArray = [];



