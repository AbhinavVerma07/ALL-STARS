document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    fetch("/dashboard/api/auth/me")
      .then((response) => {
        if (!response.ok) {
          // Redirect to login page if not authenticated
          window.location.href = "/login"
          return null
        }
        return response.json()
      })
      .then((data) => {
        if (data && data.data) {
          // Update user info
          const user = data.data
          document.getElementById("user-name").textContent = user.username
          document.getElementById("user-role").textContent = user.role
          document.getElementById("welcome-name").textContent = user.username
        }
      })
      .catch((error) => {
        console.error("Error checking authentication:", error)
        // Redirect to login page on error
        window.location.href = "/login"
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
              window.location.href = "/login"
            }
          })
          .catch((error) => {
            console.error("Error logging out:", error)
            // Redirect to login page anyway
            window.location.href = "/login"
          })
      })
    }
  
    // Player Management
    const addPlayerForm = document.getElementById("addPlayerForm")
    if (addPlayerForm) {
      addPlayerForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(addPlayerForm)
        const playerData = Object.fromEntries(formData.entries())
  
        try {
          const response = await fetch("/dashboard/api/players", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(playerData),
          })
  
          const data = await response.json()
          if (data.status === "success") {
            window.location.reload()
          } else {
            alert("Failed to add player: " + data.message)
          }
        } catch (error) {
          console.error("Error adding player:", error)
          alert("Failed to add player. Please try again.")
        }
      })
    }
  
    // Delete player
    window.deletePlayer = async (playerId) => {
      if (!confirm("Are you sure you want to delete this player?")) {
        return
      }
  
      try {
        const response = await fetch(`/dashboard/api/players/${playerId}`, {
          method: "DELETE",
        })
  
        const data = await response.json()
        if (data.status === "success") {
          window.location.reload()
        } else {
          alert("Failed to delete player: " + data.message)
        }
      } catch (error) {
        console.error("Error deleting player:", error)
        alert("Failed to delete player. Please try again.")
      }
    }
  
    // Update contact status
    window.updateContactStatus = async (contactId) => {
      const status = prompt("Enter new status (New, In Progress, Resolved):")
      if (!status) return
  
      try {
        const response = await fetch(`/dashboard/api/contacts/${contactId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        })
  
        const data = await response.json()
        if (data.status === "success") {
          window.location.reload()
        } else {
          alert("Failed to update contact: " + data.message)
        }
      } catch (error) {
        console.error("Error updating contact:", error)
        alert("Failed to update contact. Please try again.")
      }
    }
  
    // Notifications
    const notificationBtn = document.querySelector(".notification-btn")
    const notificationDropdown = document.querySelector(".notification-dropdown")
    const markAllReadBtn = document.querySelector(".mark-all-read")
  
    if (notificationBtn && notificationDropdown) {
      notificationBtn.addEventListener("click", () => {
        notificationDropdown.classList.toggle("active")
      })
  
      // Close dropdown when clicking outside
      document.addEventListener("click", (event) => {
        if (
          !event.target.closest(".notification-btn") &&
          !event.target.closest(".notification-dropdown")
        ) {
          notificationDropdown.classList.remove("active")
        }
      })
    }
  
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", () => {
        const unreadNotifications = document.querySelectorAll(".notification-item.unread")
        unreadNotifications.forEach((notification) => {
          notification.classList.remove("unread")
        })
      })
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
  
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
  
    // Function to switch tabs
    function switchTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
  
        // Remove active class from all buttons
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
  
        // Show selected tab content
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) {
            selectedContent.style.display = 'block';
        }
  
        // Add active class to selected button
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
    }
  
    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
  
    // Show default tab on page load
    const defaultTab = document.querySelector('.tab-button');
    if (defaultTab) {
        switchTab(defaultTab.getAttribute('data-tab'));
    }
  })
  
  