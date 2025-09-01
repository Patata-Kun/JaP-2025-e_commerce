fetch('../js/productsCars.json') 
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
          <h2>
            <svg class="icon-car-type" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#7F7F7F" viewBox="0 0 256 256">
              <path d="M240,104H229.2L201.42,41.5A16,16,0,0,0,186.8,32H69.2a16,16,0,0,0-14.62,9.5L26.8,104H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16v-8h96v8a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V120h8a8,8,0,0,0,0-16ZM80,152H56a8,8,0,0,1,0-16H80a8,8,0,0,1,0,16Zm120,0H176a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16ZM44.31,104,69.2,48H186.8l24.89,56Z"></path>
            </svg> 
            ${auto.name}
          </h2>
          <p>${auto.description.map(desc => `-> ${desc}`).join('<br>')}</p>
          <div class="product-price-sold">
            <div class="product-price">
              <h4> Desde: </h4>
              <h2> USD ${auto.cost} </h2>
            </div>
            <p>${auto.soldCount} vendidos</p>
          </div>
        </div>
      </div>
      `;
      wrapper.appendChild(carDiv);
    });
  })
  .catch(error => console.error('Error al cargar JSON:', error));





















/*fetch('./js/productsCars.json') 
  .then(response => response.json())
  .then(data => {
    const wrapper = document.getElementById('categories-cars');
    data.products.forEach(auto => {
      const carDiv = document.createElement('div');
      carDiv.classList.add('cars');
      carDiv.innerHTML = `
        <div class="images"><img src="${auto.image}" alt="${auto.name}"></div>
        <div class="container1">
          <h2><img src="https://cdn.prod.website-files.com/62a3558d1a7510cfd014d40d/63761001d30a64a6941a2c61_sedan-car-model.webp" class="icono-h2" alt=""> ${auto.name}</h2>
          <p>${auto.description.join('<br>')}</p>
          <div class="priceValueSold">
              <div class="priceParagraph">Desde:</div>
              <div class="price">USD ${auto.cost}</div>
              <div class="soldCount">${auto.soldCount}</div>
            </div>         
          </div>
        </div>
      `;
      wrapper.appendChild(carDiv);
    });
  })
  .catch(error => console.error('Error al cargar JSON:', error));*/