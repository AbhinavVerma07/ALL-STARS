document.addEventListener("DOMContentLoaded", () => {
    // Fetch player stats from API
    const statsTableBody = document.getElementById("stats-table-body")
    const statsTable = document.querySelector(".stats-table")
    const statsLoading = document.querySelector(".stats-loading")
    const statsError = document.querySelector(".stats-error")
    const retryBtn = document.getElementById("retry-btn")
    const prevPageBtn = document.getElementById("prev-page")
    const nextPageBtn = document.getElementById("next-page")
    const pageInfo = document.getElementById("page-info")
  
    // Search and filter elements
    const playerSearch = document.getElementById("player-search")
    const ageGroupFilter = document.getElementById("age-group-filter")
    const positionFilter = document.getElementById("position-filter")
    const statSort = document.getElementById("stat-sort")
  
    // Pagination state
    let currentPage = 1
    let totalPages = 1
    const playersPerPage = 10
  
    // Filters state
    let searchTerm = ""
    let ageGroup = "all"
    let position = "all"
    let sortBy = "name"
  
    // Function to fetch player stats
    function fetchPlayerStats() {
      // Show loading state
      statsLoading.style.display = "flex"
      statsTable.style.display = "none"
      statsError.style.display = "none"
  
      // Fetch data from API
      fetch("/api/players")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch player stats")
          }
          return response.json()
        })
        .then((data) => {
          // Process and display data
          displayPlayerStats(data.data)
  
          // Hide loading, show table
          statsLoading.style.display = "none"
          statsTable.style.display = "table"
        })
        .catch((error) => {
          console.error("Error fetching player stats:", error)
  
          // Show error message
          statsLoading.style.display = "none"
          statsError.style.display = "flex"
        })
    }
  
    // Function to display player stats
    function displayPlayerStats(players) {
      // Apply filters
      const filteredPlayers = players.filter((player) => {
        // Search filter
        const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
  
        // Age group filter
        const ageGroupMatch = ageGroup === "all" || player.ageGroup === ageGroup
  
        // Position filter
        const positionMatch = position === "all" || player.position === position
  
        return nameMatch && ageGroupMatch && positionMatch
      })
  
      // Apply sorting
      filteredPlayers.sort((a, b) => {
        switch (sortBy) {
          case "goals":
            return b.stats.goals - a.stats.goals
          case "assists":
            return b.stats.assists - a.stats.assists
          case "appearances":
            return b.stats.appearances - a.stats.appearances
          case "rating":
            return b.stats.rating - a.stats.rating
          default:
            return a.name.localeCompare(b.name)
        }
      })
  
      // Calculate pagination
      totalPages = Math.ceil(filteredPlayers.length / playersPerPage)
  
      // Adjust current page if needed
      if (currentPage > totalPages) {
        currentPage = totalPages || 1
      }
  
      // Update page info
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`
  
      // Enable/disable pagination buttons
      prevPageBtn.disabled = currentPage === 1
      nextPageBtn.disabled = currentPage === totalPages || totalPages === 0
  
      // Get players for current page
      const startIndex = (currentPage - 1) * playersPerPage
      const endIndex = startIndex + playersPerPage
      const currentPlayers = filteredPlayers.slice(startIndex, endIndex)
  
      // Clear table body
      statsTableBody.innerHTML = ""
  
      // Add players to table
      if (currentPlayers.length === 0) {
        const emptyRow = document.createElement("tr")
        emptyRow.innerHTML = `
          <td colspan="9" class="text-center">No players found matching your filters</td>
        `
        statsTableBody.appendChild(emptyRow)
      } else {
        currentPlayers.forEach((player) => {
          const row = document.createElement("tr")
          row.innerHTML = `
            <td>
              <div class="player-name">${player.name}</div>
            </td>
            <td>${player.ageGroup || "N/A"}</td>
            <td>${player.position || "N/A"}</td>
            <td>${player.stats.appearances || 0}</td>
            <td>${player.stats.goals || 0}</td>
            <td>${player.stats.assists || 0}</td>
            <td>${player.stats.passAccuracy || 0}%</td>
            <td>${player.stats.rating || 0}</td>
            <td>
              <button class="btn-details" data-player-id="${player.id}">Details</button>
            </td>
          `
          statsTableBody.appendChild(row)
        })
      }
  
      // Add event listeners to detail buttons
      document.querySelectorAll(".btn-details").forEach((button) => {
        button.addEventListener("click", function () {
          const playerId = this.getAttribute("data-player-id")
          openPlayerModal(playerId, players)
        })
      })
    }
  
    // Function to open player modal
    function openPlayerModal(playerId, players) {
      const player = players.find((p) => p.id === playerId)
  
      if (!player) return
  
      // Set modal content
      document.getElementById("modal-player-name").textContent = player.name
      document.getElementById("modal-player-details").textContent = `${player.ageGroup} | ${player.position}`
      document.getElementById("modal-appearances").textContent = player.stats.appearances || 0
      document.getElementById("modal-goals").textContent = player.stats.goals || 0
      document.getElementById("modal-assists").textContent = player.stats.assists || 0
      document.getElementById("modal-rating").textContent = player.stats.rating || 0
  
      // Set detailed stats
      document.getElementById("modal-stat-goals").style.width = `${player.stats.goalScoring || 0}%`
      document.getElementById("modal-stat-assists").style.width = `${player.stats.creativity || 0}%`
      document.getElementById("modal-stat-shot-accuracy").style.width = `${player.stats.shotAccuracy || 0}%`
      document.getElementById("modal-stat-tackles").style.width = `${player.stats.tackling || 0}%`
      document.getElementById("modal-stat-interceptions").style.width = `${player.stats.interceptions || 0}%`
      document.getElementById("modal-stat-aerial-duels").style.width = `${player.stats.aerialDuels || 0}%`
      document.getElementById("modal-stat-pass-accuracy").style.width = `${player.stats.passAccuracy || 0}%`
      document.getElementById("modal-stat-dribbling").style.width = `${player.stats.dribbling || 0}%`
      document.getElementById("modal-stat-ball-control").style.width = `${player.stats.ballControl || 0}%`
  
      // Show modal
      document.querySelector(".player-modal").classList.add("active")
  
      // Disable scrolling on body
      document.body.style.overflow = "hidden"
    }
  
    // Close player modal
    document.querySelector(".modal-close").addEventListener("click", () => {
      document.querySelector(".player-modal").classList.remove("active")
      document.body.style.overflow = ""
    })
  
    // Tab switching in player modal
    document.querySelectorAll(".tab-btn").forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons and panes
        document.querySelectorAll(".tab-btn").forEach((btn) => {
          btn.classList.remove("active")
        })
  
        document.querySelectorAll(".tab-pane").forEach((pane) => {
          pane.classList.remove("active")
        })
  
        // Add active class to clicked button and corresponding pane
        this.classList.add("active")
        const tabId = this.getAttribute("data-tab")
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })
  
    // Event listeners for search and filters
    if (playerSearch) {
      playerSearch.addEventListener("input", function () {
        searchTerm = this.value
        currentPage = 1
        fetchPlayerStats()
      })
    }
  
    if (ageGroupFilter) {
      ageGroupFilter.addEventListener("change", function () {
        ageGroup = this.value
        currentPage = 1
        fetchPlayerStats()
      })
    }
  
    if (positionFilter) {
      positionFilter.addEventListener("change", function () {
        position = this.value
        currentPage = 1
        fetchPlayerStats()
      })
    }
  
    if (statSort) {
      statSort.addEventListener("change", function () {
        sortBy = this.value
        currentPage = 1
        fetchPlayerStats()
      })
    }
  
    // Pagination event listeners
    if (prevPageBtn) {
      prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--
          fetchPlayerStats()
        }
      })
    }
  
    if (nextPageBtn) {
      nextPageBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++
          fetchPlayerStats()
        }
      })
    }
  
    // Retry button
    if (retryBtn) {
      retryBtn.addEventListener("click", fetchPlayerStats)
    }
  
    // Initial fetch
    fetchPlayerStats()
  
    // Mock data for player spotlight
    const spotlightPlayer = {
      name: "James Wilson",
      info: "U17 | Forward",
      goals: 12,
      assists: 8,
      rating: 9.2,
      description:
        "James has shown exceptional performance this month, scoring crucial goals in important matches and demonstrating outstanding leadership qualities on and off the pitch.",
    }
  
    // Update spotlight section
    document.getElementById("spotlight-name").textContent = spotlightPlayer.name
    document.getElementById("spotlight-info").textContent = spotlightPlayer.info
    document.getElementById("spotlight-goals").textContent = spotlightPlayer.goals
    document.getElementById("spotlight-assists").textContent = spotlightPlayer.assists
    document.getElementById("spotlight-rating").textContent = spotlightPlayer.rating
    document.getElementById("spotlight-description").textContent = spotlightPlayer.description
  
    // Placeholder for charts
    // In a real application, you would use a charting library like Chart.js
    // For this demo, we'll just show placeholders
    const chartPlaceholders = document.querySelectorAll(".chart-placeholder")
  
    chartPlaceholders.forEach((placeholder) => {
      placeholder.innerHTML = `
        <i class="fas fa-chart-bar"></i>
        <p>Chart visualization would appear here</p>
        <p class="chart-note">Using a library like Chart.js</p>
      `
    })
  })
  
  