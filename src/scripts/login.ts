document
  .getElementById("loginForm")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Успешный вход!");
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } else {
      alert(data.message);
    }
  });
