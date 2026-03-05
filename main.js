import { content } from './content.js';

document.addEventListener('DOMContentLoaded', () => {
    // 0. Inject Dynamic Styles
    const root = document.documentElement;
    const { colors, typography } = content.styleConfig;

    root.style.setProperty('--primary', colors.primaryRed);
    root.style.setProperty('--whatsapp', colors.primaryGreen);
    root.style.setProperty('--bg-light', colors.bgLight);
    root.style.setProperty('--bg-off', colors.bgGray);
    root.style.setProperty('--bg-dark', colors.footerBg);
    root.style.setProperty('--logo-height-web', content.brand.logoHeight.web);
    root.style.setProperty('--logo-height-mobile', content.brand.logoHeight.mobile);
    root.style.setProperty('--button-radius', typography.buttonRadius);

    const styleTag = document.createElement('style');
    styleTag.textContent = `
        .hero h1 { font-size: ${typography.heroTitleSize.mobile}; }
        .hero p { font-size: ${typography.heroSubtitleSize.mobile}; }
        .section-padding h2 { font-size: ${typography.sectionTitleSize.mobile}; }
        body { font-size: ${typography.bodySize.mobile}; }
        @media (min-width: 992px) {
            .hero h1 { font-size: ${typography.heroTitleSize.web}; }
            .hero p { font-size: ${typography.heroSubtitleSize.web}; }
            .section-padding h2 { font-size: ${typography.sectionTitleSize.web}; }
            body { font-size: ${typography.bodySize.web}; }
        }
    `;
    document.head.appendChild(styleTag);

    const waIcon = `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; margin-right: 10px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .018 5.396.015 12.03c0 2.123.551 4.197 1.594 6.039L0 24l6.105-1.602a11.834 11.834 0 0 0 5.937 1.598h.005c6.637 0 12.032-5.395 12.035-12.03a11.782 11.782 0 0 0-3.48-8.517z"/></svg>`;

    // 1. Inject Brand Info
    document.title = `${content.brand.name} | ${content.brand.suffix}`;
    const logoEl = document.getElementById('brand-logo');
    const logoText = logoEl.querySelector('.logo-text');
    if (logoText) {
        logoText.innerHTML = `${content.brand.name}<span>.</span>`;
    }

    // 2. Hero Section
    document.getElementById('hero-title').textContent = content.hero.title;
    document.getElementById('hero-subtitle').textContent = content.hero.subtitle;

    const heroBtnPrimary = document.getElementById('hero-cta-primary');
    heroBtnPrimary.innerHTML = `${waIcon} ${content.hero.ctaPrimary}`;

    document.getElementById('hero-cta-secondary').textContent = content.hero.ctaSecondary;

    // Fix Video Injection
    const videoEl = document.getElementById('hero-video-el');
    videoEl.src = content.hero.videoUrl;
    videoEl.load();

    // 3. Value Proposition
    const valuePropGrid = document.getElementById('value-prop-grid');
    valuePropGrid.innerHTML = '';
    content.valueProp.items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'value-card reveal';
        card.style.transitionDelay = `${index * 0.15}s`;
        card.innerHTML = `
            <span class="material-symbols-outlined" style="color: ${item.color || 'var(--primary)'}">${item.icon}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        `;
        valuePropGrid.appendChild(card);
    });

    // 4. Storytelling
    document.getElementById('story-title').textContent = content.storytelling.title;
    document.getElementById('story-text').textContent = content.storytelling.text;
    document.getElementById('story-img-el').src = content.storytelling.image;

    // 5. Product Categories Gallery (Infinite Scroll Logic)
    document.getElementById('categories-title').textContent = content.categories.title;
    const categoryTrack = document.getElementById('category-grid-el');

    const createCard = (item) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="category-vertical-title">${item.name}</div>
            <div class="category-info">
                <p>${item.description}</p>
                <span class="btn btn-primary">
                    ${waIcon}
                    ${item.cta}
                </span>
            </div>
        `;
        card.addEventListener('click', () => {
            const whatsappUrl = `https://wa.me/${content.brand.contact.whatsapp}?text=${encodeURIComponent(`Olá! Vi o pneu para ${item.name} no site e gostaria de saber modelos e preços.`)}`;
            window.open(whatsappUrl, '_blank');
            trackEvent('product_click', { product: item.name });
        });
        return card;
    };

    // Inject cards (we'll inject them twice for a smoother loop)
    const injectCards = () => {
        categoryTrack.innerHTML = '';
        [...content.categories.items, ...content.categories.items].forEach(item => {
            categoryTrack.appendChild(createCard(item));
        });
    }
    injectCards();

    // 5.1 Auto-scroll Logic (Interactive)
    const galleryContainer = document.querySelector('.gallery-container');
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollInterval;
    const scrollSpeed = 1; // pixels per frame

    const startAutoScroll = () => {
        if (autoScrollInterval) return;
        autoScrollInterval = setInterval(() => {
            if (!isDown) {
                galleryContainer.scrollLeft += scrollSpeed;
                // Infinite loop check
                if (galleryContainer.scrollLeft >= categoryTrack.scrollWidth / 2) {
                    galleryContainer.scrollLeft = 0;
                }
            }
        }, 30);
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    };

    galleryContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - galleryContainer.offsetLeft;
        scrollLeft = galleryContainer.scrollLeft;
        stopAutoScroll();
    });

    galleryContainer.addEventListener('mouseleave', () => {
        isDown = false;
        startAutoScroll();
    });

    galleryContainer.addEventListener('mouseup', () => {
        isDown = false;
        startAutoScroll();
    });

    galleryContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryContainer.offsetLeft;
        const walk = (x - startX) * 2;
        galleryContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    galleryContainer.addEventListener('touchstart', () => {
        stopAutoScroll();
    }, { passive: true });

    galleryContainer.addEventListener('touchend', () => {
        setTimeout(startAutoScroll, 1000);
    }, { passive: true });

    startAutoScroll();

    // 6. Differentials
    document.getElementById('differentials-title').textContent = content.differentials.title;
    document.getElementById('differentials-subtitle').textContent = content.differentials.subtitle;
    const diffList = document.getElementById('differentials-list');
    diffList.innerHTML = '';
    content.differentials.items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'diff-item reveal';
        itemEl.style.transitionDelay = `${index * 0.1}s`;
        itemEl.innerHTML = `
            <div class="icon-box">
                <span class="material-symbols-outlined">${item.icon}</span>
            </div>
            <div>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
            </div>
        `;
        diffList.appendChild(itemEl);
    });

    // 7. How it Works
    document.getElementById('how-title').textContent = content.howItWorks.title;
    const stepsGrid = document.getElementById('how-steps');
    stepsGrid.innerHTML = '';
    content.howItWorks.steps.forEach(step => {
        const stepEl = document.createElement('div');
        stepEl.className = 'step reveal';
        stepEl.innerHTML = `
            <div class="step-icon-wrapper">
                <span class="step-number">${step.number}</span>
            </div>
            <p>${step.text}</p>
        `;
        stepsGrid.appendChild(stepEl);
    });

    // 8. Final CTA
    const finalCtaSection = document.getElementById('final-cta-section');
    if (finalCtaSection && content.finalCta.backgroundImage) {
        finalCtaSection.style.backgroundImage = `linear-gradient(rgba(204, 0, 0, 0.4), rgba(10, 10, 10, 0.9)), url('${content.finalCta.backgroundImage}')`;
    }

    document.getElementById('final-cta-title').textContent = content.finalCta.title;
    document.getElementById('final-cta-subtitle').textContent = content.finalCta.subtitle;
    const finalCtaBtn = document.getElementById('final-cta-btn');
    finalCtaBtn.innerHTML = `
        ${waIcon}
        ${content.finalCta.buttonText}
    `;

    // 9. Footer
    document.getElementById('footer-logo').innerHTML = `${content.brand.name}<span>.</span>`;
    document.getElementById('footer-tagline').textContent = content.brand.tagline;
    document.getElementById('copyright-brand').textContent = content.brand.name;

    const contactInfo = document.getElementById('footer-contact-info');
    let contactHtml = '';
    if (content.brand.contact.email) contactHtml += `<p>Email: ${content.brand.contact.email}</p>`;
    if (content.brand.contact.phone) contactHtml += `<p>WhatsApp: ${content.brand.contact.phone}</p>`;
    if (content.brand.contact.hours) contactHtml += `<p>Horário: ${content.brand.contact.hours}</p>`;
    if (content.brand.contact.address) contactHtml += `<p>${content.brand.contact.address}</p>`;
    if (content.brand.contact.cnpj) contactHtml += `<p>CNPJ: ${content.brand.contact.cnpj}</p>`;
    contactInfo.innerHTML = contactHtml;

    const socialLinks = document.getElementById('footer-social-links');
    let socialHtml = '';
    if (content.brand.social.instagram) socialHtml += `<a href="${content.brand.social.instagram}" target="_blank">Instagram</a>`;
    if (content.brand.social.facebook) socialHtml += `<a href="${content.brand.social.facebook}" target="_blank">Facebook</a>`;
    if (content.brand.social.linkedin) socialHtml += `<a href="${content.brand.social.linkedin}" target="_blank">LinkedIn</a>`;
    socialLinks.innerHTML = socialHtml || `<a href="#" class="whatsapp-link">Contato</a>`;

    // 10. WhatsApp Links Setup & Tracking
    const whatsappUrl = `https://wa.me/${content.brand.contact.whatsapp}?text=${encodeURIComponent(content.brand.contact.whatsappMessage)}`;
    document.querySelectorAll('.whatsapp-link').forEach(link => {
        link.href = whatsappUrl;
        link.target = "_blank";
        link.addEventListener('click', () => {
            trackEvent('whatsapp_click', {
                location: link.id || link.className,
                text: link.textContent.trim()
            });
        });
    });

    // 11. Scroll Animations & Tracking
    const header = document.getElementById('header');
    let scrollDepthTracked = { p25: false, p50: false, p75: false, p100: false };

    const tireEl = document.getElementById('header-tire-el');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Tire Rotation Logic
        const rotation = currentScrollY * 1.2;
        if (tireEl) {
            tireEl.style.transform = `rotate(${rotation}deg)`;
        }

        lastScrollY = currentScrollY;
        revealOnScroll();
        trackScrollDepth();
    });

    function trackEvent(eventName, params = {}) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, ...params });
        if (typeof gtag === 'function') gtag('event', eventName, params);
        if (typeof fbq === 'function') {
            if (eventName === 'whatsapp_click' || eventName === 'product_click') fbq('track', 'Contact', params);
        }
    }

    function trackScrollDepth() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) return;
        const scrollPercent = (window.scrollY / scrollHeight) * 100;

        if (scrollPercent >= 25 && !scrollDepthTracked.p25) { trackEvent('scroll_depth', { percentage: 25 }); scrollDepthTracked.p25 = true; }
        if (scrollPercent >= 50 && !scrollDepthTracked.p50) { trackEvent('scroll_depth', { percentage: 50 }); scrollDepthTracked.p50 = true; }
        if (scrollPercent >= 75 && !scrollDepthTracked.p75) { trackEvent('scroll_depth', { percentage: 75 }); scrollDepthTracked.p75 = true; }
        if (scrollPercent >= 95 && !scrollDepthTracked.p100) { trackEvent('scroll_depth', { percentage: 100 }); scrollDepthTracked.p100 = true; }
    }

    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                if (!el.classList.contains('active')) {
                    el.classList.add('active');
                    trackEvent('section_view', { section_id: el.closest('section')?.id || 'none' });
                }
            }
        });
    }

    revealOnScroll();
    trackEvent('page_view_custom', { brand: content.brand.name });
});
