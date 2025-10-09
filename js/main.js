// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado com sucesso!');

    // ========== MENU DROPDOWN COM CLIQUE ==========
    const menuItems = document.querySelectorAll('.menu-item-has-children');
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        link.addEventListener('click', function(e) {
            if (['#ferramentas', '#sobre', '#contato'].includes(this.getAttribute('href'))) {
                e.preventDefault();
            }
            menuItems.forEach(otherItem => { if (otherItem !== item) otherItem.classList.remove('active'); });
            item.classList.toggle('active');
        });
    });

    document.addEventListener('click', function(e) {
        const isClickInsideMenu = e.target.closest('.main-navigation');
        if (!isClickInsideMenu) menuItems.forEach(item => item.classList.remove('active'));
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') menuItems.forEach(item => item.classList.remove('active'));
    });

    // ========== FORMULÁRIO DE CONTATO ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            if (!data.nome || !data.email || !data.mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
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
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                menuItems.forEach(item => item.classList.remove('active'));
            }
        });
    });

    // ========== ANIMAÇÃO DE IMAGENS (EXCETO CARROSSEL) ==========
    const images = document.querySelectorAll('img:not(.carousel-image)');
    images.forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
            return;
        }
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.35s ease';
        img.addEventListener('load', function() { this.style.opacity = '1'; });
    });

    // Garantir visibilidade das imagens do carrossel
    const carouselImages = document.querySelectorAll('.carousel-image');
    carouselImages.forEach(img => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.style.transition = 'none';
        img.style.display = 'block';
        // se ainda não carregou, garantir que quando carregar continue visível
        if (!img.complete) {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.style.visibility = 'visible';
            });
        }
    });

    // ========== GALERIA - LIGHTBOX ==========
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display:flex; justify-content:center; align-items:center; z-index:10000; cursor:pointer;';
            const enlargedImg = document.createElement('img');
            enlargedImg.src = this.src;
            enlargedImg.alt = this.alt;
            enlargedImg.style.cssText = 'max-width:90%; max-height:90%; object-fit:contain; border-radius:8px;';
            lightbox.appendChild(enlargedImg);
            document.body.appendChild(lightbox);
            lightbox.addEventListener('click', function() { document.body.removeChild(lightbox); });
            function closeOnEsc(e) { if (e.key === 'Escape') { if (document.body.contains(lightbox)) document.body.removeChild(lightbox); document.removeEventListener('keydown', closeOnEsc); } }
            document.addEventListener('keydown', closeOnEsc);
        });
    });

    // ========== EFEITO DE SCROLL NO HEADER ==========
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(31, 37, 39, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--background)';
                header.style.backdropFilter = 'none';
            }
        });
    }

    // ========== ADICIONAIS ==========
    window.addEventListener('load', function() { document.body.classList.add('loaded'); });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
            const form = e.target.closest('form');
            if (form && form.id !== 'contactForm') e.preventDefault();
        }
    });

    console.log('JavaScript inicializado com sucesso!');
    console.log('Menu items encontrados:', menuItems.length);
    console.log('Imagens encontradas (sem carousel):', images.length);
    console.log('Imagens do carousel encontradas:', carouselImages.length);

    // ========== CARROSSEL ==========
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.dot');

    let currentIndex = 0;
    let slideInterval;

    function updateCarousel(index) {
        if (!track) return;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        currentIndex = index;
    }

    nextBtn?.addEventListener('click', () => { let newIndex = (currentIndex + 1) % slides.length; updateCarousel(newIndex); resetInterval(); });
    prevBtn?.addEventListener('click', () => { let newIndex = (currentIndex - 1 + slides.length) % slides.length; updateCarousel(newIndex); resetInterval(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { updateCarousel(i); resetInterval(); }));

    function startInterval() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            let newIndex = (currentIndex + 1) % slides.length;
            updateCarousel(newIndex);
        }, 4000);
    }
    function resetInterval() { clearInterval(slideInterval); startInterval(); }

    if (track) {
        updateCarousel(0);
        startInterval();
    }

    // ========== MODAL DO CARROSSEL ATUALIZADO ==========
    (function initCarouselModal() {
        const modal = document.querySelector('.carousel-modal');
        if (!modal) return;
        
        const modalImage = modal.querySelector('.modal-image');
        const modalTitle = modal.querySelector('.modal-title');
        const modalDescription = modal.querySelector('.modal-description');
        const modalClose = modal.querySelector('.modal-close');
        const clickableCaptions = document.querySelectorAll('.carousel-caption.clickable');
    
        const projectDescriptions = {
            1: { 
                title: "Instalações Industriais", 
                description: "Projetos completos de instalações elétricas industriais, incluindo dimensionamento de equipamentos, distribuição de energia, sistemas de proteção e comando, atendendo às normas técnicas e especificações do cliente. Desenvolvimento de diagramas unifilares, especificação de componentes e elaboração de memorial descritivo.",
                image: "./images/imagem1.jpg"
            },
            2: { 
                title: "Sistemas Fotovoltaicos", 
                description: "Projetos de energia solar fotovoltaica para residências, comércios e indústrias. Desenvolvimento desde o estudo de viabilidade, dimensionamento dos componentes (módulos, inversores, estruturas), até o projeto executivo para aprovação na concessionária. Cálculo de irradiação solar, estimativa de produção de energia e análise de retorno do investimento.",
                image: "./images/imagem2.jpg"
            },
            3: { 
                title: "SPDA e Aterramento", 
                description: "Sistemas de Proteção contra Descargas Atmosféricas (SPDA) e aterramento elétrico para diversos tipos de edificações. Projetos que garantem a segurança das pessoas e equipamentos, em conformidade com a NBR 5419. Dimensionamento de captores, condutores de descida, malha de aterramento e equipotencialização.",
                image: "./images/imagem3.jpg"
            }
        };
    
        // Adiciona evento de clique nos títulos
        clickableCaptions.forEach(caption => {
            caption.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project');
                const project = projectDescriptions[projectId];
                
                if (project) {
                    modalImage.src = project.image;
                    modalImage.alt = project.title;
                    modalTitle.textContent = project.title;
                    modalDescription.textContent = project.description;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    
        function closeModal() { 
            modal.classList.remove('active'); 
            document.body.style.overflow = 'auto'; 
        }
        
        modalClose?.addEventListener('click', closeModal);
        modal?.addEventListener('click', function(e) { 
            if (e.target === modal) closeModal(); 
        });
        
        document.addEventListener('keydown', function(e) { 
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); 
        });
    })();

    // ========== REVEAL ==========
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    reveals.forEach(el => observer.observe(el));
});
