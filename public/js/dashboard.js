document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    fetch("/api/auth/me")
      .then((response) => {
        if (!response.ok) {
          // Redirect to login page if not authenticated
          window.location.href = "/login.html"
          return null
        }
        return response.json()
      })
      .then((data) => {
        if (data && data.data) {
          // Update user info
          const user = data.data
          document.getElementById("user-name").textContent = user.name
          document.getElementById("user-role").textContent = user.role
          document.getElementById("welcome-name").textContent = user.name.split(" ")[0]
        }
      })
      .catch((error) => {
        console.error("Error checking authentication:", error)
        // Redirect to login page on error
        window.location.href = "/login.html"
      })
  
    // Mobile sidebar toggle
    const menuToggle = document.querySelector(".menu-toggle")
    const sidebar = document.querySelector(".dashboard-sidebar")
  
    if (menuToggle && sidebar) {
      menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active")
      })
  
      // Close sidebar when clicking outside on mobile
      document.addEventListener("click", (event) => {
        if (
          window.innerWidth <= 768 &&
          sidebar.classList.contains("active") &&
          !event.target.closest(".dashboard-sidebar") &&
          !event.target.closest(".menu-toggle")
        ) {
          sidebar.classList.remove("active")
        }
      })
    }
  
    // Navigation
    const navLinks = document.querySelectorAll(".sidebar-nav ul li a")
    const dashboardSections = document.querySelectorAll(".dashboard-section")
  
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href").substring(1)
  
        // Remove active class from all links and sections
        navLinks.forEach((link) => {
          link.parentElement.classList.remove("active")
        })
  
        dashboardSections.forEach((section) => {
          section.classList.remove("active")
        })
  
        // Add active class to clicked link and corresponding section
        this.parentElement.classList.add("active")
        document.getElementById(targetId).classList.add("active")
  
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768 && sidebar) {
          sidebar.classList.remove("active")
        }
      })
    })
  
    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn")
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        // Send logout request to server
        fetch("/api/auth/logout")
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              // Redirect to login page
              window.location.href = "/login.html"
            }
          })
          .catch((error) => {
            console.error("Error logging out:", error)
            // Redirect to login page anyway
            window.location.href = "/login.html"
          })
      })
    }
  
    // Notifications
    const notificationBtn = document.querySelector(".notification-btn")
    const notificationDropdown = document.querySelector(".notification-dropdown")
    const markAllReadBtn = document.querySelector(".mark-all-read")
  
    if (notificationBtn && notificationDropdown) {
      // Toggle notification dropdown on click
      notificationBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        notificationDropdown.classList.toggle("show")
      })
  
      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
          notificationDropdown.classList.remove("show")
        }
      })
  
      // Mark all notifications as read
      if (markAllReadBtn) {
        markAllReadBtn.addEventListener("click", () => {
          document.querySelectorAll(".notification-list li.unread").forEach((notification) => {
            notification.classList.remove("unread")
          })
  
          // Update badge count
          const badge = notificationBtn.querySelector(".badge")
          badge.textContent = "0"
          badge.style.display = "none"
        })
      }
    }
  
    // Chart controls
    const chartMetric = document.getElementById("chart-metric")
    const chartPeriod = document.getElementById("chart-period")
  
    if (chartMetric && chartPeriod) {
      chartMetric.addEventListener("change", updateChart)
      chartPeriod.addEventListener("change", updateChart)
    }
  
    function updateChart() {
      // In a real application, this would fetch data and update the chart
      // For this demo, we'll just show a placeholder message
      const chartContainer = document.querySelector(".chart-container")
      const metric = chartMetric ? chartMetric.value : "rating"
      const period = chartPeriod ? chartPeriod.value : "3months"
  
      chartContainer.innerHTML = `
        <div class="chart-placeholder">
          <i class="fas fa-chart-line"></i>
          <p>Chart for ${metric} over the ${period} period would appear here</p>
          <p class="chart-note">Using a library like Chart.js</p>
        </div>
      `
    }
  
    // Initialize chart
    updateChart()
  
    // Animate stats cards
    const statCards = document.querySelectorAll(".stat-card")
  
    statCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }, index * 100)
    })
  
    // Set initial state for animated elements
    statCards.forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    })
  })
  
  