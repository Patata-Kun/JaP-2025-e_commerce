document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    if (usuario && contraseña) {
      // Redirección ficticia
      window.location.href = "index.html";
    } else {
      alert("Por favor, complete todos los campos.");
    }
  });
});
