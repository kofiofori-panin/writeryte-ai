// Back to top button functionality
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Smooth scrolling for navbar links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Add hover effects to cards
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// Initialize tooltips if needed
const tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Add animation on scroll for cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all cards for animation
document.querySelectorAll(".feature-card, .step-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

// Enhanced tab switching with smooth transitions
document.querySelectorAll('[data-bs-toggle="pill"]').forEach((pill) => {
  pill.addEventListener("shown.bs.tab", function (e) {
    const targetPane = document.querySelector(
      e.target.getAttribute("data-bs-target")
    );
    targetPane.style.opacity = "0";
    targetPane.style.transform = "translateY(20px)";

    setTimeout(() => {
      targetPane.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      targetPane.style.opacity = "1";
      targetPane.style.transform = "translateY(0)";
    }, 50);
  });
});

// Add keyboard navigation
document.addEventListener("keydown", function (e) {
  // Press 'T' to go to top
  if (e.key === "t" || e.key === "T") {
    if (!e.target.matches("input, textarea")) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  // Press numbers 1-5 to switch tabs
  if (e.key >= "1" && e.key <= "5") {
    if (!e.target.matches("input, textarea")) {
      e.preventDefault();
      const tabs = document.querySelectorAll('[data-bs-toggle="pill"]');
      const tabIndex = parseInt(e.key) - 1;
      if (tabs[tabIndex]) {
        tabs[tabIndex].click();
      }
    }
  }
});

// Add search functionality for FAQ (simple)
function addFAQSearch() {
  const searchDiv = document.createElement("div");
  searchDiv.className = "mb-4";
  searchDiv.innerHTML = `
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" id="faqSearch" placeholder="Search FAQ...">
                </div>
            `;

  const faqSection = document.querySelector("#pills-faq .section-header");
  faqSection.parentNode.insertBefore(searchDiv, faqSection.nextSibling);

  const searchInput = document.getElementById("faqSearch");
  const accordionItems = document.querySelectorAll(".accordion-item");

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();

    accordionItems.forEach((item) => {
      const question = item
        .querySelector(".accordion-button")
        .textContent.toLowerCase();
      const answer = item
        .querySelector(".accordion-body")
        .textContent.toLowerCase();

      if (
        question.includes(searchTerm) ||
        answer.includes(searchTerm) ||
        searchTerm === ""
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
}

// Initialize FAQ search when FAQ tab is first clicked
let faqSearchAdded = false;
document.getElementById("pills-faq-tab").addEventListener("click", function () {
  if (!faqSearchAdded) {
    addFAQSearch();
    faqSearchAdded = true;
  }
});

// Add loading states for better UX
function showLoading(element) {
  element.style.opacity = "0.5";
  element.style.pointerEvents = "none";
}

function hideLoading(element) {
  element.style.opacity = "1";
  element.style.pointerEvents = "auto";
}

// Enhanced accordion functionality
document.querySelectorAll(".accordion-button").forEach((button) => {
  button.addEventListener("click", function () {
    const icon = this.querySelector("i") || document.createElement("i");
    if (!this.querySelector("i")) {
      icon.className = "bi bi-chevron-down me-2";
      this.insertBefore(icon, this.firstChild);
    }

    // Rotate icon based on state
    setTimeout(() => {
      if (this.classList.contains("collapsed")) {
        icon.style.transform = "rotate(0deg)";
      } else {
        icon.style.transform = "rotate(180deg)";
      }
    }, 150);
  });
});

// Add print functionality
function addPrintButton() {
  const printBtn = document.createElement("button");
  printBtn.className = "btn btn-outline-primary me-2";
  printBtn.innerHTML = '<i class="bi bi-printer"></i> Print Manual';
  printBtn.onclick = () => window.print();

  const navbar = document.querySelector(".navbar-nav");
  const li = document.createElement("li");
  li.className = "nav-item";
  li.appendChild(printBtn);
  navbar.appendChild(li);
}

// Initialize print button
addPrintButton();

// Add custom print styles
const printStyles = `
            @media print {
                .navbar, .back-to-top, .nav-pills { display: none !important; }
                .main-content { margin-top: 0 !important; border-radius: 0 !important; }
                .tab-content > .tab-pane { display: block !important; }
                .accordion-collapse { display: block !important; }
                .accordion-body { max-height: none !important; }
                body { background: white !important; }
                .hero-section { background: #6366f1 !important; -webkit-print-color-adjust: exact; }
            }
        `;

const styleSheet = document.createElement("style");
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);

// Performance optimization - lazy load images if any
if ("loading" in HTMLImageElement.prototype) {
  const images = document.querySelectorAll("img[data-src]");
  images.forEach((img) => {
    img.src = img.dataset.src;
  });
}

// Add accessibility improvements
document
  .querySelectorAll(".nav-link, .accordion-button, .btn")
  .forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.outline = "2px solid #6366f1";
      this.style.outlineOffset = "2px";
    });

    element.addEventListener("blur", function () {
      this.style.outline = "";
      this.style.outlineOffset = "";
    });
  });

// Show keyboard shortcuts hint
const keyboardHint = document.createElement("div");
keyboardHint.className = "alert alert-info alert-custom mt-3";
keyboardHint.innerHTML = `
            <i class="bi bi-keyboard"></i>
            <strong>Keyboard Shortcuts:</strong> 
            Press <kbd>1-5</kbd> to switch tabs, <kbd>T</kbd> to go to top
        `;

document.querySelector(".container.py-5").appendChild(keyboardHint);

console.log("WriteRyte AI User Manual loaded successfully! 🚀");
