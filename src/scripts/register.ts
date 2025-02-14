document
  .getElementById("registerForm")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = (document.getElementById("firstName") as HTMLInputElement)
      .value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement)
      .value;
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        password,
        role: "student",
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Регистрация успешна!");
      window.location.href = "/login.html";
    } else {
      alert(data.message);
    }
  });
