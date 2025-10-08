// Main JavaScript for the site
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado com sucesso!');

    // ========== MENU DROPDOWN COM CLIQUE ==========
    const menuItems = document.querySelectorAll('.menu-item-has-children');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        
        link.addEventListener('click', function(e) {
            // Prevenir comportamento padrão APENAS para links que não são externos
            if (this.getAttribute('href') === '#ferramentas' || 
                this.getAttribute('href') === '#sobre' || 
                this.getAttribute('href') === '#contato') {
                e.preventDefault();
            }
            
            // Fechar outros menus abertos
            menuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Abrir/fechar o menu atual
            item.classList.toggle('active');
        });
    });

    // Fechar dropdown ao clicar fora do menu
    document.addEventListener('click', function(e) {
        const isClickInsideMenu = e.target.closest('.main-navigation');
        if (!isClickInsideMenu) {
            menuItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Fechar dropdown ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            menuItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // ========== FORMULÁRIO DE CONTATO ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Pegar dados do formulário
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validação simples
            if (!data.nome || !data.email || !data.mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Simular envio do formulário
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
                
                // Fechar menus abertos após o scroll
                menuItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    });

    // ========== ANIMAÇÃO DE IMAGENS ==========
    const images = document.querySelectorAll('img:not(.carousel-image)');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Configurar opacidade inicial para efeito fade-in
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        } else {
            img.style.opacity = '1';
        }
    });

    // ========== GALERIA - LIGHTBOX ==========
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Criar lightbox
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
            enlargedImg.alt = this.alt;
            enlargedImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
            `;
            
            lightbox.appendChild(enlargedImg);
            document.body.appendChild(lightbox);
            
            // Fechar lightbox ao clicar
            lightbox.addEventListener('click', function() {
                document.body.removeChild(lightbox);
            });
            
            // Fechar com tecla ESC
            function closeOnEsc(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(lightbox);
                    document.removeEventListener('keydown', closeOnEsc);
                }
            }
            
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

    // ========== MELHORIAS ADICIONAIS ==========
    
    // Adicionar classe loaded ao body quando tudo carregar
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Prevenir que formulários sejam enviados com Enter acidentalmente
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
            const form = e.target.closest('form');
            if (form && form.id !== 'contactForm') {
                e.preventDefault();
            }
        }
    });

    // Log para debug
    console.log('JavaScript inicializado com sucesso!');
    console.log('Menu items encontrados:', menuItems.length);
    console.log('Imagens encontradas:', images.length);
    console.log('Imagens da galeria:', galleryImages.length);
});

// ========== CARROSSEL ==========
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;
let slideInterval;

function updateCarousel(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentIndex = index;
}

// Navegação manual
nextBtn?.addEventListener('click', () => {
    let newIndex = (currentIndex + 1) % slides.length;
    updateCarousel(newIndex);
    resetInterval();
});

prevBtn?.addEventListener('click', () => {
    let newIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel(newIndex);
    resetInterval();
});

// Indicadores
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        updateCarousel(i);
        resetInterval();
    });
});

// Auto play
function startInterval() {
    slideInterval = setInterval(() => {
        let newIndex = (currentIndex + 1) % slides.length;
        updateCarousel(newIndex);
    }, 4000); // troca a cada 4s
}

function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
}

// Inicializa
if (track) {
    updateCarousel(0);
    startInterval();
}
// ========== MODAL DO CARROSSEL ==========
function initCarouselModal() {
    const modal = document.querySelector('.carousel-modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalClose = modal.querySelector('.modal-close');
    const moreButtons = document.querySelectorAll('.carousel-btn-more');

    // Descrições dos projetos
    const projectDescriptions = {
        1: {
            title: "Instalações Industriais",
            description: "Projetos completos de instalações elétricas industriais, incluindo dimensionamento de circuitos, proteções, quadros de distribuição e sistemas de automação. Desenvolvemos soluções seguras e eficientes para ambientes industriais complexos."
        },
        2: {
            title: "Sistemas Fotovoltaicos",
            description: "Projetos de energia solar fotovoltaica para residências, comércios e indústrias. Inclui dimensionamento de painéis, inversores, estruturas de fixação e cálculo de payback. Sustentabilidade e economia de energia."
        },
        3: {
            title: "SPDA e Aterramento",
            description: "Sistemas de Proteção contra Descargas Atmosféricas (SPDA) e aterramento elétrico. Projetamos e implementamos sistemas que garantem a segurança de pessoas e equipamentos, seguindo as normas técnicas vigentes."
        }
    };

    // Abrir modal
    moreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectDescriptions[projectId];
            
            if (project) {
                modalTitle.textContent = project.title;
                modalDescription.textContent = project.description;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Previne scroll
            }
        });
    });

    // Fechar modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    modalClose.addEventListener('click', closeModal);
    
    // Fechar modal clicando fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Inicializar o modal quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // ... seu código existente ...
    
    // Inicializar modal do carrossel
    initCarouselModal();
    
    // ... resto do seu código ...
});
// ========== EFEITO DE REVEAL NAS SEÇÕES ==========
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // só anima uma vez
        }
    });
}, { threshold: 0.2 }); // dispara quando 20% da seção aparece

reveals.forEach(el => {
    observer.observe(el);
});
// Funções auxiliares (caso precise adicionar mais depois)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Exemplo de função para adicionar mais tarde:
function abrirFerramenta(url) {
    window.open(url, '_blank');
}
