document
  .getElementById("showRegisterForm")
  .addEventListener("click", function () {
    document.getElementById("registerFormContainer").style.display = "block";
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Здесь вы можете добавить логику для отправки данных на сервер
    console.log("Вход:", { username, password });
  });

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const registerUsername = document.getElementById("registerUsername").value;
    const registerPassword = document.getElementById("registerPassword").value;

    // Здесь вы можете добавить логику для отправки данных на сервер
    console.log("Регистрация:", {
      firstName,
      lastName,
      registerUsername,
      registerPassword,
    });
  });
