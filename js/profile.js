// función pa' cargar los datos de "información personal"
function loadProfileComponents() {
  // elementos que conforman el apartado de "información personal" en la página de "mi cuenta"
  const profileInfoElements = {
    name: document.getElementById('name'),
    surname: document.getElementById('last-name'),
    idNumber: document.getElementById('ID-number'),
    address: {
      street: document.getElementById('street'),
      apartment: document.getElementById('apartment'),
      city: document.getElementById('city'),
    },
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    usernameProfile: document.getElementById('username'),
    usernameDisplay: localStorage.getItem('user'),
    updateInfoButton: document.getElementById('save-user-info'),
  }
  const storedPersonalInfo = localStorage.getItem('personalInfo');
  const isAuthenticated = localStorage.getItem('auth');

  // evento para actualizar la info agregada con el botón "Actualizar información"
  profileInfoElements.updateInfoButton.addEventListener('click', () => {
    const profileInfo = {
      name: profileInfoElements.name.value,
      surname: profileInfoElements.surname.value,
      idNumber: profileInfoElements.idNumber.value,
      email: profileInfoElements.email.value,
      phone: profileInfoElements.phone.value,
      street: profileInfoElements.address.street.value,
      apartment: profileInfoElements.address.apartment.value,
      city: profileInfoElements.address.city.value,
      usernameProfile: profileInfoElements.usernameProfile.value = profileInfoElements.usernameDisplay,
    }
    localStorage.setItem('personalInfo', JSON.stringify(profileInfo));
  });

  // chekea si se está logueado y si existe información guardada para agarrar esa info y mostrarla en los campos
  if (isAuthenticated && storedPersonalInfo) {
    const profileInfo = JSON.parse(storedPersonalInfo);
    
    profileInfoElements.name.value = profileInfo.name || '';
    profileInfoElements.surname.value = profileInfo.surname || '';
    profileInfoElements.idNumber.value = profileInfo.idNumber || '';
    profileInfoElements.email.value = profileInfo.email || '';
    profileInfoElements.phone.value = profileInfo.phone || '';
    profileInfoElements.address.street.value = profileInfo.street || '';
    profileInfoElements.address.apartment.value = profileInfo.apartment || '';
    profileInfoElements.address.city.value = profileInfo.city || '';
    profileInfoElements.usernameProfile.value = profileInfoElements.usernameDisplay || '';
  }
}

// carga la función
window.addEventListener('DOMContentLoaded', loadProfileComponents);
