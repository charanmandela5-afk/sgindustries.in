/**
 * SG INDUSTRY - MASTER JAVASCRIPT
 * Product filtering, modal popups, RFQ submission, mobile nav
 */

(function () {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '80px';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = '#ffffff';
      navLinks.style.padding = '2rem';
      navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
      navLinks.style.borderBottom = '1px solid #e2e8f0';
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Product Catalog Data for Modal Popups (Matching Official SG Industries Brochure)
  const productData = {
    'pure-soft-tissues': {
      title: 'Pure Soft Tissues (Lilly Premium)',
      category: 'Lilly Consumer & Dining',
      badge: '1 Ply • Ultra Soft & Gentle',
      desc: '1-Ply luxury napkins (Approx. 75 - 80 tissues per pack) made from 100% eco-friendly soft paper. Cloud-like touch designed specifically to be ultra-gentle on delicate facial skin with dotted micro-embossing for instant absorption.',
      specs: {
        'Dimensions': '20×20 cm / 30×30 cm',
        'Quantity': 'Approx. 75 - 80 Tissues Per Packet',
        'Number of Ply': '1 Ply',
        'Custom Printing': 'Double Colour Printing Available',
        'Pattern': 'Designed & Fully Embossed (Dotted)',
        'Material': 'Paper (100% Eco Friendly Soft Pulp)',
        'Packaging': 'Flow wrap pack',
        'Feel & Feature': 'Ultra Soft & Gentle on Skin'
      }
    },
    'pure-soft-40x40': {
      title: '40×40 Pure Soft Tissues (Lilly Luxury 2-Ply)',
      category: 'Lilly Luxury Dining Line',
      badge: '2 Ply • Designed & Double Colour Printing',
      desc: 'Premium 40×40 cm 2-Ply luxury napkins (Approx. 75 - 80 tissues per pack) made from 100% eco-friendly soft pulp paper. Designed and Double Colour Printing available. Full dotted micro-embossed texture creates capillary micro-pockets for rapid absorption while remaining ultra-gentle on delicate skin.',
      specs: {
        'Dimensions': '40×40 cm',
        'Quantity': 'Approx. 75 - 80 Tissues Per Packet',
        'Number of Ply': '2 Ply',
        'Custom Printing': 'Double Colour Printing Available',
        'Pattern': 'Designed & Fully Embossed (Dotted)',
        'Material': 'Paper (100% Eco Friendly Soft Pulp)',
        'Packaging': 'Flow wrap pack',
        'Feel & Feature': 'Ultra Soft & Gentle on Skin'
      }
    },
    'semi-soft-tissues': {
      title: 'Semi Soft Tissues (Lilly Premium)',
      category: 'Lilly Commercial & Daily Dining',
      badge: '1 Ply • Soft & Absorbent',
      desc: 'Semi Soft paper napkins (Approx. 75 - 80 tissues per pack) made from 100% eco friendly soft pulp paper. 1 Ply thickness with fully embossed dotted texture for liquid absorption and hygiene, ideal for hotels, daily catering, and family dining.',
      specs: {
        'Dimensions': '30×30 cm / 20×20 cm',
        'Quantity': 'Approx. 75 - 80 Tissues Per Packet',
        'Number of Ply': '1 Ply',
        'Custom Printing': 'Available on Order',
        'Pattern': 'Designed & Fully Embossed (Dotted)',
        'Material': 'Paper (100% Eco Friendly Soft Pulp)',
        'Packaging': 'Flow wrap pack',
        'Feel & Feature': 'Soft & Absorbent Every Day Napkin'
      }
    },
    'customized-tissues': {
      title: 'Customized Tissues & Custom Boxes',
      category: 'B2B Hospitality & Corporate Branding',
      badge: 'Logo on Tissue & Brand Name on Box',
      desc: 'Enhance your brand identity with custom printed tissue napkins and branded dispenser boxes from SG Industries. Logo print on tissue and brand name printed on the box as per requirement (Approx. 75 - 80 tissues per box) for restaurants, cafes, corporate suites, and special events.',
      specs: {
        'Quantity': 'Approx. 75 - 80 Tissues Per Box / Pack',
        'Customization': 'Logo Print on Tissue & Brand Name Print on Box',
        'Number of Ply': '1 Ply or 2 Ply Luxury',
        'Material': 'Paper',
        'Available Sizes': '30x30 cm / 20x20 cm / 40x40 cm / Custom',
        'Packaging': 'Custom Brand-Name Printed Box or Flow Wrap',
        'Pattern': '1/4 Folded with Custom Flexo Inks',
        'Ideal For': 'Hotels, Restaurants, Cafes, Corporate Offices & Events'
      }
    },
    'hrt-rolls': {
      title: 'HRT Rolls (Hand Roll Towels)',
      category: 'Commercial Restroom & Healthcare',
      badge: 'High Strength Absorbency',
      desc: 'Continuous Hand Roll Towels (HRT) engineered for heavy-traffic washrooms, commercial kitchens, hospitals, and corporate facilities. High wet-strength prevents shredding when wet.',
      specs: {
        'Product Type': 'Continuous Hand Roll Towel (HRT)',
        'Feature': 'High Strength Absorbency',
        'Material': 'Paper (Heavy-duty absorbent web)',
        'Dispenser Compatibility': 'Universal roll towel dispensers',
        'Tensile Balance': 'Reinforced cross-directional wet strength',
        'Yield': 'High economy roll length for reduced reload intervals'
      }
    },
    'kitchen-roll': {
      title: 'Kitchen Roll (Quick Clean Wipes)',
      category: 'Culinary & Multi-Surface',
      badge: 'Quick Clean Wipes',
      desc: 'High-absorbency Kitchen Rolls designed for instant grease lock, liquid absorption, and food preparation surface hygiene. Strong and lint-free.',
      specs: {
        'Product Type': 'Kitchen Towel Roll',
        'Feature': 'Quick Clean Wipes for spills & oil',
        'Material': 'Food-safe absorbent Paper',
        'Embossing': '3D textured micro-pockets',
        'Ply Count': 'Multi-Ply reinforced',
        'Safety': 'Safe for kitchen countertops and dining prep'
      }
    },
    'toilet-roll': {
      title: 'Toilet Roll (Smooth & Safe)',
      category: 'Sanitary Bath Care',
      badge: 'Smooth, Safe & Skin-Friendly',
      desc: 'SG Industries Bathroom Toilet Rolls provide smooth comfort, gentle touch, and immediate flush dispersion for zero-clog septic tank safety.',
      specs: {
        'Product Type': 'Bathroom Toilet Paper Roll',
        'Feature': 'Smooth, Safe & Skin-Friendly',
        'Material': 'Paper',
        'Dispersion': 'Rapid water dispersion (Plumbing & septic safe)',
        'Embossing': 'Quilted softness for high volume',
        'Packaging': 'Twin packs, 4-roll packs, and bulk commercial bundles'
      }
    },
    'm-fold-tissues': {
      title: 'M-Fold Tissues (Interfolded Towels)',
      category: 'Touchless Hygiene & AFH',
      badge: 'Fast Absorb Action',
      desc: 'M-Fold interfolded paper towels provide touchless one-at-a-time dispensing, preventing cross-contamination while dramatically cutting paper waste in commercial washrooms.',
      specs: {
        'Product Type': 'Interfolded M-Fold Hand Towels',
        'Feature': 'Fast Absorb Action',
        'Material': 'Paper',
        'Folding Format': 'M-Fold (Single-sheet pop-up dispense)',
        'Dispenser Compatibility': 'Standard commercial wall-mounted dispensers',
        'Applications': 'Offices, Hospitals, Airports, Luxury Restrooms'
      }
    },
    // Fallback aliases
    'facial-tissues': {
      title: 'Pure Soft Tissues (Lilly Premium)',
      category: 'Lilly Consumer & Dining',
      badge: '1 Ply • Ultra Soft & Gentle',
      desc: '1-Ply luxury napkins made from 100% eco-friendly soft paper. Cloud-like touch designed specifically to be ultra-gentle on delicate facial skin with dotted micro-embossing for instant absorption.',
      specs: {
        'Number of Ply': '1 Ply (Pure Soft)',
        'Material': 'Paper (100% Eco Friendly Soft Pulp)',
        'Size': '20x20 cm / 30x30 cm',
        'Packaging': 'Flow wrap pack',
        'Quantity': 'Approx. 75 - 80 Tissues Per Packet',
        'Pattern': '1/4 folded, Fully embossed (Dotted)'
      }
    },
    'toilet-rolls': {
      title: 'Toilet Roll (Smooth & Safe)',
      category: 'Sanitary Bath Care',
      badge: 'Smooth, Safe & Skin-Friendly',
      desc: 'SG Industries Bathroom Toilet Rolls provide smooth comfort, gentle touch, and rapid plumbing dispersion.',
      specs: {
        'Product Type': 'Bathroom Toilet Paper Roll',
        'Feature': 'Smooth, Safe & Skin-Friendly',
        'Material': 'Paper'
      }
    },
    'kitchen-towels': {
      title: 'Kitchen Roll (Quick Clean Wipes)',
      category: 'Culinary & Multi-Surface',
      badge: 'Quick Clean Wipes',
      desc: 'High-absorbency Kitchen Rolls designed for instant grease lock and liquid absorption.',
      specs: {
        'Product Type': 'Kitchen Towel Roll',
        'Feature': 'Quick Clean Wipes',
        'Material': 'Paper'
      }
    },
    'table-napkins': {
      title: 'Customized Tissues & Serviettes',
      category: 'Hospitality & Dining',
      badge: 'Logo on Tissue & Brand Name on Box',
      desc: 'Logo print on tissue and brand name on the box as per requirement.',
      specs: {
        'Customization': 'Logo Print on Tissue & Brand Name on Box',
        'Size': '30x30 cm / 20x20 cm / 40x40 cm',
        'Pattern': '1/4 folded, Fully embossed (Dotted)'
      }
    }
  };

  // Product Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Specification Modal Elements
  const modalOverlay = document.getElementById('spec-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecsList = document.getElementById('modal-specs-list');
  const modalRfqBtn = document.getElementById('modal-rfq-btn');

  // Open Modal
  document.querySelectorAll('.btn-spec-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodId = btn.getAttribute('data-product');
      const data = productData[prodId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalDesc.textContent = data.desc;

      // Populate Specs Grid
      modalSpecsList.innerHTML = '';
      for (const [key, val] of Object.entries(data.specs)) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.padding = '0.65rem 0';
        row.style.borderBottom = '1px solid #f1f5f3';

        const label = document.createElement('span');
        label.style.fontWeight = '700';
        label.style.color = '#1e293b';
        label.style.fontSize = '0.85rem';
        label.textContent = key;

        const value = document.createElement('span');
        value.style.color = '#0f4c3a';
        value.style.fontWeight = '600';
        value.style.fontSize = '0.85rem';
        value.style.textAlign = 'right';
        value.textContent = val;

        row.appendChild(label);
        row.appendChild(value);
        modalSpecsList.appendChild(row);
      }

      // Configure Modal RFQ button
      modalRfqBtn.onclick = () => {
        modalOverlay.classList.remove('active');
        const prodSelect = document.getElementById('rfq-product');
        if (prodSelect) prodSelect.value = prodId;
        const inquirySec = document.getElementById('contact');
        if (inquirySec) inquirySec.scrollIntoView({ behavior: 'smooth' });
      };

      modalOverlay.classList.add('active');
    });
  });

  // Close Modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // Card "Get Quote" triggers
  document.querySelectorAll('.btn-card-quote').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodId = btn.getAttribute('data-product');
      const prodSelect = document.getElementById('rfq-product');
      if (prodSelect && prodId) prodSelect.value = prodId;

      const inquirySec = document.getElementById('contact');
      if (inquirySec) {
        inquirySec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Handle RFQ Form Submission
  const rfqForm = document.getElementById('rfq-form');
  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rfq-name').value;
      const company = document.getElementById('rfq-company').value;
      const trackingCode = 'SG-INQ-' + Math.floor(100000 + Math.random() * 900000);

      const submitBtn = rfqForm.querySelector('.btn-submit-rfq');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Transmitting Specification...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '✓ Inquiry Sent Successfully!';
        submitBtn.style.background = '#1b6a52';

        alert(`Thank you, ${name} (${company || 'Valued Partner'})!\n\nYour bulk tissue quotation and sample request has been registered.\nReference Tracking ID: ${trackingCode}\nOur B2B team will provide complete container pricing and technical data sheets within 12 business hours.\n\nYou can also contact us directly:\nPhone / WhatsApp: +91 96424 00034\nAlternate: +91 96428 00034\nEmail: sgindustriestissuepaper@gmail.com`);

        rfqForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = origText;
          submitBtn.disabled = false;
          submitBtn.style.background = 'var(--primary)';
        }, 3000);
      }, 1000);
    });
  }

  // Newsletter Form
  const newsletterForm = document.querySelector('.newsletter-box');
  if (newsletterForm) {
    const nBtn = newsletterForm.querySelector('.newsletter-btn');
    const nInput = newsletterForm.querySelector('.newsletter-input');
    if (nBtn && nInput) {
      nBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (nInput.value && nInput.value.includes('@')) {
          alert(`Subscribed! You will receive SG Industry quarterly market pulp reports and tissue supply bulletins at ${nInput.value}`);
          nInput.value = '';
        } else {
          alert('Please enter a valid business email address.');
        }
      });
    }
  }

  // Brochure Lightbox Modal Elements
  const brochureModal = document.getElementById('brochure-modal');
  const brochureCloseBtn = document.getElementById('brochure-modal-close');

  document.querySelectorAll('.btn-open-brochure').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (brochureModal) {
        brochureModal.classList.add('active');
      }
    });
  });

  if (brochureCloseBtn && brochureModal) {
    brochureCloseBtn.addEventListener('click', () => {
      brochureModal.classList.remove('active');
    });
  }

  if (brochureModal) {
    brochureModal.addEventListener('click', (e) => {
      if (e.target === brochureModal) {
        brochureModal.classList.remove('active');
      }
    });
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ==========================================================================
  // PROPRIETOR & FACTORY PHOTO SCROLLING GALLERY
  // ==========================================================================
  const galleryTrack = document.getElementById('proprietor-gallery-track');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');
  const progressBar = document.getElementById('gallery-progress-bar');

  if (galleryTrack) {
    const getScrollStep = () => {
      const card = galleryTrack.querySelector('.gallery-card');
      return card ? card.offsetWidth + 24 : 360; // card width + gap
    };

    const updateProgressBar = () => {
      if (!progressBar) return;
      const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
      if (maxScroll <= 0) {
        progressBar.style.width = '100%';
        return;
      }
      const scrollPercent = (galleryTrack.scrollLeft / maxScroll) * 100;
      progressBar.style.width = Math.min(100, Math.max(15, scrollPercent)) + '%';
    };

    galleryTrack.addEventListener('scroll', updateProgressBar, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        galleryTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
        if (galleryTrack.scrollLeft >= maxScroll - 15) {
          galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          galleryTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        }
      });
    }

    // Gentle Auto-Scroll Effect
    let autoScrollInterval = null;
    const startAutoScroll = () => {
      if (autoScrollInterval) clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(() => {
        const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
        if (galleryTrack.scrollLeft >= maxScroll - 20) {
          galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          galleryTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        }
      }, 4000);
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    startAutoScroll();
    galleryTrack.addEventListener('mouseenter', stopAutoScroll);
    galleryTrack.addEventListener('mouseleave', startAutoScroll);
    galleryTrack.addEventListener('touchstart', stopAutoScroll, { passive: true });
    galleryTrack.addEventListener('touchend', () => {
      setTimeout(startAutoScroll, 2500);
    }, { passive: true });

    // Drag-to-scroll support for desktop mouse
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    galleryTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      stopAutoScroll();
      startX = e.pageX - galleryTrack.offsetLeft;
      scrollLeftStart = galleryTrack.scrollLeft;
    });

    galleryTrack.addEventListener('mouseleave', () => {
      isDown = false;
    });

    galleryTrack.addEventListener('mouseup', () => {
      isDown = false;
      setTimeout(startAutoScroll, 3000);
    });

    galleryTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      galleryTrack.scrollLeft = scrollLeftStart - walk;
    });

    // Initialize progress bar
    updateProgressBar();
  }

  // ==========================================================================
  // DIRECT BIG PHOTO AUTO-SCROLL SLIDER ON PROPRIETOR CARD (RESTORED POSITION)
  // ==========================================================================
  const propSlider = document.getElementById('proprietor-photo-slider');
  if (propSlider) {
    const slides = propSlider.querySelectorAll('.proprietor-slide');
    const dots = propSlider.querySelectorAll('.prop-dot');
    const prevSlideBtn = document.getElementById('prop-slide-prev');
    const nextSlideBtn = document.getElementById('prop-slide-next');
    let currentSlide = 0;
    let slideTimer = null;
    const slideDuration = 2800; // 2.8 seconds per picture auto scroll

    const goToSlide = (index) => {
      if (!slides.length) return;
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
      goToSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      goToSlide(currentSlide - 1);
    };

    const startSlideTimer = () => {
      if (slideTimer) clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, slideDuration);
    };

    const resetSlideTimer = () => {
      clearInterval(slideTimer);
      startSlideTimer();
    };

    if (nextSlideBtn) {
      nextSlideBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        resetSlideTimer();
      });
    }

    if (prevSlideBtn) {
      prevSlideBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        resetSlideTimer();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(idx);
        resetSlideTimer();
      });
    });

    // Mobile touch swipe support
    let touchStartX = 0;
    propSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    propSlider.addEventListener('touchend', (e) => {
      const touchDiff = e.changedTouches[0].clientX - touchStartX;
      if (touchDiff < -40) {
        nextSlide();
        resetSlideTimer();
      } else if (touchDiff > 40) {
        prevSlide();
        resetSlideTimer();
      }
    }, { passive: true });

    // Start auto scrolling immediately and keep running continuously
    startSlideTimer();

    // Re-ensure running when page or tab is visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        startSlideTimer();
      }
    });
  }
})();
