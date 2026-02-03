
// State Management
let modeSelectElement;

// Tab Switching Logic
function initTabs() {
    console.log('Initializing Tabs...');
    const mainTabs = document.querySelectorAll('.tab-main');
    const subTabs = document.querySelectorAll('.tab-sub');
    modeSelectElement = document.querySelector('.mode-dropdown select');

    if (!mainTabs.length) return;

    mainTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.getAttribute('data-main');

            mainTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.main-tab-content').forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });

            // Update Features Slider Content
            renderFeatures(target);

            if (modeSelectElement) {
                modeSelectElement.dispatchEvent(new Event('change'));
            }
        });
    });

    subTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.getAttribute('data-sub');
            const parentSection = tab.closest('.main-tab-content');

            if (parentSection) {
                parentSection.querySelectorAll('.tab-sub').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                parentSection.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                    if (content.id === target) {
                        content.classList.add('active');
                    }
                });
            }
        });
    });

    if (modeSelectElement) {
        modeSelectElement.addEventListener('change', (e) => {
            const selectedMode = e.target.value; // Will be 'all', 'electric', or 'ice'
            const activeMainContent = document.querySelector('.main-tab-content.active');
            console.log('Mode changed to:', selectedMode);

            if (activeMainContent) {
                const tabs = activeMainContent.querySelectorAll('.tab-sub');
                let firstVisibleTab = null;
                let activeTabStillVisible = false;

                tabs.forEach(tab => {
                    const modelId = tab.getAttribute('data-sub');
                    let isMatch = false;

                    if (selectedMode === 'all') {
                        isMatch = true;
                    } else if (selectedMode === 'electric') {
                        isMatch = modelId.toLowerCase().includes('ev');
                    } else if (selectedMode === 'ice') {
                        isMatch = !modelId.toLowerCase().includes('ev');
                    }

                    if (isMatch) {
                        tab.style.display = 'inline-block'; // Use inline-block for flex layout if needed, or just block
                        if (!firstVisibleTab) firstVisibleTab = tab;
                        if (tab.classList.contains('active')) {
                            activeTabStillVisible = true;
                        }
                    } else {
                        tab.style.display = 'none';
                        if (tab.classList.contains('active')) {
                            tab.classList.remove('active');
                        }
                    }
                });

                // If currently active tab is now hidden, click the first available one
                if (!activeTabStillVisible && firstVisibleTab) {
                    firstVisibleTab.click();
                } else if (!activeTabStillVisible && !firstVisibleTab) {
                    // No products match this category in this section
                    activeMainContent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    console.log('No matching products found for this mode in the current section.');
                }
            }
        });
    }
}

// Mega Menu Logic
function initMegaMenu() {
    const navProducts = document.getElementById('navProducts');
    const megaMenu = document.getElementById('megaMenu');

    if (navProducts && megaMenu) {
        navProducts.addEventListener('click', (e) => {
            e.preventDefault();
            megaMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!megaMenu.contains(e.target) && !navProducts.contains(e.target)) {
                megaMenu.classList.remove('active');
            }
        });

        document.querySelectorAll('.mm-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-target');
                document.querySelectorAll('.mm-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.mm-panel').forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === targetId) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }
}



// Utility: Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const subHeader = document.getElementById('subHeader');
                    const offsetTop = target.offsetTop - (subHeader ? 82 : 0);
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    const megaMenu = document.getElementById('megaMenu');
                    if (megaMenu) megaMenu.classList.remove('active');
                }
            }
        });
    });
}



// Features Slider Logic - Dynamic Content
const featuresData = {
    passenger: [
        {
            title: "BEST-IN-CLASS <br> PICKUP OF <br> 0-30 KM/H IN <br> 3.7 SECONDS",
            icon: "fas fa-tachometer-alt"
        },
        {
            title: "BEST-IN-CLASS <br> WATER WADING <br> CAPACITY OF <br> 500 MM",
            icon: "fas fa-water"
        },
        {
            title: "RANGE OF <br> 179 KM",
            icon: "fas fa-map-marked-alt"
        },
        {
            title: "SUPERIOR <br> GRADEABILITY <br> OF 19%",
            icon: "fas fa-mountain"
        },
        {
            title: "POWERFUL <br> 225 CC <br> ENGINE",
            icon: "fas fa-cogs"
        }
    ],
    cargo: [
        {
            title: "Fully Rolling Windows",
            img: "https://www.tvsmotor.com/three-wheelers/-/media/Feature/tvs-three-wheeler/TvsFeatureSlider/TVS-KING-KARGO-HD-EV/Rolling-Window.webp?la=en&hash=45CBDD8FE87E924E21B437CBB5EE96B1"
        },
        {
            title: "Best in Class Loadbality <br> with Leaf Spring",
            img: "https://www.tvsmotor.com/three-wheelers/-/media/Feature/tvs-three-wheeler/TvsFeatureSlider/TVS-KING-KARGO-HD-EV/Heavy-Performance.webp?la=en&hash=2BD0FBA39BBC3B782F8D1CE2B1DD834A"
        },
        {
            title: "Top Speed of 60 km/h",
            img: "https://www.tvsmotor.com/three-wheelers/-/media/Feature/tvs-three-wheeler/TvsFeatureSlider/TVS-KING-KARGO-HD-EV/Max-Speed.webp?la=en&hash=228368D871505B72AA04C163536AB31C"
        },
        {
            title: "Water Wading Capacity",
            img: "https://www.tvsmotor.com/three-wheelers/-/media/Feature/tvs-three-wheeler/TvsFeatureSlider/TVS-KING-KARGO-HD-EV/Water-Wading.webp?la=en&hash=1196ABE4D941028987D1EB37E9D25977"
        },
        {
            title: "Fastest Charging",
            img: "https://www.tvsmotor.com/three-wheelers/-/media/Feature/tvs-three-wheeler/TvsFeatureSlider/TVS-KING-KARGO-HD-EV/Fastest-charging.webp?la=en&hash=2E328687033287B7DC7D60AEF5069AAC"
        },
        {
            title: "Go Far",
            img: "https://www.tvsmotor.com/three-wheelers/-/media/Feature/tvs-three-wheeler/TvsFeatureSlider/TVS-KING-KARGO-HD-EV/Go-Far.webp?la=en&hash=414D7E549819F15A5CCFCF5CA9B77474"
        }
    ]
};

function renderFeatures(category) {
    const slider = document.getElementById('featuresSlider');
    if (!slider) return;

    slider.innerHTML = '';
    const data = featuresData[category] || featuresData.passenger;

    data.forEach(feature => {
        const card = document.createElement('div');
        card.className = 'feature-card-new';

        let visualContent = '';
        if (feature.img) {
            visualContent = `<div class="feature-img-box"><img src="${feature.img}" alt="${feature.title.replace('<br>', ' ')}" loading="lazy"></div>`;
        } else if (feature.icon) {
            visualContent = `<div class="feature-icon-new"><i class="${feature.icon}"></i></div>`;
        }

        card.innerHTML = `
            ${visualContent}
            <p class="feature-title-new">${feature.title}</p>
        `;
        slider.appendChild(card);
    });
}

function initFeaturesSlider() {
    const slider = document.getElementById('featuresSlider');
    const prevBtn = document.getElementById('featuresPrev');
    const nextBtn = document.getElementById('featuresNext');

    if (!slider || !prevBtn || !nextBtn) return;

    const scrollAmount = 350;

    const handleScroll = (direction) => {
        const currentScroll = slider.scrollLeft;
        const newScroll = direction === 'next' ? currentScroll + scrollAmount : currentScroll - scrollAmount;

        slider.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    };

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleScroll('prev');
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleScroll('next');
    });

    // Initial render
    renderFeatures('passenger');
}

// Reviews Tab Switching Logic
function initReviewsTabs() {
    const tabs = document.querySelectorAll('.rev-tab');
    const panels = document.querySelectorAll('.rev-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(p => p.classList.remove('active'));
            if (target === 'videos') document.getElementById('revVideos').classList.add('active');
            if (target === 'blogs') document.getElementById('revBlogs').classList.add('active');
        });
    });

    // Basic Video Slider Logic
    const slider = document.getElementById('videoSlider');
    const prevBtn = document.querySelector('.rev-slider-btn.prev');
    const nextBtn = document.querySelector('.rev-slider-btn.next');

    if (slider && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -400, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 400, behavior: 'smooth' });
        });
    }
}

// Finance Partners Slider Logic
function initFinanceSlider() {
    const track = document.getElementById('financeSliderTrack');
    const dots = document.querySelectorAll('#financeDots .dot');

    if (!track || !dots.length) return;

    let currentIndex = 0;
    const slideCount = dots.length;

    const goToSlide = (index) => {
        currentIndex = index;
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    };

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSlide(index);
        });
    });

    // Auto-play
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
        goToSlide(currentIndex);
    }, 5000);
}

// Video Modal Logic
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    const closeBtn = document.querySelector('.close-modal');
    const videoCards = document.querySelectorAll('.rev-video-card');

    if (!modal || !player || !closeBtn) return;

    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.getAttribute('data-video-id');
            if (videoId) {
                // Use autoplay=1 to play immediately on open
                player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    const closeModal = () => {
        modal.style.display = 'none';
        player.src = ''; // Stop video
        document.body.style.overflow = ''; // Restore scrolling
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Newsletter Submission Logic
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const message = document.getElementById('newsletterMessage');

    if (form && message) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');

            if (emailInput.value) {
                // In a real app, you would send this to a server
                console.log('Subscribing email:', emailInput.value);

                // Simulate success
                form.style.display = 'none';
                message.style.display = 'block';
            }
        });
    }
}

// Global Init - Optimized for reduced Total Blocking Time (TBT)
document.addEventListener('DOMContentLoaded', () => {
    // Critical initialization
    initTabs();
    initMegaMenu();

    // Defer non-critical initializations
    const deferInit = () => {
        initSmoothScroll();

        initFeaturesSlider();
        initReviewsTabs();
        initFinanceSlider();
        initVideoModal();
        initNewsletter();

        // Support for nav bar sub-menu links
        document.querySelectorAll('.sub-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const targetMain = item.getAttribute('data-main');
                const mainTab = document.querySelector(`.tab-main[data-main="${targetMain}"]`);
                if (mainTab) {
                    mainTab.click();
                }
            });
        });
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(deferInit);
    } else {
        setTimeout(deferInit, 200);
    }
});
