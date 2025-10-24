// fetch para la información de un producto 
fetch(productInfoURL + localStorage.getItem('ProdID') + '.json')
  .then(response => response.json())
  .then(data => {
    renderProductInfo(data);
  })
  .catch(error => console.error('Error loading product info:', error));

function renderProductInfo(product) {
  const productsContainer = document.getElementById('product-info');

  productsContainer.innerHTML =
  `
    <div class="product-content">
    <h1> hola </h1>
      <div class="product-description">
        <div class="product-description-title">
          <h2>${product.name}</h2>
          <h5>${product.category}</h5>
        </div>
      </div>
    </div>
  `;
}