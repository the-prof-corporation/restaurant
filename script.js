// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {


    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');

    // Scroll Progress Indicator
    const scrollProgress = document.querySelector('.scroll-progress-bar');
    const sections = document.querySelectorAll('section');
    const navLinksForScroll = document.querySelectorAll('.nav-link');

    // Update scroll progress and active navigation
    window.addEventListener('scroll', function() {
        // Update scroll progress bar
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';

        // Show/hide back to top button
        if (scrollTop > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }

        // Update active navigation based on scroll position
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinksForScroll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });

    // Scroll to top when button is clicked - using faster scrolling
    backToTopButton.addEventListener('click', function() {
        // Use a faster scroll for better performance
        window.scrollTo(0, 0);
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Enhanced Image Modal/Zoom Functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const zoomResetBtn = document.querySelector('.zoom-reset');

    // Mobile zoom controls
    const zoomInMobileBtn = document.querySelector('.zoom-in-mobile');
    const zoomOutMobileBtn = document.querySelector('.zoom-out-mobile');
    const zoomResetMobileBtn = document.querySelector('.zoom-reset-mobile');
    const closeModalMobileBtn = document.querySelector('.close-modal-mobile');

    // Zoom variables
    let zoomLevel = 1;
    let zoomIncrement = 0.25;
    const maxZoom = 8; // Increased max zoom for better mobile viewing
    const minZoom = 0.5;
    let isPinching = false;
    let initialDistance = 0;
    let initialZoom = 1;

    // Check if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        // Adjust zoom increment for mobile
        zoomIncrement = 0.5;
    }

    // Get all images that should be zoomable
    const zoomableImages = document.querySelectorAll('.hero-image, .menu-image-container');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Handle regular modal images (hero and menu images)
    zoomableImages.forEach(image => {
        // Add a visual indicator for zoomable images
        const zoomIndicator = image.querySelector('.zoom-icon');
        if (zoomIndicator) {
            zoomIndicator.style.display = 'flex';
        }

        image.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            zoomLevel = 1; // Reset zoom level when opening modal
            modalImg.style.transform = `scale(${zoomLevel})`;
            currentPosX = 0;
            currentPosY = 0;
        });

    // Handle gallery items to open in new window
    galleryItems.forEach(item => {
        // Add a visual indicator for zoomable images
        const zoomIndicator = item.querySelector('.zoom-icon');
        if (zoomIndicator) {
            zoomIndicator.style.display = 'flex';
        }

        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the image element
            const img = this.querySelector('img');
            if (!img) return;

            // Get image info
            const imgSrc = encodeURIComponent(img.src);
            const imgAlt = encodeURIComponent(img.alt || 'صورة المطعم');

            // Get title from gallery info if available
            let imgTitle = '';
            const infoTitle = this.querySelector('.gallery-info h3');
            const infoDesc = this.querySelector('.gallery-info p');

            if (infoTitle) {
                imgTitle = encodeURIComponent(infoTitle.textContent);
                if (infoDesc) {
                    imgTitle += ' - ' + encodeURIComponent(infoDesc.textContent);
                }
            }

            // Open in new window
            window.open(`viewer.html?src=${imgSrc}&alt=${imgAlt}&title=${imgTitle}`, '_blank', 'width=1000,height=800');
        });
    });

            // If it's a hero image
            if (this.classList.contains('hero-image')) {
                // Check if there's an img element inside (new structure)
                const img = this.querySelector('.hero-img');
                if (img) {
                    modalImg.src = img.src;
                    modalCaption.innerHTML = img.alt || 'صورة مطعم كسراوي';
                } else {
                    // Fallback to old background image method
                    const bgImage = this.style.backgroundImage;
                    if (bgImage) {
                        const imgSrc = bgImage.slice(4, -1).replace(/"/g, "");
                        modalImg.src = imgSrc;
                        modalCaption.innerHTML = 'صورة مطعم كسراوي';
                    }
                }
            }
            // If it's a menu image
            else {
                const img = this.querySelector('img');
                modalImg.src = img.src;
                modalCaption.innerHTML = img.alt;
            }

            // Show appropriate controls based on device
            if (isMobile) {
                document.querySelector('.mobile-zoom-controls').style.display = 'flex';
                document.querySelector('.zoom-controls').style.display = 'none';
            } else {
                document.querySelector('.mobile-zoom-controls').style.display = 'none';
                document.querySelector('.zoom-controls').style.display = 'flex';
            }

            // Add active class to modal for animation
            setTimeout(() => {
                modal.classList.add('active');
                modalImg.classList.add('loaded');
            }, 10);
        });
    });

    // Zoom in button
    zoomInBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent closing the modal
        if (zoomLevel < maxZoom) {
            zoomLevel = Math.min(maxZoom, zoomLevel + zoomIncrement);
            updateImageTransform();
        }
    });

    // Zoom out button
    zoomOutBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent closing the modal
        if (zoomLevel > minZoom) {
            zoomLevel = Math.max(minZoom, zoomLevel - zoomIncrement);
            updateImageTransform();
        }
    });

    // Reset zoom button
    zoomResetBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent closing the modal
        zoomLevel = 1;
        currentPosX = 0;
        currentPosY = 0;
        updateImageTransform();
    });

    // Double-click to zoom
    modalImg.addEventListener('dblclick', function(e) {
        e.preventDefault();

        if (zoomLevel === 1) {
            zoomLevel = 3; // Zoom to 3x on double click
            this.classList.add('zoomed');

            // Center zoom at click point
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Calculate position to center the zoom on the click point
            currentPosX = (rect.width / 2 - clickX) * (zoomLevel - 1);
            currentPosY = (rect.height / 2 - clickY) * (zoomLevel - 1);
        } else {
            zoomLevel = 1;
            this.classList.remove('zoomed');
            currentPosX = 0;
            currentPosY = 0;
        }
        updateImageTransform();
    });

    // Close the modal
    closeModal.addEventListener('click', function() {
        resetModalAndZoom();
    });

    // Close the modal when clicking outside the image
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            resetModalAndZoom();
        }
    });

    // Helper function to reset modal and zoom
    function resetModalAndZoom() {
        modal.classList.remove('active');
        modalImg.classList.remove('zoomed');
        modalImg.classList.remove('loaded');

        // Wait for animation to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
            zoomLevel = 1;
            currentPosX = 0;
            currentPosY = 0;
            modalImg.style.transform = 'scale(1)';
        }, 300);
    }

    // Mobile zoom controls event handlers
    if (zoomInMobileBtn) {
        zoomInMobileBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent closing the modal
            if (zoomLevel < maxZoom) {
                zoomLevel = Math.min(maxZoom, zoomLevel + zoomIncrement);
                updateImageTransform();
            }
        });
    }

    if (zoomOutMobileBtn) {
        zoomOutMobileBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent closing the modal
            if (zoomLevel > minZoom) {
                zoomLevel = Math.max(minZoom, zoomLevel - zoomIncrement);
                updateImageTransform();
            }
        });
    }

    if (zoomResetMobileBtn) {
        zoomResetMobileBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent closing the modal
            zoomLevel = 1;
            currentPosX = 0;
            currentPosY = 0;
            updateImageTransform();
        });
    }

    if (closeModalMobileBtn) {
        closeModalMobileBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            resetModalAndZoom();
        });
    }

    // Improved touch events for mobile devices
    let startX, startY, initialPosX = 0, initialPosY = 0, currentPosX = 0, currentPosY = 0;
    let lastTapTime = 0;
    let touchStartTime = 0;

    modalImg.addEventListener('touchstart', function(e) {
        // Store touch start time for distinguishing between tap and long press
        touchStartTime = new Date().getTime();

        if (e.touches.length === 2) {
            // Pinch to zoom gesture started
            e.preventDefault();
            isPinching = true;
            initialDistance = getDistance(e.touches[0], e.touches[1]);
            initialZoom = zoomLevel;

            // Get the center point between the two touches
            const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

            // Get the position relative to the image
            const rect = modalImg.getBoundingClientRect();
            const touchX = centerX - rect.left;
            const touchY = centerY - rect.top;

            // Store the initial position for centered zooming
            if (zoomLevel === 1) {
                // If we're at normal zoom, remember where the pinch center is
                startX = touchX;
                startY = touchY;
            } else {
                // If already zoomed, prepare for panning
                startX = centerX;
                startY = centerY;
                initialPosX = currentPosX;
                initialPosY = currentPosY;
            }
        } else if (e.touches.length === 1) {
            // Single touch - could be for panning or double-tap
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;

            if (zoomLevel > 1) {
                // If zoomed in, prepare for panning
                e.preventDefault(); // Prevent default scrolling
                initialPosX = currentPosX;
                initialPosY = currentPosY;
            } else {
                // Check for double-tap
                const now = new Date().getTime();
                const timeSince = now - lastTapTime;

                if (timeSince < 300) {
                    // Double-tap detected
                    e.preventDefault();

                    // Get position relative to image
                    const rect = modalImg.getBoundingClientRect();
                    const touchX = touch.clientX - rect.left;
                    const touchY = touch.clientY - rect.top;

                    // Zoom in centered on tap position
                    zoomLevel = 2.5; // Good zoom level for mobile

                    // Calculate position to center the zoom on the tap point
                    currentPosX = (rect.width / 2 - touchX) * (zoomLevel - 1);
                    currentPosY = (rect.height / 2 - touchY) * (zoomLevel - 1);

                    updateImageTransform();

                    // Prevent the next touchend from being processed as a tap
                    lastTapTime = 0;
                } else {
                    // First tap - set up for potential second tap
                    lastTapTime = now;
                }
            }
        }
    }, { passive: false });

    modalImg.addEventListener('touchmove', function(e) {
        // Cancel any pending double-tap
        const now = new Date().getTime();
        if (now - touchStartTime > 100) {
            lastTapTime = 0;
        }

        if (isPinching && e.touches.length === 2) {
            // Handle pinch zoom
            e.preventDefault();

            // Calculate new zoom level based on pinch distance
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scale = currentDistance / initialDistance;
            const newZoomLevel = Math.min(maxZoom, Math.max(minZoom, initialZoom * scale));

            // Only update if zoom level has changed significantly
            if (Math.abs(newZoomLevel - zoomLevel) > 0.01) {
                // Get the center point between the two touches
                const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

                // Get the position relative to the image
                const rect = modalImg.getBoundingClientRect();

                // If we're zooming from normal size, use the initial touch center
                if (zoomLevel === 1) {
                    // Calculate position to keep the pinch center fixed
                    currentPosX = (rect.width / 2 - startX) * (newZoomLevel - 1);
                    currentPosY = (rect.height / 2 - startY) * (newZoomLevel - 1);
                } else {
                    // Adjust position based on zoom change to keep the center point fixed
                    const zoomRatio = newZoomLevel / zoomLevel;
                    currentPosX = initialPosX * zoomRatio + (centerX - startX) * (zoomRatio - 1);
                    currentPosY = initialPosY * zoomRatio + (centerY - startY) * (zoomRatio - 1);
                }

                zoomLevel = newZoomLevel;

                // Limit panning
                const maxPanX = modalImg.width * (zoomLevel - 1);
                const maxPanY = modalImg.height * (zoomLevel - 1);

                currentPosX = Math.max(-maxPanX, Math.min(maxPanX, currentPosX));
                currentPosY = Math.max(-maxPanY, Math.min(maxPanY, currentPosY));

                updateImageTransform();
            }
        } else if (zoomLevel > 1 && e.touches.length === 1) {
            // Handle panning when zoomed in
            e.preventDefault();

            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            // Move the image with the finger
            currentPosX = initialPosX + deltaX;
            currentPosY = initialPosY + deltaY;

            // Limit panning to prevent image from going too far off-screen
            const maxPanX = modalImg.width * (zoomLevel - 1);
            const maxPanY = modalImg.height * (zoomLevel - 1);

            currentPosX = Math.max(-maxPanX, Math.min(maxPanX, currentPosX));
            currentPosY = Math.max(-maxPanY, Math.min(maxPanY, currentPosY));

            updateImageTransform();
        }
    }, { passive: false });

    modalImg.addEventListener('touchend', function(e) {
        // Handle touch end
        const touchDuration = new Date().getTime() - touchStartTime;

        // Reset pinch state
        isPinching = false;

        // If it was a quick tap on a zoomed image, check if we should zoom out
        if (touchDuration < 300 && e.changedTouches.length === 1 && zoomLevel > 1) {
            // If no significant movement occurred, treat as a tap to zoom out
            const touch = e.changedTouches[0];
            const deltaX = Math.abs(touch.clientX - startX);
            const deltaY = Math.abs(touch.clientY - startY);

            if (deltaX < 10 && deltaY < 10) {
                // Reset zoom on tap when already zoomed
                zoomLevel = 1;
                currentPosX = 0;
                currentPosY = 0;
                updateImageTransform();
                lastTapTime = 0; // Prevent double-tap detection
            }
        }
    }, { passive: false });

    // Helper function to calculate distance between two touch points
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Handle keyboard controls for zoom
    window.addEventListener('keydown', function(event) {
        if (modal.style.display === 'block') {
            if (event.key === 'Escape') {
                resetModalAndZoom();
            } else if (event.key === '+' || event.key === '=') {
                if (zoomLevel < maxZoom) {
                    zoomLevel = Math.min(maxZoom, zoomLevel + zoomIncrement);
                    updateImageTransform();
                }
            } else if (event.key === '-') {
                if (zoomLevel > minZoom) {
                    zoomLevel = Math.max(minZoom, zoomLevel - zoomIncrement);
                    updateImageTransform();
                }
            } else if (event.key === '0') {
                zoomLevel = 1;
                currentPosX = 0;
                currentPosY = 0;
                updateImageTransform();
            }
            // Add arrow key navigation for panning when zoomed
            else if (zoomLevel > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
                     event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
                const panAmount = 30; // pixels to pan

                if (event.key === 'ArrowLeft') currentPosX += panAmount;
                if (event.key === 'ArrowRight') currentPosX -= panAmount;
                if (event.key === 'ArrowUp') currentPosY += panAmount;
                if (event.key === 'ArrowDown') currentPosY -= panAmount;

                // Limit panning to prevent image from going too far off-screen
                const maxPanX = modalImg.width * (zoomLevel - 1) / 2;
                const maxPanY = modalImg.height * (zoomLevel - 1) / 2;

                currentPosX = Math.max(-maxPanX, Math.min(maxPanX, currentPosX));
                currentPosY = Math.max(-maxPanY, Math.min(maxPanY, currentPosY));

                updateImageTransform();
                event.preventDefault(); // Prevent page scrolling
            }
        }
    });

    // Add mouse wheel zoom support
    modalImg.addEventListener('wheel', function(e) {
        if (modal.style.display === 'block') {
            e.preventDefault();

            // Determine zoom direction
            const delta = e.deltaY || e.detail || e.wheelDelta;

            if (delta < 0) {
                // Zoom in
                if (zoomLevel < maxZoom) {
                    zoomLevel = Math.min(maxZoom, zoomLevel + zoomIncrement);
                }
            } else {
                // Zoom out
                if (zoomLevel > minZoom) {
                    zoomLevel = Math.max(minZoom, zoomLevel - zoomIncrement);
                }
            }

            updateImageTransform();
        }
    });

    // Helper function to update image transform
    function updateImageTransform() {
        if (zoomLevel === 1) {
            currentPosX = 0;
            currentPosY = 0;
            modalImg.style.transform = `scale(${zoomLevel})`;
        } else {
            modalImg.style.transform = `scale(${zoomLevel}) translate(${currentPosX / zoomLevel}px, ${currentPosY / zoomLevel}px)`;
        }
    }

    // Fixed Navigation for Links
    function setupNavigation() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        scrollLinks.forEach(link => {
            // Remove any existing event listeners to prevent duplicates
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            newLink.addEventListener('click', function(e) {
                e.preventDefault();

                // Get the target ID and element
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (!targetElement) {
                    console.error(`Target element not found: ${targetId}`);
                    return;
                }

                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                }

                // Calculate scroll position with proper offset
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Log for debugging
                console.log(`Scrolling to ${targetId}, position: ${offsetPosition}`);

                // Use smooth scrolling with a callback
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === targetId) {
                        navLink.classList.add('active');
                    }
                });

                // Special handling for menu section
                if (targetId === '#menu') {
                    // Make sure menu is initialized
                    setTimeout(async () => {
                        if (!document.querySelector('.menu-tab')) {
                            const menuData = await loadMenuData();
                            if (menuData && menuData.categories) {
                                generateMenuTabs(menuData.categories);
                                generateMenuItems(menuData.categories);
                                setupMenuFiltering();
                            }
                        }
                    }, 100);
                }
            });
        });
    }

    // Initialize navigation
    setupNavigation();

    // Menu elements
    const menuTabsContainer = document.getElementById('menu-tabs-container');
    const menuItemsContainer = document.getElementById('menu-items');

    // Load menu data from menu.json
    async function loadMenuData() {
        try {
            console.log('Fetching menu data from menu.json...');
            const response = await fetch('menu.json');
            console.log('Fetch response:', response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const menuData = await response.json();
            console.log('Menu data loaded successfully:', menuData);
            return menuData;
        } catch (error) {
            console.error('Error loading menu data:', error);
            // Fallback to hardcoded data if fetch fails
            return {
                "categories": [
                    {
                        "id": "sandwiches",
                        "name": "🥪 ساندوتشات",
                        "items": [
                            {
                                "name": "شاورما فراخ",
                                "prices": {
                                    "بلدي": 15,
                                    "فرنسي": 20
                                }
                            },
                            {
                                "name": "زنجر حار",
                                "prices": {
                                    "بلدي": 15,
                                    "فرنسي": 20
                                }
                            }
                        ]
                    }
                ]
            };
        }
    }

    // Generate menu tabs from categories
    function generateMenuTabs(categories) {
        if (!menuTabsContainer) return;

        // Create "All" tab first
        let tabsHTML = `<button class="menu-tab active" data-category="all">الكل</button>`;

        // Add a tab for each category
        categories.forEach(category => {
            tabsHTML += `
                <button class="menu-tab" data-category="${category.id}">${category.name}</button>
            `;
        });

        menuTabsContainer.innerHTML = tabsHTML;
    }

    // Generate menu items from categories
    function generateMenuItems(categories) {
        if (!menuItemsContainer) return;

        // Create a container for each category with its items
        let menuHTML = '';

        categories.forEach(category => {
            menuHTML += `
                <div class="menu-category" data-category="${category.id}" id="category-${category.id}">
                    <div class="category-header">
                        <h3 class="category-title">${category.name}</h3>
                        <div class="category-divider"></div>
                    </div>
                    <div class="menu-items">
            `;

            // Add items for this category
            category.items.forEach(item => {
                if (item.prices) {
                    // Item with multiple price options
                    menuHTML += `
                        <div class="menu-item" data-category="${category.id}">
                            <div class="menu-item-info">
                                <h3>${item.name}</h3>
                                <p class="menu-item-desc">${item.description || ''}</p>
                            </div>
                            <div class="menu-item-prices">
                    `;

                    // Add each price option
                    Object.entries(item.prices).forEach(([label, price]) => {
                        menuHTML += `
                            <div class="price-option">
                                <span class="price-label">${label}</span>
                                <span class="price-value">${convertToArabicNumerals(price)} جنيه</span>
                            </div>
                        `;
                    });

                    menuHTML += `
                            </div>
                        </div>
                    `;
                } else {
                    // Item with single price
                    menuHTML += `
                        <div class="menu-item" data-category="${category.id}">
                            <div class="menu-item-info">
                                <h3>${item.name}</h3>
                                <p class="menu-item-desc">${item.description || ''}</p>
                            </div>
                            <div class="menu-item-price">${convertToArabicNumerals(item.price)} جنيه</div>
                        </div>
                    `;
                }
            });

            menuHTML += `
                    </div>
                </div>
            `;
        });

        menuItemsContainer.innerHTML = menuHTML;
    }

    // Convert numbers to Arabic numerals
    function convertToArabicNumerals(number) {
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return number.toString().replace(/[0-9]/g, match => arabicNumerals[parseInt(match)]);
    }

    // Improved menu filtering functionality
    function setupMenuFiltering() {
        console.log('Setting up menu filtering...');

        // Get fresh references to elements
        const menuTabsContainer = document.getElementById('menu-tabs-container');

        if (!menuTabsContainer) {
            console.error('Menu tabs container not found');
            return;
        }

        console.log('Menu tabs container found:', menuTabsContainer);
        console.log('Menu tabs:', menuTabsContainer.children.length);

        // Function to reveal menu items with animation
        function revealMenuItems() {
            const menuItems = document.querySelectorAll('.menu-item:not(.revealed)');
            console.log('Revealing menu items:', menuItems.length);

            menuItems.forEach((item, index) => {
                // Add a slight delay for each item to create a cascade effect
                setTimeout(() => {
                    item.classList.add('revealed');
                }, index * 10); // Minimal delay for better performance
            });
        }

        // Initial reveal of visible menu items
        setTimeout(revealMenuItems, 100);

        // Function to handle tab click
        function handleTabClick(tab) {
            console.log('Tab clicked:', tab.textContent.trim());

            // Get fresh references to elements each time to ensure we have the latest
            const menuTabs = document.querySelectorAll('.menu-tab');
            const menuCategories = document.querySelectorAll('.menu-category');

            console.log('Menu categories found:', menuCategories.length);

            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');
            console.log('Selected category:', category);

            // Show/hide menu categories based on category
            menuCategories.forEach(menuCategory => {
                const categoryType = menuCategory.getAttribute('data-category');
                console.log('Checking category:', categoryType);

                if (category === 'all' || categoryType === category) {
                    menuCategory.style.display = 'block';
                    console.log('Showing category:', categoryType);

                    // Reset all menu items in this category to be revealed
                    const items = menuCategory.querySelectorAll('.menu-item');
                    items.forEach(item => {
                        item.classList.remove('revealed');
                    });
                } else {
                    menuCategory.style.display = 'none';
                    console.log('Hiding category:', categoryType);
                }
            });

            // Reveal the visible menu items with animation
            setTimeout(revealMenuItems, 50);

            // Scroll to the first visible category with smooth animation
            if (category !== 'all') {
                const visibleCategory = document.querySelector(`.menu-category[data-category="${category}"]`);
                if (visibleCategory) {
                    setTimeout(() => {
                        const yOffset = -120; // Offset for sticky header
                        const y = visibleCategory.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({
                            top: y,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        }

        // Add event listeners to tabs
        const menuTabs = menuTabsContainer.querySelectorAll('.menu-tab');
        console.log('Adding click listeners to', menuTabs.length, 'tabs');

        menuTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                handleTabClick(this);
            });
        });

        // Manually trigger click on "All" tab to ensure everything is properly initialized
        setTimeout(() => {
            const allTab = document.querySelector('.menu-tab[data-category="all"]');
            if (allTab) {
                console.log('Triggering click on "All" tab');
                allTab.click();
            } else {
                console.error('All tab not found');
                // If "All" tab is not found, show all categories
                const menuCategories = document.querySelectorAll('.menu-category');
                menuCategories.forEach(category => {
                    category.style.display = 'block';
                });
                revealMenuItems();
            }
        }, 200);
    }

    // Add zoom functionality for menu items
    function setupMenuItemZoom() {
        console.log('Setting up menu item zoom functionality');

        document.addEventListener('click', function(e) {
            // Check if we clicked on a menu item or its child
            const menuItem = e.target.closest('.menu-item');

            // If we clicked on a menu item
            if (menuItem) {
                console.log('Menu item clicked:', menuItem);

                // If the item is already zoomed, unzoom it
                if (menuItem.classList.contains('zoomed')) {
                    menuItem.classList.remove('zoomed');
                    document.body.style.overflow = '';
                    console.log('Menu item unzoomed');
                } else {
                    // First, remove zoomed class from any other menu items
                    document.querySelectorAll('.menu-item.zoomed').forEach(item => {
                        item.classList.remove('zoomed');
                    });

                    // Add zoomed class to the clicked menu item
                    menuItem.classList.add('zoomed');
                    console.log('Menu item zoomed');

                    // Prevent scrolling when zoomed
                    document.body.style.overflow = 'hidden';

                    // Add event listener to close zoom when clicking outside
                    setTimeout(() => {
                        const closeZoom = function(e) {
                            if (!e.target.closest('.menu-item.zoomed')) {
                                document.querySelectorAll('.menu-item.zoomed').forEach(item => {
                                    item.classList.remove('zoomed');
                                });
                                document.body.style.overflow = '';
                                document.removeEventListener('click', closeZoom);
                                console.log('Zoom closed by clicking outside');
                            }
                        };

                        document.addEventListener('click', closeZoom);
                    }, 10);
                }
            }
        });
    }

    // Improved menu initialization function
    async function initializeMenu() {
        console.log('Initializing menu...');

        // Get fresh references to elements
        const menuItemsContainer = document.getElementById('menu-items');



        try {
            // Load menu data from JSON file
            const menuData = await loadMenuData();

            if (menuData && menuData.categories) {
                console.log('Menu data loaded successfully with', menuData.categories.length, 'categories');

                // Generate menu tabs and items
                generateMenuTabs(menuData.categories);
                generateMenuItems(menuData.categories);

                // Setup menu filtering with a slight delay to ensure DOM is updated
                setTimeout(() => {
                    setupMenuFiltering();
                    setupMenuItemZoom();

                    // Log menu tabs for debugging
                    const menuTabs = document.querySelectorAll('.menu-tab');
                    console.log('Menu tabs generated:', menuTabs.length);

                    // Manually trigger click on "All" tab to ensure everything is properly initialized
                    const allTab = document.querySelector('.menu-tab[data-category="all"]');
                    if (allTab) {
                        console.log('Triggering click on "All" tab');
                        allTab.click();
                    } else {
                        console.error('All tab not found');
                        // If "All" tab is not found, show all categories
                        const menuCategories = document.querySelectorAll('.menu-category');
                        menuCategories.forEach(category => {
                            category.style.display = 'block';
                        });



        }
    }

    // Initialize menu when DOM is fully loaded
    // This is handled by the main DOMContentLoaded event at the beginning of the file

    // Function to setup the menu button
    function setupMenuButton() {
        const menuBtn = document.querySelector('.menu-btn');
        if (!menuBtn) {
            console.error('Menu button not found');
            return;
        }

        // Remove any existing event listeners
        const newMenuBtn = menuBtn.cloneNode(true);
        menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);

        // Add new event listener
        newMenuBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('Menu button clicked');

            // Ensure menu tabs are generated
            if (!document.querySelector('.menu-tab')) {
                console.log('Generating menu tabs and items');
                const menuData = await loadMenuData();
                if (menuData && menuData.categories) {
                    generateMenuTabs(menuData.categories);
                    generateMenuItems(menuData.categories);
                    setupMenuFiltering();
                }
            }

            // Get the menu section
            const menuSection = document.querySelector('#menu');
            if (!menuSection) {
                console.error('Menu section not found');
                return;
            }

            // Calculate scroll position
            const headerOffset = 80;
            const elementPosition = menuSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            console.log(`Scrolling to menu section, position: ${offsetPosition}`);

            // Scroll to the menu section
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('href') === '#menu') {
                    navLink.classList.add('active');
                }
            });

            // Ensure menu tabs are visible
            setTimeout(async () => {
                const menuTabsContainer = document.getElementById('menu-tabs-container');
                if (menuTabsContainer && menuTabsContainer.children.length === 0) {
                    console.log('Regenerating menu tabs');
                    const menuData = await loadMenuData();
                    if (menuData && menuData.categories) {
                        generateMenuTabs(menuData.categories);
                        setupMenuFiltering();
                    }
                }
            }, 300);
        });
    }

    // Add swipe gesture and indicators for mobile menu navigation
    function setupSwipeNavigation() {
        let touchStartX = 0;
        let touchEndX = 0;
        const menuTabsElement = document.querySelector('.menu-tabs');
        const menuTabsContainer = document.querySelector('.menu-tabs-container');
        const swipeLeftIndicator = document.querySelector('.swipe-indicator.swipe-left');
        const swipeRightIndicator = document.querySelector('.swipe-indicator.swipe-right');

        if (menuTabsElement && menuTabsContainer) {
            // Touch swipe detection
            document.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, false);

            document.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);

            function handleSwipe() {
                const menuTabs = Array.from(document.querySelectorAll('.menu-tab'));
                const activeTabIndex = menuTabs.findIndex(tab => tab.classList.contains('active'));

                if (activeTabIndex === -1) return;

                // Swipe left (next category)
                if (touchEndX < touchStartX - 50) {
                    const nextTab = menuTabs[activeTabIndex + 1];
                    if (nextTab) {
                        nextTab.click();
                    }
                }

                // Swipe right (previous category)
                if (touchEndX > touchStartX + 50) {
                    const prevTab = menuTabs[activeTabIndex - 1];
                    if (prevTab) {
                        prevTab.click();
                    }
                }
            }

            // Swipe indicators click handlers
            if (swipeLeftIndicator && swipeRightIndicator) {
                swipeLeftIndicator.addEventListener('click', () => {
                    menuTabsContainer.scrollBy({
                        left: 100,
                        behavior: 'smooth'
                    });
                });

                swipeRightIndicator.addEventListener('click', () => {
                    menuTabsContainer.scrollBy({
                        left: -100,
                        behavior: 'smooth'
                    });
                });

                // Show/hide indicators based on scroll position
                menuTabsContainer.addEventListener('scroll', () => {
                    const isAtStart = menuTabsContainer.scrollLeft <= 10;
                    const isAtEnd = menuTabsContainer.scrollLeft + menuTabsContainer.clientWidth >= menuTabsContainer.scrollWidth - 10;

                    swipeRightIndicator.style.opacity = isAtStart ? '0.3' : '1';
                    swipeLeftIndicator.style.opacity = isAtEnd ? '0.3' : '1';
                });

                // Initial check
                setTimeout(() => {
                    const isAtStart = menuTabsContainer.scrollLeft <= 10;
                    const isAtEnd = menuTabsContainer.scrollLeft + menuTabsContainer.clientWidth >= menuTabsContainer.scrollWidth - 10;

                    swipeRightIndicator.style.opacity = isAtStart ? '0.3' : '1';
                    swipeLeftIndicator.style.opacity = isAtEnd ? '0.3' : '1';
                }, 500);
            }
        }
    }

    // Initialize swipe navigation after menu is loaded
    // This is handled by the main DOMContentLoaded event at the beginning of the file

    // Improved Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get the submit button
            const submitButton = this.querySelector('button[type="submit"]');
            setButtonLoading(submitButton, true);

            // Get form container for success message
            const formContainer = this.closest('.contact-form-container');

            try {
                // Get form values
                const name = document.getElementById('contact-name').value.trim();
                const phone = document.getElementById('contact-phone').value.trim();
                const message = document.getElementById('contact-message').value.trim();

                // Basic validation
                if (!name || !phone || !message) {
                    alert('يرجى ملء جميع الحقول المطلوبة');
                    setButtonLoading(submitButton, false);
                    return;
                }

                // Phone validation - more flexible now
                const phoneDigits = phone.replace(/\D/g, '');
                if (phoneDigits.length < 10) {
                    alert('يرجى إدخال رقم هاتف صالح (10 أرقام على الأقل)');
                    setButtonLoading(submitButton, false);
                    return;
                }

                // Get current date and time
                const now = new Date();
                let dateStr, timeStr;

                try {
                    dateStr = now.toLocaleDateString('ar-EG');
                    timeStr = now.toLocaleTimeString('ar-EG');
                } catch (error) {
                    // Fallback if Arabic locale is not supported
                    dateStr = now.toLocaleDateString();
                    timeStr = now.toLocaleTimeString();
                }

                // Prepare WhatsApp message
                let whatsappMessage = `*رسالة جديدة من موقع كسراوي*\n\n`;
                whatsappMessage += `*الاسم:* ${name}\n`;
                whatsappMessage += `*رقم الهاتف:* ${phone}\n`;
                whatsappMessage += `*الرسالة:*\n${message}\n\n`;
                whatsappMessage += `*تاريخ الرسالة:* ${dateStr}\n`;
                whatsappMessage += `*وقت الرسالة:* ${timeStr}`;

                // Format phone number for WhatsApp
                const restaurantPhone = '201066431343'; // Restaurant's WhatsApp number

                // Encode the message for WhatsApp URL
                const encodedMessage = encodeURIComponent(whatsappMessage);

                // Create WhatsApp URL
                const whatsappURL = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;

                // Show success message
                showSuccessMessage(formContainer, 'شكراً لتواصلك معنا! تم استلام رسالتك وسنرد عليك قريباً.');

                // Reset the form
                contactForm.reset();

                // Reset button state
                setButtonLoading(submitButton, false);

                // Open WhatsApp with the message after a short delay
                setTimeout(() => {
                    try {
                        const newWindow = window.open(whatsappURL, '_blank');

                        // Check if popup was blocked
                        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                            console.error('WhatsApp popup was blocked');
                            alert('يبدو أن متصفحك يمنع النوافذ المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع ثم المحاولة مرة أخرى.');
                        } else {
                            console.log('WhatsApp window opened successfully');
                        }
                    } catch (error) {
                        console.error('Error opening WhatsApp:', error);
                        alert('حدث خطأ أثناء فتح واتساب. يرجى المحاولة مرة أخرى أو نسخ الرسالة ولصقها في واتساب يدوياً.');
                    }
                }, 1500);

                // Log the form data
                console.log('Contact message sent to WhatsApp:', {
                    name, phone, message, date: dateStr, time: timeStr
                });

            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
                setButtonLoading(submitButton, false);
            }
        });
    }

    // Improved Order Form Integration
    const orderForm = document.getElementById('order-form');
    const googleOrderForm = document.getElementById('google-order-form');
    // const fallbackForm = document.querySelector('.fallback-form'); // Commented out as it's not used

    // Function to show loading state on button
    function setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.setAttribute('data-original-text', button.innerHTML);
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            button.disabled = true;
            button.classList.add('loading');
        } else {
            if (button.hasAttribute('data-original-text')) {
                button.innerHTML = button.getAttribute('data-original-text');
                button.removeAttribute('data-original-text');
            }
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    // Function to show success message
    function showSuccessMessage(formContainer, message) {
        // Create success message element if it doesn't exist
        let successMessage = formContainer.querySelector('.form-success-message');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            formContainer.appendChild(successMessage);
        }

        // Set message and show
        successMessage.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <p>${message}</p>
        `;
        successMessage.style.display = 'block';

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide after 5 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => {
                successMessage.style.display = 'none';
                successMessage.style.opacity = '1';
            }, 500);
        }, 5000);
    }

    // Improved function to format phone number for WhatsApp - Used in the WhatsApp URL creation
    function formatPhoneNumber(phone) {
        // Remove all non-digit characters
        let digits = phone.replace(/\D/g, '');

        // If it starts with 0, replace with country code
        if (digits.startsWith('0')) {
            digits = '2' + digits;
        }

        // If it doesn't have country code, add it
        if (!digits.startsWith('20')) {
            digits = '20' + digits;
        }

        console.log('Formatted phone number:', digits);
        return digits;
    }

    // Handle the order form submission
    if (googleOrderForm) {
        googleOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get the submit button
            const submitButton = this.querySelector('button[type="submit"]');
            setButtonLoading(submitButton, true);

            // Get form container for success message
            const formContainer = this.closest('.google-form-container');

            try {
                // Basic form validation
                const name = document.getElementById('g-name').value.trim();
                const phone = document.getElementById('g-phone').value.trim();
                const orderType = document.getElementById('g-order-type').value;
                const orderItems = document.getElementById('g-order-items').value.trim();

                if (!name || !phone || !orderType || !orderItems) {
                    alert('يرجى ملء جميع الحقول المطلوبة');
                    setButtonLoading(submitButton, false);
                    return;
                }

                // Phone validation - more flexible now
                const phoneDigits = phone.replace(/\D/g, '');
                if (phoneDigits.length < 10) {
                    alert('يرجى إدخال رقم هاتف صالح (10 أرقام على الأقل)');
                    setButtonLoading(submitButton, false);
                    return;
                }

                // If delivery is selected, address is required
                const address = document.getElementById('g-address').value.trim();
                if (orderType === 'delivery' && !address) {
                    alert('يرجى إدخال عنوان التوصيل');
                    setButtonLoading(submitButton, false);
                    return;
                }

                // Get additional notes
                const notes = document.getElementById('g-notes').value.trim();

                // Get current date and time
                const now = new Date();
                const dateStr = now.toLocaleDateString('ar-EG');
                const timeStr = now.toLocaleTimeString('ar-EG');

                // Prepare WhatsApp message
                let message = `*طلب جديد من مطعم كسراوي*\n\n`;
                message += `*الاسم:* ${name}\n`;
                message += `*رقم الهاتف:* ${phone}\n`;
                message += `*نوع الطلب:* ${orderType === 'delivery' ? 'توصيل' : 'استلام من المطعم'}\n`;
                message += `*الطلبات:*\n${orderItems}\n\n`;

                if (address) {
                    message += `*العنوان:* ${address}\n\n`;
                }

                if (notes) {
                    message += `*ملاحظات إضافية:*\n${notes}\n\n`;
                }

                message += `*تاريخ الطلب:* ${dateStr}\n`;
                message += `*وقت الطلب:* ${timeStr}`;

                // Use restaurant's phone number instead of customer's
                const restaurantPhone = '201066431343'; // Restaurant's WhatsApp number

                // Encode the message for WhatsApp URL
                const encodedMessage = encodeURIComponent(message);

                // Create WhatsApp URL with restaurant's number
                const whatsappURL = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;

                console.log('WhatsApp URL:', whatsappURL);

                // Show success message
                showSuccessMessage(formContainer, 'تم إرسال طلبك بنجاح! سيتم تحويلك إلى واتساب لإكمال الطلب.');

                // Reset the form
                googleOrderForm.reset();

                // Reset button state
                setButtonLoading(submitButton, false);

                // Open WhatsApp with the message after a short delay
                setTimeout(() => {
                    try {
                        const newWindow = window.open(whatsappURL, '_blank');

                        // Check if popup was blocked
                        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                            console.error('WhatsApp popup was blocked');
                            alert('يبدو أن متصفحك يمنع النوافذ المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع ثم المحاولة مرة أخرى.');
                        } else {
                            console.log('WhatsApp window opened successfully');
                        }
                    } catch (error) {
                        console.error('Error opening WhatsApp:', error);
                        alert('حدث خطأ أثناء فتح واتساب. يرجى المحاولة مرة أخرى أو نسخ الرسالة ولصقها في واتساب يدوياً.');
                    }
                }, 1500);

                // Log the form data
                console.log('Order data sent to WhatsApp:', {
                    name, phone, orderType, orderItems, address, notes, date: dateStr, time: timeStr
                });

            } catch (error) {
                console.error('Error submitting order form:', error);
                alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
                setButtonLoading(submitButton, false);
            }
        });
    }

    // Improved Fallback Form Validation
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get the submit button
            const submitButton = this.querySelector('button[type="submit"]');
            setButtonLoading(submitButton, true);

            // Get form container for success message
            const formContainer = this.closest('.container');

            try {
                // Basic form validation
                const name = document.getElementById('name').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const date = document.getElementById('date').value;
                const time = document.getElementById('time').value;
                const specialRequests = document.getElementById('special-requests').value.trim();

                if (!name || !phone || !date || !time) {
                    alert('يرجى ملء جميع الحقول المطلوبة');
                    setButtonLoading(submitButton, false);
                    return;
                }

                // Phone validation - more flexible now
                const phoneDigits = phone.replace(/\D/g, '');
                if (phoneDigits.length < 10) {
                    alert('يرجى إدخال رقم هاتف صالح (10 أرقام على الأقل)');
                    setButtonLoading(submitButton, false);
                    return;
                }

                // Date validation - ensure it's not in the past
                const selectedDate = new Date(date);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to start of day

                if (selectedDate < today) {
                    alert('يرجى اختيار تاريخ في المستقبل');
                    setButtonLoading(submitButton, false);
                    return;
                }

                // Format date and time for display
                let formattedDate;
                try {
                    formattedDate = selectedDate.toLocaleDateString('ar-EG');
                } catch (error) {
                    // Fallback if Arabic locale is not supported
                    formattedDate = selectedDate.toLocaleDateString();
                }

                const formattedTime = time;

                // Get current date and time for order timestamp
                const now = new Date();
                let orderDateStr, orderTimeStr;

                try {
                    orderDateStr = now.toLocaleDateString('ar-EG');
                    orderTimeStr = now.toLocaleTimeString('ar-EG');
                } catch (error) {
                    // Fallback if Arabic locale is not supported
                    orderDateStr = now.toLocaleDateString();
                    orderTimeStr = now.toLocaleTimeString();
                }

                // Prepare WhatsApp message
                let message = `*حجز جديد في مطعم كسراوي*\n\n`;
                message += `*الاسم:* ${name}\n`;
                message += `*رقم الهاتف:* ${phone}\n`;
                message += `*تاريخ الحجز:* ${formattedDate}\n`;
                message += `*وقت الحجز:* ${formattedTime}\n\n`;

                if (specialRequests) {
                    message += `*طلبات خاصة:*\n${specialRequests}\n\n`;
                }

                message += `*تم الحجز في:* ${orderDateStr} ${orderTimeStr}`;

                // Format phone number for WhatsApp
                const restaurantPhone = '201066431343'; // Restaurant's WhatsApp number

                // Encode the message for WhatsApp URL
                const encodedMessage = encodeURIComponent(message);

                // Create WhatsApp URL
                const whatsappURL = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;

                // Show success message
                showSuccessMessage(formContainer, 'تم إرسال حجزك بنجاح! سيتم تحويلك إلى واتساب لإكمال الحجز.');

                // Reset the form
                orderForm.reset();

                // Reset button state
                setButtonLoading(submitButton, false);

                // Open WhatsApp with the message after a short delay
                setTimeout(() => {
                    try {
                        const newWindow = window.open(whatsappURL, '_blank');

                        // Check if popup was blocked
                        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                            console.error('WhatsApp popup was blocked');
                            alert('يبدو أن متصفحك يمنع النوافذ المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع ثم المحاولة مرة أخرى.');
                        } else {
                            console.log('WhatsApp window opened successfully');
                        }
                    } catch (error) {
                        console.error('Error opening WhatsApp:', error);
                        alert('حدث خطأ أثناء فتح واتساب. يرجى المحاولة مرة أخرى أو نسخ الرسالة ولصقها في واتساب يدوياً.');
                    }
                }, 1500);

                // Log the form data
                console.log('Reservation data sent to WhatsApp:', {
                    name, phone, date: formattedDate, time: formattedTime,
                    specialRequests, orderDate: orderDateStr, orderTime: orderTimeStr
                });

            } catch (error) {
                console.error('Error submitting reservation form:', error);
                alert('حدث خطأ أثناء إرسال الحجز. يرجى المحاولة مرة أخرى.');
                setButtonLoading(submitButton, false);
            }
        });
    }

    // Direct WhatsApp Order Button
    const directWhatsAppBtn = document.getElementById('direct-whatsapp-order');
    if (directWhatsAppBtn) {
        directWhatsAppBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Restaurant's WhatsApp number
            const restaurantPhone = '201066431343';

            // Get current date and time
            const now = new Date();
            let dateStr, timeStr;

            try {
                dateStr = now.toLocaleDateString('ar-EG');
                timeStr = now.toLocaleTimeString('ar-EG');
            } catch (error) {
                // Fallback if Arabic locale is not supported
                dateStr = now.toLocaleDateString();
                timeStr = now.toLocaleTimeString();
            }

            // Prepare a simple message
            let message = `*طلب جديد من مطعم كسراوي*\n\n`;
            message += `أرغب في تقديم طلب من مطعم كسراوي\n\n`;
            message += `*تاريخ الطلب:* ${dateStr}\n`;
            message += `*وقت الطلب:* ${timeStr}`;

            // Encode the message for WhatsApp URL
            const encodedMessage = encodeURIComponent(message);

            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;

            // Open WhatsApp with the message
            try {
                const newWindow = window.open(whatsappURL, '_blank');

                // Check if popup was blocked
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    console.error('WhatsApp popup was blocked');
                    alert('يبدو أن متصفحك يمنع النوافذ المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع ثم المحاولة مرة أخرى.');
                } else {
                    console.log('WhatsApp window opened successfully');
                }
            } catch (error) {
                console.error('Error opening WhatsApp:', error);
                alert('حدث خطأ أثناء فتح واتساب. يرجى المحاولة مرة أخرى.');
            }
        });
    }

    // Scroll Animation for Elements
    const revealElements = document.querySelectorAll('.menu-item, .contact-item');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    }

    // Initial check on page load
    revealOnScroll();

    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    // Header and Menu Tabs Scroll Effect
    const header = document.querySelector('header');
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    const menuTabs = document.querySelector('.menu-tabs');
    const menuSection = document.getElementById('menu');

    window.addEventListener('scroll', function() {
        // Header effect
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Menu tabs sticky effect
        if (menuSection) {
            const menuSectionTop = menuSection.offsetTop;
            const menuSectionHeight = menuSection.offsetHeight;

            if (window.scrollY > menuSectionTop && window.scrollY < (menuSectionTop + menuSectionHeight - 200)) {
                menuTabs.classList.add('sticky');
            } else {
                menuTabs.classList.remove('sticky');
            }
        }

        // Update scroll progress bar
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgressBar.style.width = scrollPercent + '%';
    });
});