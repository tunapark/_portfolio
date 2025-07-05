import { animate } from "https://esm.run/framer-motion";

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setupSmoothScrolling();
    setupScrollAnimations();
});

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupScrollAnimations() {
    const sections = document.querySelectorAll('.animated-section');
    
    sections.forEach(section => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(
                        entry.target,
                        { opacity: [0, 1], y: [30, 0] },
                        { duration: 0.8, ease: "easeOut" }
                    );
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(section);
    });
}
