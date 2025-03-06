document.addEventListener("DOMContentLoaded", () => {
    // Testimonial Slider
    const testimonials = document.querySelectorAll(".testimonial")
    const prevBtn = document.querySelector(".prev-btn")
    const nextBtn = document.querySelector(".next-btn")
    let currentIndex = 0
  
    // Hide all testimonials except the first one
    testimonials.forEach((testimonial, index) => {
      if (index !== 0) {
        testimonial.style.display = "none"
      }
    })
  
    // Function to show testimonial at specific index
    function showTestimonial(index) {
      testimonials.forEach((testimonial) => {
        testimonial.style.display = "none"
      })
  
      testimonials[index].style.display = "block"
      testimonials[index].classList.add("animated")
    }
  
    // Event listeners for prev/next buttons
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex--
        if (currentIndex < 0) {
          currentIndex = testimonials.length - 1
        }
        showTestimonial(currentIndex)
      })
  
      nextBtn.addEventListener("click", () => {
        currentIndex++
        if (currentIndex >= testimonials.length) {
          currentIndex = 0
        }
        showTestimonial(currentIndex)
      })
    }
  
    // Auto-rotate testimonials
    setInterval(() => {
      currentIndex++
      if (currentIndex >= testimonials.length) {
        currentIndex = 0
      }
      showTestimonial(currentIndex)
    }, 5000)
  
    // Hero section parallax effect
    const hero = document.querySelector(".hero")
  
    if (hero) {
      window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY
        if (scrollPosition < 600) {
          hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`
        }
      })
    }
  
    // Animate elements when they come into view
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".feature-card, .event-card")
  
      elements.forEach((element, index) => {
        const elementPosition = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (elementPosition < windowHeight - 50) {
          // Add staggered animation delay
          setTimeout(() => {
            element.style.opacity = "1"
            element.style.transform = "translateY(0)"
          }, index * 100)
        }
      })
    }
  
    // Set initial state for animated elements
    document.querySelectorAll(".feature-card, .event-card").forEach((element) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    })
  
    // Run animation check on load and scroll
    window.addEventListener("load", animateOnScroll)
    window.addEventListener("scroll", animateOnScroll)
  
    // Countdown timer for upcoming events
    const eventDates = document.querySelectorAll(".event-date")
  
    eventDates.forEach((date) => {
      const day = date.querySelector(".day").textContent
      const month = date.querySelector(".month").textContent
      const year = new Date().getFullYear()
  
      const eventDate = new Date(`${month} ${day}, ${year}`)
      const currentDate = new Date()
  
      // If the event date has passed, add a "past" class
      if (eventDate < currentDate) {
        date.closest(".event-card").classList.add("past-event")
      }
    })
  })
  
  