
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
            const selectedMode = e.target.value.toLowerCase();
            const activeMainContent = document.querySelector('.main-tab-content.active');

            if (activeMainContent) {
                const tabs = activeMainContent.querySelectorAll('.tab-sub');
                let firstVisibleTab = null;

                tabs.forEach(tab => {
                    const modelId = tab.getAttribute('data-sub');
                    let isMatch = false;

                    if (selectedMode === 'all') {
                        isMatch = true;
                    } else if (selectedMode === 'electric') {
                        isMatch = modelId.includes('ev');
                    } else if (selectedMode === 'petrol' || selectedMode === 'cng') {
                        isMatch = !modelId.includes('ev');
                    }

                    if (isMatch) {
                        tab.style.display = 'block';
                        if (!firstVisibleTab) firstVisibleTab = tab;
                        if (tab.classList.contains('active')) firstVisibleTab = tab;
                    } else {
                        tab.style.display = 'none';
                    }
                });

                if (firstVisibleTab && (!firstVisibleTab.classList.contains('active') || firstVisibleTab.style.display === 'none')) {
                    firstVisibleTab.click();
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

// Globe Initialization with Intersection Observer for Performance
function initGlobe() {
    const globeElement = document.getElementById('Earth-element-3w');
    if (!globeElement) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadGlobe(globeElement);
                observer.unobserve(globeElement);
            }
        });
    }, { rootMargin: '100px' });

    observer.observe(globeElement);
}

function loadGlobe(globeElement) {
    if (typeof Globe === 'undefined') {
        console.warn('Globe library not loaded yet, retrying in 1s...');
        setTimeout(() => loadGlobe(globeElement), 1000);
        return;
    }

    try {
        const globe = Globe()
            (globeElement)
            .backgroundColor('rgba(0,0,0,0)')
            .showAtmosphere(true)
            .atmosphereColor('#bbdefb')
            .atmosphereDaylightAlpha(0.1)
            .globeColor('rgba(235, 245, 255, 1)')
            .width(270)
            .height(270);

        // Optimization: Use a smaller/local dataset if possible, or just handle errors
        fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(countries => {
                globe.polygonsData(countries.features);
            })
            .catch(err => console.error('Error fetching globe data:', err));

        globe
            .polygonCapColor(() => 'rgba(25, 40, 65, 0.7)')
            .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.1)');

        const locationData = [...Array(15).keys()].map(() => ({
            lat: (Math.random() - 0.5) * 180,
            lng: (Math.random() - 0.5) * 360,
            color: '#d52b1e'
        }));

        globe
            .pointsData(locationData)
            .pointColor(d => d.color)
            .pointAltitude(0.01)
            .pointRadius(0.8);

        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 1.2;
        globe.controls().enableZoom = false;
    } catch (e) {
        console.error('Error initializing globe:', e);
    }
}

// Features Slider Logic - Bulletproof Version
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

    // Use multiple event listeners to catch any type of click
    prevBtn.onclick = (e) => {
        e.preventDefault();
        handleScroll('prev');
    };

    nextBtn.onclick = (e) => {
        e.preventDefault();
        handleScroll('next');
    };

    // Add touch support for buttons
    prevBtn.ontouchend = (e) => {
        e.preventDefault();
        handleScroll('prev');
    };

    nextBtn.ontouchend = (e) => {
        e.preventDefault();
        handleScroll('next');
    };
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

// Global Init - Optimized for reduced Total Blocking Time (TBT)
document.addEventListener('DOMContentLoaded', () => {
    // Critical initialization
    initTabs();
    initMegaMenu();

    // Defer non-critical initializations
    const deferInit = () => {
        initSmoothScroll();
        initGlobe();
        initFeaturesSlider();
        initReviewsTabs();

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
