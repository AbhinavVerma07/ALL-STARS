document.addEventListener("DOMContentLoaded", () => {
    // Contact form submission
    const contactForm = document.getElementById("contact-form")
    const formSuccess = document.querySelector(".form-success")
    const formError = document.querySelector(".form-error")
  
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        // Get form data
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const subject = document.getElementById("subject").value
        const message = document.getElementById("message").value
  
        // Simple validation
        if (!name || !email || !message) {
          alert("Please fill in all required fields")
          return
        }
  
        // Show loading state
        const submitButton = this.querySelector(".btn-submit")
        const originalText = submitButton.textContent
        submitButton.disabled = true
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  
        // Send form data to server
        fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              // Show success message
              contactForm.style.display = "none"
              formSuccess.style.display = "block"
  
              // Reset form
              contactForm.reset()
            } else {
              // Show error message
              formError.style.display = "block"
  
              // Reset button state
              submitButton.disabled = false
              submitButton.textContent = originalText
            }
          })
          .catch((error) => {
            console.error("Error submitting form:", error)
  
            // Show error message
            formError.style.display = "block"
  
            // Reset button state
            submitButton.disabled = false
            submitButton.textContent = originalText
          })
      })
    }
  
    // New message button
    const btnNewMessage = document.querySelector(".btn-new-message")
  
    if (btnNewMessage) {
      btnNewMessage.addEventListener("click", () => {
        formSuccess.style.display = "none"
        contactForm.style.display = "block"
      })
    }
  
    // Try again button
    const btnTryAgain = document.querySelector(".btn-try-again")
  
    if (btnTryAgain) {
      btnTryAgain.addEventListener("click", () => {
        formError.style.display = "none"
      })
    }
  
    // FAQ accordion
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
  
      question.addEventListener("click", function () {
        // Toggle active class
        item.classList.toggle("active")
  
        // Toggle icon
        const icon = this.querySelector(".faq-toggle i")
  
        if (item.classList.contains("active")) {
          icon.classList.remove("fa-plus")
          icon.classList.add("fa-minus")
        } else {
          icon.classList.remove("fa-minus")
          icon.classList.add("fa-plus")
        }
      })
    })
  
    // Map placeholder
    const mapPlaceholder = document.querySelector(".map-placeholder")
  
    if (mapPlaceholder) {
      mapPlaceholder.innerHTML = `
        <i class="fas fa-map-marked-alt"></i>
        <p>Interactive map would be displayed here</p>
        <p class="map-note">Using a service like Google Maps or Mapbox</p>
      `
    }
  
    // Animate contact cards on scroll
    const contactCards = document.querySelectorAll(".contact-card")
  
    function animateCards() {
      contactCards.forEach((card, index) => {
        const cardPosition = card.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (cardPosition < windowHeight - 50) {
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, index * 150)
        }
      })
    }
  
    // Set initial state for animated elements
    contactCards.forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(30px)"
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    })
  
    // Run animation check on load and scroll
    window.addEventListener("load", animateCards)
    window.addEventListener("scroll", animateCards)
  })
  
  