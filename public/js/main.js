document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle")
    const navMenu = document.querySelector("nav ul")
  
    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active")
  
        // Toggle icon between bars and times
        const icon = menuToggle.querySelector("i")
        if (icon.classList.contains("fa-bars")) {
          icon.classList.remove("fa-bars")
          icon.classList.add("fa-times")
        } else {
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      })
    }
  
    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (navMenu && navMenu.classList.contains("active")) {
        if (!event.target.closest("nav") && !event.target.closest(".menu-toggle")) {
          navMenu.classList.remove("active")
  
          // Reset icon
          const icon = menuToggle.querySelector("i")
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      }
    })
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href")
  
        if (targetId !== "#") {
          e.preventDefault()
  
          const targetElement = document.querySelector(targetId)
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Adjust for header height
              behavior: "smooth",
            })
  
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains("active")) {
              navMenu.classList.remove("active")
  
              // Reset icon
              const icon = menuToggle.querySelector("i")
              icon.classList.remove("fa-times")
              icon.classList.add("fa-bars")
            }
          }
        }
      })
    })
  
    // Add active class to current page in navigation
    const currentLocation = window.location.pathname
    const navLinks = document.querySelectorAll("nav ul li a")
  
    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href")
  
      // Check if the current page matches the link
      if (currentLocation.includes(linkPath) && linkPath !== "index.html") {
        link.classList.add("active")
      } else if (currentLocation.endsWith("/") && linkPath === "index.html") {
        link.classList.add("active")
      }
    })
  
    // Animate elements when they come into view
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll")
  
      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (elementPosition < windowHeight - 50) {
          element.classList.add("animated")
        }
      })
    }
  
    // Run animation check on load and scroll
    window.addEventListener("load", animateOnScroll)
    window.addEventListener("scroll", animateOnScroll)
  
    // Check for and initialize page-specific functions
    //Added this to handle the undeclared variable error.  This is a placeholder.  The actual initPageSpecific function would need to be defined elsewhere and included in the project.
    const initPageSpecific = () => {}
  
    if (typeof initPageSpecific === "function") {
      initPageSpecific()
    }
  })
  
  