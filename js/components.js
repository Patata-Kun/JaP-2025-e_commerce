// init de las constantes necesarias para la API (llamadas a la API)
const categoriesURL = "https://patata-kun.github.io/e-mercado-API/cats/cat.json"

const productsURL = "https://patata-kun.github.io/e-mercado-API/cats_products/"
const productInfoURL = "https://patata-kun.github.io/e-mercado-API/products/"
const productCommentsURL = "https://patata-kun.github.io/e-mercado-API/products_comments/"
const publishProductURL  = "https://patata-kun.github.io/e-mercado-API/sell/publish.json"

const cartInfoURL = "https://patata-kun.github.io/e-mercado-API/user_cart/"
const cartBuyURL = "https://patata-kun.github.io/e-mercado-API/cart/buy.json"

const USDValueUY = "https://uy.dolarapi.com/v1/cotizaciones/usd"

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

// función para actualizar el nombre de usuario en el navbar
function updateNavbarUser() {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  const loggedUser = localStorage.getItem("user");
  const usernameDisplay = document.getElementById("navbar-user");
  const logInLink = document.getElementById("log-in-link");
  const logOutLink = document.getElementById("log-out-link");
  const profileLink = document.getElementById("profile-link");
  const navbarAvatar = document.getElementById("navbar-avatar");
  const navbarAccountButton = document.getElementsByClassName("dropdown-button")[0];

  if (isAuthenticated && usernameDisplay) {
    usernameDisplay.innerHTML = `
      <div class="account-avatar" id="navbar-avatar"></div>
      ${loggedUser} <i class="ph-bold ph-caret-down"></i>
    `;

    logInLink.remove();
  };

  if (!isAuthenticated) {
    logOutLink.remove();
    profileLink.remove();
    navbarAvatar.remove();

    navbarAccountButton.style.padding = "0.25rem 0.75rem 0.25rem 0.75rem";
  };

  logOutLink.addEventListener('click', () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    window.location.href = "../index.html";
  });
}

// carga la navbar y el footer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('navbar')) {
    loadComponent('navbar', 'navbar').then(() => {
      // configura la navegación activa después de cargar la navbar
      setupActiveNavigation();
      // inicializa el menú hamburger
      initMobileMenu();
      // actualiza el nombre de usuario
      updateNavbarUser();
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