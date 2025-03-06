document.addEventListener("DOMContentLoaded", () => {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll(".toggle-password")
  
    togglePasswordButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const passwordInput = this.parentElement.querySelector("input")
        const icon = this.querySelector("i")
  
        if (passwordInput.type === "password") {
          passwordInput.type = "text"
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          passwordInput.type = "password"
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    })
  
    // Password strength meter
    const passwordInput = document.getElementById("password")
    const strengthMeter = document.querySelector(".strength-meter")
    const strengthText = document.querySelector(".strength-text")
  
    if (passwordInput && strengthMeter && strengthText) {
      passwordInput.addEventListener("input", function () {
        const password = this.value
        const strength = checkPasswordStrength(password)
  
        // Update strength meter
        const segments = strengthMeter.querySelectorAll(".strength-segment")
  
        segments.forEach((segment, index) => {
          if (index < strength.score) {
            segment.style.backgroundColor = strength.color
          } else {
            segment.style.backgroundColor = "#e0e0e0"
          }
        })
  
        // Update strength text
        strengthText.textContent = `Password strength: ${strength.label}`
        strengthText.style.color = strength.color
      })
    }
  
    // Login form submission
    const loginForm = document.getElementById("login-form")
  
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const errorDiv = document.querySelector(".form-error")
        const errorMessage = document.getElementById("error-message")
  
        // Simple validation
        if (!email || !password) {
          errorDiv.style.display = "flex"
          errorMessage.textContent = "Please enter both email and password."
          return
        }
  
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]')
        const originalText = submitButton.textContent
        submitButton.disabled = true
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...'
  
        // Send login request to the server
        fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              // Redirect to dashboard on success
              window.location.href = "/dashboard"
            } else {
              // Show error message
              errorDiv.style.display = "flex"
              errorMessage.textContent = data.message || "Invalid email or password. Please try again."
            }
  
            // Reset button state
            submitButton.disabled = false
            submitButton.textContent = originalText
          })
          .catch((error) => {
            console.error("Login error:", error)
            errorDiv.style.display = "flex"
            errorMessage.textContent = "Server error. Please try again later."
  
            // Reset button state
            submitButton.disabled = false
            submitButton.textContent = originalText
          })
      })
    }
  
    // Registration form submission
    const registerForm = document.getElementById("register-form")
  
    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const confirmPassword = document.getElementById("confirm-password").value
        const termsCheckbox = document.getElementById("terms")
        const errorDiv = document.querySelector(".form-error")
        const errorMessage = document.getElementById("error-message")
  
        // Simple validation
        if (!name || !email || !password || !confirmPassword) {
          errorDiv.style.display = "flex"
          errorMessage.textContent = "Please fill in all fields."
          return
        }
  
        if (password !== confirmPassword) {
          errorDiv.style.display = "flex"
          errorMessage.textContent = "Passwords do not match."
          return
        }
  
        if (!termsCheckbox.checked) {
          errorDiv.style.display = "flex"
          errorMessage.textContent = "You must agree to the Terms of Service and Privacy Policy."
          return
        }
  
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]')
        const originalText = submitButton.textContent
        submitButton.disabled = true
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...'
  
        // Send registration request to the server
        fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              // Redirect to login page with success message
              window.location.href = "/login.html?registered=true"
            } else {
              // Show error message
              errorDiv.style.display = "flex"
              errorMessage.textContent = data.message || "Registration failed. Please try again."
  
              // Reset button state
              submitButton.disabled = false
              submitButton.textContent = originalText
            }
          })
          .catch((error) => {
            console.error("Registration error:", error)
            errorDiv.style.display = "flex"
            errorMessage.textContent = "Server error. Please try again later."
  
            // Reset button state
            submitButton.disabled = false
            submitButton.textContent = originalText
          })
      })
    }
  
    // Check for registration success message
    if (window.location.search.includes("registered=true")) {
      const loginForm = document.getElementById("login-form")
      if (loginForm) {
        const successMessage = document.createElement("div")
        successMessage.className = "form-success"
        successMessage.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>Registration successful! Please log in with your new account.</span>
        `
        loginForm.insertBefore(successMessage, loginForm.firstChild)
  
        // Remove the query parameter from URL
        const url = new URL(window.location)
        url.searchParams.delete("registered")
        window.history.replaceState({}, "", url)
      }
    }
  
    // Password strength checker function
    function checkPasswordStrength(password) {
      // Initialize result
      const result = {
        score: 0,
        label: "Weak",
        color: "#dc3545",
      }
  
      // No password
      if (!password) {
        return result
      }
  
      // Calculate score based on various criteria
      let score = 0
  
      // Length check
      if (password.length >= 8) score++
      if (password.length >= 12) score++
  
      // Complexity checks
      if (/[A-Z]/.test(password)) score++ // Has uppercase
      if (/[a-z]/.test(password)) score++ // Has lowercase
      if (/[0-9]/.test(password)) score++ // Has number
      if (/[^A-Za-z0-9]/.test(password)) score++ // Has special char
  
      // Determine strength label and color based on score
      if (score <= 2) {
        result.score = 1
        result.label = "Weak"
        result.color = "#dc3545"
      } else if (score <= 4) {
        result.score = 2
        result.label = "Moderate"
        result.color = "#ffc107"
      } else if (score <= 6) {
        result.score = 3
        result.label = "Strong"
        result.color = "#28a745"
      } else {
        result.score = 4
        result.label = "Very Strong"
        result.color = "#198754"
      }
  
      return result
    }
  })
  
  