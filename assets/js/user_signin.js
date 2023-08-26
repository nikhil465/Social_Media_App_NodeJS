// Sign In form submission handler
document
  .getElementById("signin-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve user input
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Perform sign-in logic (e.g., make an API request)

    // Clear form fields
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  });
