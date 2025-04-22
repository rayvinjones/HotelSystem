document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
  
    fetch("signup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === "success") {
        alert("Signup successful! You can now log in.");
        window.location.href = "index.html";
      } else {
        alert("Signup failed: " + data);
      }
    });
  });
  