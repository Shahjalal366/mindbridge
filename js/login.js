/* =====================================================
   Login Page JavaScript
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.log("loginForm not found");
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
      const loginValue = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value;

      const users = JSON.parse(localStorage.getItem("mb_users") || "{}");

      // Find user by username OR email
      let matchedUser = null;
      let matchedUsername = null;

      for (const username in users) {

          const user = users[username];

          if (
              username.toLowerCase() === loginValue ||
              (user.username && user.username.toLowerCase() === loginValue) ||
              (user.email && user.email.toLowerCase() === loginValue)
          ) {
              matchedUser = user;
              matchedUsername = username;
              break;
          }
      }

      if (!matchedUser || matchedUser.password !== password) {
          alert("Incorrect username/email or password.");
          return;
      }

      // Login success
      localStorage.setItem("mb_session", JSON.stringify({
          username: matchedUsername,
          firstName: matchedUser.firstName,
          lastName: matchedUser.lastName,
          email: matchedUser.email
      }));

      alert("Login successful!");
      window.location.href = "index.html";
    });
});

function togglePw(inputId) {
    const input = document.getElementById(inputId);

    if (!input) return;

    input.type = input.type === "password" ? "text" : "password";
}