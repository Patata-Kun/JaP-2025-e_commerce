// espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', async () => {
  const ProdID = localStorage.getItem('ProdID');

  // verifica si existe un id de producto; muestra error si no
  if (!ProdID) {
    console.error('No hay ID de producto en localStorage');
    return;
  }

// constante array de los elementos necesarios para la info de los productos; así no se está constantemente llamando a cada uno a través de "getElementById" (también es más fácil de entender el código después)
  const productElements = {
    name: document.getElementById("product-name"),
    category: document.getElementById("product-category"),
    description: document.getElementById("product-description"),
    price: document.getElementById("product-price"),
    soldCount: document.getElementById("product-sold-count"),
    stars: document.getElementById("product-stars"),
    carouselInner: document.getElementById("product-carousel"),
    comments: document.getElementById("product-reviews"),
    relatedProductsGrid: document.getElementById("related-products-grid")
  };

  try {
    const response = await fetch(productInfoURL + localStorage.getItem  ('ProdID') + '.json');

    if (!response.ok) {throw new Error("Error fetching product data");}
    const productData = await response.json();

    renderProductInfo(productData, productElements);
    renderRelatedProducts(productData.relatedProducts, productElements.relatedProductsGrid);

    } catch (error) {
    console.error('Error loading product info:', error);
    }

  try {
    const commentsResponse = await fetch(productCommentsURL + localStorage. getItem('ProdID') + '.json');

    if (!commentsResponse.ok) {throw new Error("Error fetching product  comments");}
    const commentsData = await commentsResponse.json();

    renderProductComments(commentsData, productElements.comments);
    productStars(commentsData, productElements.stars, productElements.stars);

    } catch (error) {
    console.error('Error loading product comments:', error);
  }

});

// función poara renderizar la info del producto
function renderProductInfo(product, productElements) {
  productElements.name.textContent = product.name;
  productElements.category.textContent = product.category;
  productElements.description.innerHTML =
    Array.isArray(product.description)
      ? product.description.flatMap(line => line.replace(/^(.+?)->/, '<strong>$1</strong>->')).join('<br>')
      : product.description
        ? `${product.description}`
        : ''

  productElements.price.textContent = product.currency + ' ' + product.cost.toLocaleString('es-UY');
  productElements.soldCount.textContent = product.soldCount + ' vendidos';

  product.images.forEach((item, index) => {
    const carouselImage = document.createElement('img');
    
    carouselImage.classList.add("carousel-image");
    carouselImage.src = item;
    carouselImage.alt = `Imagen ${index + 1} del producto ${product.name.toLowerCase()}`;

    productElements.carouselInner.appendChild(carouselImage);
  });
};

// función para renderizar los comentarios del mismo
function renderProductComments(comments, commentsContainer) {
  comments.reverse();
  
  comments.forEach(comment => {
    const reviewCard = document.createElement('div');
    reviewCard.classList.add('review-card');

    reviewCard.innerHTML = `
      <div class="review-header">
        <span class="review-author">${comment.user}</span>
        <span class="review-date">— ${comment.dateTime}</span>
        <div class="review-stars">${'<i class="ph-fill ph-star"></i>'.repeat(comment.score)}${'<i class="ph ph-star"></i>'.repeat(5 - comment.score)}</div>
      </div>
      <p class="review-text">${comment.description}</p>
    `;

    commentsContainer.appendChild(reviewCard);
  });
};

// función para renderizar productos relacionados
function renderRelatedProducts(relatedProducts, relatedContainer) {


  relatedProducts.forEach(relatedProduct => {
    const relatedProductItem = document.createElement('div');
    relatedProductItem.classList.add('related-product-item');
    relatedProductItem.setAttribute('ProdID', relatedProduct.id);

    relatedProductItem.innerHTML = `
      <img src="${relatedProduct.image}" alt="${relatedProduct.name}">
      <p class="related-product-name"> ${relatedProduct.name} </p>
      <h2 class="related-product-price"> ${relatedProduct.currency} ${relatedProduct.cost.toLocaleString('es-UY')} </h2>
    `;

    relatedProductItem.addEventListener('click', () => {
      localStorage.setItem('ProdID', relatedProduct.id);
      location.reload();
    });

    relatedContainer.appendChild(relatedProductItem);
  });
};

function productStars(comments, starsElement, reviews) {
  if (!comments || comments === undefined || comments.length === 0) {
    starsElement.innerHTML = '<i class="ph ph-star"></i>'.repeat(5);
    return;
  }

  const totalScore = comments.reduce(
    (sum, comment) => sum + comment.score, 0
  );

  const averageScore = totalScore / comments.length;
  const fullStars = Math.floor(averageScore);
  const halfStar = (averageScore % 1) >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  starsElement.innerHTML = 
    '<i class="ph-fill ph-star"></i>'.repeat(fullStars) + 
    (halfStar ? '<i class="ph-fill ph-star-half"></i>' : '') +
    '<i class="ph ph-star"></i>'.repeat(emptyStars);

  const reviewCount = document.createElement('h5');
  reviewCount.classList.add('product-reviews-count');
  reviewCount.textContent = `(${comments.length})`;
  reviews.appendChild(reviewCount);
}


