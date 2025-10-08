// Main JavaScript for the site
document.addEventListener('DOMContentLoaded', function() {
    // ========== ABA LATERAL DE FERRAMENTAS ==========
    const toolsSidebar = document.getElementById('tools-sidebar');
    const openToolsBtn = document.getElementById('open-tools');
    const closeToolsBtn = document.getElementById('close-tools');
    
    // Abrir aba lateral
    if (openToolsBtn && toolsSidebar) {
        openToolsBtn.addEventListener('click', function() {
            toolsSidebar.classList.add('open');
        });
    }
    
    // Fechar aba lateral
    if (closeToolsBtn && toolsSidebar) {
        closeToolsBtn.addEventListener('click', function() {
            toolsSidebar.classList.remove('open');
        });
    }
    
    // Fechar ao clicar fora da aba
    document.addEventListener('click', function(e) {
        if (toolsSidebar && toolsSidebar.classList.contains('open') && 
            !toolsSidebar.contains(e.target) && 
            e.target !== openToolsBtn && 
            !openToolsBtn.contains(e.target)) {
            toolsSidebar.classList.remove('open');
        }
    });

    // ========== FORMULÁRIO DE CONTATO ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.nome || !data.email || !data.mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Simulate form submission
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }

    // ========== SCROLL SUAVE ==========
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== ANIMAÇÃO DE IMAGENS ==========
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // ========== GALERIA ==========
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Simple lightbox effect
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const enlargedImg = document.createElement('img');
            enlargedImg.src = this.src;
            enlargedImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
            `;
            
            lightbox.appendChild(enlargedImg);
            document.body.appendChild(lightbox);
            
            // Close lightbox on click
            lightbox.addEventListener('click', function() {
                document.body.removeChild(lightbox);
            });
            
            // Close on ESC key
            document.addEventListener('keydown', function closeOnEsc(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(lightbox);
                    document.removeEventListener('keydown', closeOnEsc);
                }
            });
        });
    });

    // ========== EFEITO DE SCROLL NO HEADER ==========
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.site-header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(31, 37, 39, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--background)';
            header.style.backdropFilter = 'none';
        }
    });

    console.log('Site carregado com sucesso!');
});
