// espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', async () => {
  const ProdID = localStorage.getItem('ProdID');

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
    relatedProductsGrid: document.getElementById("related-products-grid"),
    
    colorsButton: document.getElementById("button-color"),
    versionsButton: document.getElementById("button-version")
  };

  try {
      const response = await fetch(productInfoURL + localStorage.getItem('ProdID') + '.json', {
    headers: {
     Authorization: localStorage.getItem("token")
   }
    });


    if (!response.ok) {throw new Error("Error fetching product data");}

    const productData = await response.json();

    renderProductInfo(productData, productElements);
    renderRelatedProducts(productData.relatedProducts, productElements.relatedProductsGrid);

    } catch (error) {
      console.warn("Error loading product info:", error);
      
      document.getElementsByClassName("products-container")[0].style.display = "none";
      document.getElementsByClassName("product-add-review")[0].style.display = "none";
      document.getElementsByClassName("product-reviews")[1].style.display = "none";

      const errorMessageContainer = document.createElement("div");
      errorMessageContainer.classList.add("categories-title");
      const errorMessageTitle = document.createElement("h1");
      const errorMessageText = document.createElement("p");

      errorMessageTitle.textContent = "Error al cargar la información del producto";
      errorMessageText.textContent = "Lo sentimos, no se pudo cargar la información del producto en este momento. Por favor, inténtelo de nuevo más tarde.";

      errorMessageContainer.appendChild(errorMessageTitle);
      errorMessageContainer.appendChild(errorMessageText);

      document.getElementsByClassName("main-content")[0].appendChild(errorMessageContainer);
    }

  try {
    const commentsResponse = await fetch(productCommentsURL + localStorage.getItem('ProdID') + '.json', {
  headers: {
    Authorization: localStorage.getItem("token")
  }
});

    if (!commentsResponse.ok) {throw new Error("Error fetching product comments");}

    const commentsData = await commentsResponse.json();

    renderProductComments(commentsData, productElements.comments);
    productStars(commentsData, productElements.stars, productElements.stars);

    } catch (error) {
      console.warn('Error loading product comments:', error);
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

  if (!product.color) {
    productElements.colorsButton.style.display = 'none';
  }

  if (!product.version) {
    productElements.versionsButton.style.display = 'none';
  }
};

// función para renderizar los comentarios del mismo
function renderProductComments(comments, commentsContainer) {
  
  if (!comments || comments.length === 0) {
    console.warn('No comments available to display.');
    return;
  }
  
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

  if (!relatedProducts || relatedProducts.length === 0) {
    const productnt = document.createElement('p');
    productnt.textContent = 'No hay productos relacionados disponibles.';
    relatedContainer.appendChild(productnt);
    return;
  }

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

// función para mostrar las estrellas (media según los scores de los comentarios) y la cantidad total de reviews que las producen
function productStars(comments, starsElement, reviews) {
  if (!comments || comments === undefined || comments.length === 0) {
    starsElement.innerHTML = '<i class="ph ph-star"></i>'.repeat(5);
    const reviewCount = document.createElement('h5');
    reviewCount.classList.add('product-reviews-count');
    reviewCount.textContent = '(0)';
    reviews.appendChild(reviewCount);
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


// FUNCIONALIDAD CARRITO 

document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("add-to-cart");

  if (!addToCartBtn) return;

  addToCartBtn.addEventListener("click", async () => {
    const ProdID = localStorage.getItem("ProdID");
    if (!ProdID) return;

    const response = await fetch(productInfoURL + ProdID + ".json", {
  headers: {
    Authorization: localStorage.getItem("token")
  }
    });
    if (!response.ok) return;
    const product = await response.json();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        cost: product.cost,
        currency: product.currency,
        image: product.images[0],
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCountBadge();
    alert("Producto agregado al carrito 😊");
    window.location.href = "../html/cart.html";
  });
});
