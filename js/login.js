document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("user").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username !== "" && password !== "") {
      
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("auth", "true");
    localStorage.setItem("user", username); 

   window.location.href = "../index.html"; 
  } else {
        alert("Usuario o contraseña incorrectos");
      }
    }
  });
});
