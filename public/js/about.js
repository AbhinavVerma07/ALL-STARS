document.addEventListener("DOMContentLoaded", () => {
    // Facilities Slider
    const facilitySlides = document.querySelectorAll(".facility-slide")
    const prevBtn = document.querySelector(".facilities .prev-btn")
    const nextBtn = document.querySelector(".facilities .next-btn")
    let currentIndex = 0
  
    // Hide all slides except the first one
    facilitySlides.forEach((slide, index) => {
      if (index !== 0) {
        slide.style.display = "none"
      }
    })
  
    // Function to show slide at specific index
    function showSlide(index) {
      facilitySlides.forEach((slide) => {
        slide.style.display = "none"
      })
  
      facilitySlides[index].style.display = "block"
      facilitySlides[index].classList.add("animated")
    }
  
    // Event listeners for prev/next buttons
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex--
        if (currentIndex < 0) {
          currentIndex = facilitySlides.length - 1
        }
        showSlide(currentIndex)
      })
  
      nextBtn.addEventListener("click", () => {
        currentIndex++
        if (currentIndex >= facilitySlides.length) {
          currentIndex = 0
        }
        showSlide(currentIndex)
      })
    }
  
    // Auto-rotate slides
    setInterval(() => {
      currentIndex++
      if (currentIndex >= facilitySlides.length) {
        currentIndex = 0
      }
      showSlide(currentIndex)
    }, 5000)
  
    // Animate achievement counters
    const achievementCounts = document.querySelectorAll(".achievement-count")
  
    function animateCounter(counter, target) {
      let count = 0
      const duration = 2000 // 2 seconds
      const interval = 50 // Update every 50ms
      const step = target / (duration / interval)
  
      const timer = setInterval(() => {
        count += step
        if (count >= target) {
          clearInterval(timer)
          counter.textContent = target
        } else {
          counter.textContent = Math.floor(count)
        }
      }, interval)
    }
  
    // Check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }
  
    // Start animation when element comes into view
    function checkCounters() {
      achievementCounts.forEach((counter) => {
        if (isInViewport(counter) && !counter.classList.contains("animated")) {
          counter.classList.add("animated")
          const target = Number.parseInt(counter.textContent)
          counter.textContent = "0"
          animateCounter(counter, target)
        }
      })
    }
  
    // Check on scroll and on load
    window.addEventListener("scroll", checkCounters)
    window.addEventListener("load", checkCounters)
  
    // Coach cards hover effect
    const coachCards = document.querySelectorAll(".coach-card")
  
    coachCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.querySelector(".coach-info").style.backgroundColor = "rgba(30, 58, 138, 0.05)"
      })
  
      card.addEventListener("mouseleave", function () {
        this.querySelector(".coach-info").style.backgroundColor = ""
      })
    })
  
    // Animate mission values on scroll
    const valueItems = document.querySelectorAll(".value-item")
  
    function animateValues() {
      valueItems.forEach((item, index) => {
        const itemPosition = item.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (itemPosition < windowHeight - 50) {
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "translateY(0)"
          }, index * 150)
        }
      })
    }
  
    // Set initial state for animated elements
    valueItems.forEach((item) => {
      item.style.opacity = "0"
      item.style.transform = "translateY(30px)"
      item.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    })
  
    // Run animation check on load and scroll
    window.addEventListener("load", animateValues)
    window.addEventListener("scroll", animateValues)
  })
  
  