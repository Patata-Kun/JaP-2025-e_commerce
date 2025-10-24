// funciones para que funcione el counter de cantidad de un producto
function increaseCount(a, b) {
  let input = b.previousElementSibling;
  let value = parseInt(input.value, 10);

  // hace que no pueda ir más allá de 100
  if (value < 100) {
    value = isNaN(value) ? 0 : value;
    value++;
    input.value = value;
  }
}

function decreaseCount(a, b) {
  let input = b.nextElementSibling;
  let value = parseInt(input.value, 10);

  // hace que no pueda bajar más de 1
  if (value > 1) {
    value = isNaN(value) ? 0 : value;
    value--;
    input.value = value;
  }
}

function validateNumberInput(input) {
  input.value = input.value.replace(/[^0-9]/g, ''); // Impide que se coloquen caracteres que no sean un número reemplazándolos por nada
  
  if (parseInt(input.value) > 100) {
    input.value = '100';
  }
  
  if (input.value === '' || parseInt(input.value) < 1) {
    input.value = '1';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('input', function(e) {
    if (e.target && e.target.matches('.cart-product-counter input')) {
      validateNumberInput(e.target);
    }
  });
});