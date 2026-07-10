/* =====================================================
   Register Page JavaScript
   This file controls register.html
===================================================== */


/* =====================================================
   Password Visibility
===================================================== */

function togglePw(inputId) {
    const input = document.getElementById(inputId);

    if (!input) return;

    input.type = input.type === "password"
        ? "text"
        : "password";
}


/* =====================================================
   Password Strength
===================================================== */

function checkStr(password) {

    const fill = document.getElementById("strFill");
    const label = document.getElementById("strLbl");

    if (!fill || !label) return;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        {
            width: "0%",
            color: "#e5e7eb",
            text: ""
        },
        {
            width: "25%",
            color: "#ef4444",
            text: "Weak"
        },
        {
            width: "50%",
            color: "#f59e0b",
            text: "Fair"
        },
        {
            width: "75%",
            color: "#3b82f6",
            text: "Good"
        },
        {
            width: "100%",
            color: "#22c55e",
            text: "Strong"
        }
    ];

    const current = levels[score];

    fill.style.width = current.width;
    fill.style.background = current.color;
    label.textContent = current.text;

}


/* =====================================================
   Error Handling
===================================================== */

function showErr(id, message = "Required") {

    const input = document.getElementById(id);
    const err = document.getElementById("e-" + id);

    if (input) {
        input.classList.add("err");
    }

    if (err) {
        err.textContent = message;
        err.classList.add("show");
    }

}


function clearAll() {

    document.querySelectorAll(".ferr").forEach(error => {
        error.classList.remove("show");
    });

    document.querySelectorAll("input").forEach(input => {
        input.classList.remove("err");
    });

    const alertBox = document.getElementById("alertBox");

    if (alertBox) {
        alertBox.className = "alert-box";
        alertBox.textContent = "";
    }

}


function showAlert(type, message) {

    const alertBox = document.getElementById("alertBox");

    if (!alertBox) return;

    alertBox.className = "alert-box " + type;
    alertBox.textContent = message;

}


/* =====================================================
   Register Account
===================================================== */

function doRegister() {

    clearAll();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const email = document.getElementById("email").value.trim();
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("password").value;
    const confirmPw = document.getElementById("confirmPw").value;
    const terms = document.getElementById("terms").checked;

    let valid = true;

    if (!firstName) {
        showErr("firstName");
        valid = false;
    }

    if (!lastName) {
        showErr("lastName");
        valid = false;
    }

    if (!username) {
        showErr("username");
        valid = false;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        showErr("email", "Invalid email");
        valid = false;
    }

    if (!dob) {
        showErr("dob");
        valid = false;
    }

    if (password.length < 8) {
        showErr("password", "Minimum 8 characters");
        valid = false;
    }

    if (password !== confirmPw) {
        showErr("confirmPw", "Passwords do not match");
        valid = false;
    }

    if (!terms) {
        showAlert("bad", "Please accept the Terms of Service.");
        return;
    }

    if (!valid) return;


    /* ===========================================
       Save User
    =========================================== */

    const users = JSON.parse(localStorage.getItem("mb_users") || "{}");

    if (users[username]) {

        showErr("username", "Username already exists");
        return;

    }

    users[username] = {

        firstName,
        lastName,
        username,
        email,
        dob,
        password,
        createdAt: new Date().toISOString()

    };

    localStorage.setItem("mb_users", JSON.stringify(users));


    /* ===========================================
       Auto Login
    =========================================== */

    localStorage.setItem(

        "mb_session",

        JSON.stringify({

            username,
            firstName,
            lastName

        })

    );


    /* ===========================================
       Success
    =========================================== */

    showAlert(

        "ok",

        "Registration successful! Redirecting..."

    );

    setTimeout(() => {

        window.location.href = "index.html";

    }, 1500);

}


/* =====================================================
   Event Listeners
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const password = document.getElementById("password");

    if (password) {

        password.addEventListener("input", function () {

            checkStr(this.value);

        });

    }

});