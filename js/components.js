// init de las constantes necesarias para la API (llamadas a la API)
const categoriesURL = "http://localhost:3000/api/cats/cat.json"

const productsURL = "http://localhost:3000/api/cats_products/"
const productInfoURL = "http://localhost:3000/api/products/"
const productCommentsURL = "http://localhost:3000/api/products_comments/"
const publishProductURL  = "http://localhost:3000/api/sell/publish.json"

const cartInfoURL = "http://localhost:3000/api/user_cart/"
const cartBuyURL = "http://localhost:3000/api/cart/buy.json"


// detecta si estamos en la carpeta raíz o en una subcarpeta
const isInSubfolder = window.location.pathname.includes('/html/');

// función para cargar componentes
function loadComponent(componentName, containerId) {
  const componentPath = isInSubfolder ? `../html/${componentName}.html` : `html/${componentName}.html`;
  
  return fetch(componentPath)
    .then(response => response.text())
    .then(data => {
      document.getElementById(containerId).innerHTML = data;
      
      // Ajustar enlaces si es navbar
      if (componentName === 'navbar') {
        adjustNavbarLinks();
      }
    })
    .catch(error => {
      console.error(`Error cargando ${componentName}:`, error);
    });
}

// ajusta los enlaces de la navbar según la página en la que estés
function adjustNavbarLinks() {
  const navbar = document.getElementById('navbar');
  const links = navbar.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (isInSubfolder && href.startsWith('../')) {
      return; // Ya está correcta para subcarpetas
    } else if (!isInSubfolder && !href.startsWith('../')) {
      return; // Correcta para carpeta raíz
    } else if (isInSubfolder && !href.startsWith('../')) {
      link.setAttribute('href', '../' + href);
    } else if (!isInSubfolder && href.startsWith('../')) {
      link.setAttribute('href', href.substring(3));
    }
  });
}

// función para manejar la navegación activa
function setupActiveNavigation() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  const navLinks = navbar.querySelectorAll('a');
  const currentPage = window.location.pathname;
  
  navLinks.forEach(link => {
    // limpia las clases activas
    link.classList.remove('active');
    
    // detecta la página actual y la marca como activa
    const href = link.getAttribute('href');
    const linkPath = href.startsWith('../') ? href.substring(3) : href;
    
    if (currentPage.includes(linkPath) || 
        (currentPage.endsWith('/') && linkPath === 'index.html') ||
        (currentPage.endsWith('index.html') && linkPath === 'index.html')) {
      link.classList.add('active');
    }
    
    link.addEventListener('click', function(e) {
      // saca la clase active de todos los enlaces
      navLinks.forEach(otherLink => otherLink.classList.remove('active'));
      // agrega la clase active al enlace clickeado
      this.classList.add('active');
    });
  });
}

// función para actualizar la navbar (nombre de usuario, opciones de log in o log out, etc.)
function updateNavbar() {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  const loggedUser = localStorage.getItem("user");
  const navbarUserButton = document.getElementById("navbar-user-details");
  const logInLink = document.getElementById("log-in-link");
  const logOutLink = document.getElementById("log-out-link");
  const profileLink = document.getElementById("profile-link");
  const navbarAvatar = document.getElementById("navbar-avatar");
  const storedAvatar = localStorage.getItem('profileAvatar');

  if (isAuthenticated && navbarUserButton) {
    navbarUserButton.innerHTML = `
      <div class="account-avatar" id="navbar-avatar"></div>
      ${loggedUser} <i class="ph-bold ph-caret-down"></i>
    `;

    logInLink.remove();
    
    const navbarAvatar = document.getElementById("navbar-avatar");
    if (storedAvatar && navbarAvatar) {
      navbarAvatar.style.backgroundImage = `url(${storedAvatar})`;
      navbarAvatar.style.backgroundSize = 'cover';
      navbarAvatar.style.backgroundPosition = 'center';
    }
  };

  if (!isAuthenticated) {
    logOutLink.remove();
    profileLink.remove();
    navbarAvatar.remove();

    navbarUserButton.style.padding = "0.25rem 0.75rem 0.25rem 0.75rem";
  };

  logOutLink.addEventListener('click', () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    window.location.href = "../index.html";
  });
}

// función para actualizar el contador del carrito en la navbar
function updateCartCountBadge() {
  const cartBadge = document.getElementById('navbar-cart-badge');
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if(cartItems.length > 0) {
    const cartTotalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.innerHTML = `<i class="ph-fill ph-shopping-cart-simple"></i> ${cartTotalQuantity}`;
  } else {
    cartBadge.innerHTML = `<i class="ph-fill ph-shopping-cart-simple"></i> 0 </a>`;
  }

}

// carga la navbar y el footer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('navbar')) {
    loadComponent('navbar', 'navbar').then(() => {
      // configura la navegación activa después de cargar la navbar
      setupActiveNavigation();
      // inicializa el menú hamburger
      initMobileMenu();
      // actualiza la navbar // debería separar la función en varias pero me da paja
      updateNavbar();
      // actualiza el contador del carrito
      updateCartCountBadge();
    });
  }
  
  if (document.getElementById('footer')) {
    loadComponent('footer', 'footer');
  }
});

// responsive design
function initMobileMenu() {
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarLinks = document.getElementById('navbar-links');
  
  if (navbarToggle && navbarLinks) {
    navbarToggle.addEventListener('click', function() {
      // toggle las clases activas
      navbarToggle.classList.toggle('active');
      navbarLinks.classList.toggle('active');
    });

    // cerrar menú al hacer click en un enlace
    const links = navbarLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navbarToggle.classList.remove('active');
        navbarLinks.classList.remove('active');
      });
    });

    // cerrar menú al hacer click fuera de él
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navbarToggle.contains(event.target) || navbarLinks.contains(event.target);
      
      if (!isClickInsideNav && navbarLinks.classList.contains('active')) {
        navbarToggle.classList.remove('active');
        navbarLinks.classList.remove('active');
      }
    });

    // cerrar menú al cambiar el tamaño de ventana
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        navbarToggle.classList.remove('active');
        navbarLinks.classList.remove('active');
      }
    });
  }
}

// MODO OSCURO //
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode', null)
}

if(darkmode === "active") enableDarkmode()

if(themeSwitch) {
  themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
  })
}