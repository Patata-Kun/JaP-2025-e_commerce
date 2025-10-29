document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("user").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username !== "" && password !== "") {
      localStorage.setItem("user", username);
      localStorage.setItem("auth", true);
      window.location.href = "../index.html";
    }
  });
}); 