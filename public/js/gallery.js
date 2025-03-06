document.addEventListener("DOMContentLoaded", () => {
    // Gallery filtering
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");
  
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
  
        const filter = this.getAttribute("data-filter");
  
        galleryItems.forEach((item) => {
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            item.style.display = "block";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }, Math.random() * 300);
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.8)";
            setTimeout(() => {
              item.style.display = "none";
            }, 300); // Ensures smooth hiding effect
          }
        });
      });
    });
  
    // Set initial state for gallery items
    galleryItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "scale(0.8)";
      item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "scale(1)";
      }, Math.random() * 300);
    });
  
    // Gallery modal functionality
    const galleryModal = document.querySelector(".gallery-modal");
    const modalImage = document.querySelector(".modal-image");
    const modalCaption = document.querySelector(".modal-caption");
    const modalClose = document.querySelector(".modal-close");
    const modalPrev = document.querySelector(".modal-prev");
    const modalNext = document.querySelector(".modal-next");
    let currentImageIndex = 0;
  
    if (galleryModal) {
      galleryItems.forEach((item, index) => {
        const zoomButton = item.querySelector(".gallery-zoom");
  
        if (zoomButton) {
          zoomButton.addEventListener("click", (e) => {
            e.stopPropagation();
            openModal(index);
          });
        }
  
        item.addEventListener("click", () => openModal(index));
      });
  
      function openModal(index) {
        currentImageIndex = index;
        updateModalImage();
        galleryModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
  
      function updateModalImage() {
        const item = galleryItems[currentImageIndex];
        const image = item.querySelector("img");
        const title = item.querySelector(".gallery-info h3")?.textContent || "";
        const description = item.querySelector(".gallery-info p")?.textContent || "";
  
        modalImage.src = image.src;
        modalCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
      }
  
      modalClose.addEventListener("click", closeModal);
      galleryModal.addEventListener("click", (e) => {
        if (e.target === galleryModal) closeModal();
      });
  
      function closeModal() {
        galleryModal.classList.remove("active");
        document.body.style.overflow = "";
      }
  
      modalPrev.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateModalImage();
      });
  
      modalNext.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateModalImage();
      });
  
      document.addEventListener("keydown", (e) => {
        if (!galleryModal.classList.contains("active")) return;
  
        if (e.key === "Escape") closeModal();
        else if (e.key === "ArrowLeft") modalPrev.click();
        else if (e.key === "ArrowRight") modalNext.click();
      });
    }
  
    // Load more functionality
    const loadMoreBtn = document.querySelector(".load-more-btn");
  
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  
        setTimeout(() => {
          this.textContent = "No more images to load";
          this.disabled = true;
        }, 1500);
      });
    }
  });
  