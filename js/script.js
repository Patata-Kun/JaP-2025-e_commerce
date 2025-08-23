fetch('js/products.json') 
  .then(response => response.json())
  .then(data => {
    const wrapper = document.getElementById('cars-wrapper');
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
  .catch(error => console.error('Error al cargar JSON:', error));