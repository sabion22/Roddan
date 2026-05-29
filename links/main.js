document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Add staggered entrance animations to links
    const links = document.querySelectorAll('.link-btn');
    links.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.animation = `fadeUpFast 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards ${0.3 + (index * 0.1)}s`;
    });
});
