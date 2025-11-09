// 1. Script para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Cerrar menú móvil al hacer click en un enlace
        const mobileMenu = document.getElementById('mobileMenu');
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// 2. Script para menú móvil
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// 3. Script para navegación activa basada en scroll
function updateActiveNavigation() {
    //const sections = ['s1', 's2', 's3', 's4'];
    const sections = ['seccion-1', 'seccion-2', 'seccion-3', 'seccion-4'];
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    let closestSection = '';
    let closestDistance = Infinity;

    for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - 120); // 120px offset para el header

            // Si la sección está visible en el viewport
            if (rect.top <= 120 && rect.bottom >= 120) {
                currentSection = sectionId;
                break;
            }

            // Encontrar la sección más cercana al top
            if (distance < closestDistance && rect.top <= 120) {
                closestDistance = distance;
                closestSection = sectionId;
            }
        }
    }

    // Usar la sección actual o la más cercana
    const activeSection = currentSection || closestSection;

    // Remover clase active de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Añadir clase active al enlace correspondiente
    if (activeSection) {
        const activeLinks = document.querySelectorAll(`a[href="#${activeSection}"]`);
        activeLinks.forEach(link => {
            if (link.classList.contains('nav-link')) {
                link.classList.add('active');
            }
        });
    }
}

// Ejecutar al cargar y al hacer scroll (con throttling)
let scrollTimeout;
function handleScroll() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNavigation, 10);
}

window.addEventListener('load', updateActiveNavigation);
window.addEventListener('scroll', handleScroll);

// 4. Script para Dark/Light Mode
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const html = document.documentElement;
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const moonIconMobile = document.getElementById('moonIconMobile');
const sunIconMobile = document.getElementById('sunIconMobile');

// Función para aplicar el tema
function applyTheme(isDark) {
    if (isDark) {
        html.classList.add('dark');
        html.classList.remove('light');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
        moonIconMobile.classList.remove('hidden');
        sunIconMobile.classList.add('hidden');
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.add('light');
        html.classList.remove('dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
        moonIconMobile.classList.add('hidden');
        sunIconMobile.classList.remove('hidden');
        localStorage.setItem('theme', 'light');
    }
}

// Leer preferencia del sistema o localStorage al cargar
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (storedTheme) {
    applyTheme(storedTheme === 'dark');
} else if (prefersDark) {
    applyTheme(true); // Usar la preferencia del sistema como default
} else {
    applyTheme(false); // Default a light
}

// Toggle del tema al hacer click (escritorio y móvil)
themeToggle.addEventListener('click', () => {
    const isDark = html.classList.contains('dark');
    applyTheme(!isDark);
});

themeToggleMobile.addEventListener('click', () => {
    const isDark = html.classList.contains('dark');
    applyTheme(!isDark);
});

// 5. Script para carruseles de imágenes
const carousels = {};

function initCarousel(carouselId) {
    carousels[carouselId] = {
        currentSlide: 0,
        totalSlides: document.querySelectorAll(`#${carouselId} .carousel-slide`).length
    };
}

function moveSlide(carouselId, direction) {
    if (!carousels[carouselId]) initCarousel(carouselId);

    const carousel = carousels[carouselId];
    carousel.currentSlide += direction;

    if (carousel.currentSlide >= carousel.totalSlides) {
        carousel.currentSlide = 0;
    } else if (carousel.currentSlide < 0) {
        carousel.currentSlide = carousel.totalSlides - 1;
    }

    updateCarouselView(carouselId);
}

function goToSlide(carouselId, slideIndex) {
    if (!carousels[carouselId]) initCarousel(carouselId);

    carousels[carouselId].currentSlide = slideIndex;
    updateCarouselView(carouselId);
}

function updateCarouselView(carouselId) {
    const carousel = document.getElementById(carouselId);
    const container = document.querySelector(`#${carouselId} .carousel-container`);
    const dots = document.querySelectorAll(`#${carouselId} .carousel-dot`);
    const viewNameElement = document.querySelector(`#${carouselId} .carousel-view-name span`);
    const currentSlide = carousels[carouselId].currentSlide;

    // Mover el contenedor
    container.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Actualizar indicadores
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });

    // Actualizar nombre de la vista
    if (viewNameElement && carousel.dataset.viewNames) {
        const viewNames = JSON.parse(carousel.dataset.viewNames);
        if (viewNames[currentSlide]) {
            viewNameElement.textContent = `Vista ${currentSlide + 1} ${viewNames[currentSlide]}`;
        }
    }
}

// Reemplazar enlaces de Notion con los correctos
function cambiarHrefNotion(elementId) {
    const notionPrefix = 'https://www.notion.so';
    const notionPage = '/GRUPO_12-Reto-BigData-2877ced341bb81db901ed4ea50dc9fd2';
    let element = document.getElementById(elementId);
    element.setAttribute('href', notionPrefix + notionPage);
}

// Inicializar carruseles al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cambiarHrefNotion('notionLink');
    cambiarHrefNotion('notionLinkMobile');
    initCarousel('carousel-e2-cs01');
    initCarousel('carousel-e2-cs02');
    initCarousel('carousel-e2-cs03');
    initCarousel('carousel-e2-cs04');
    initCarousel('carousel-e2-cs05');
    initCarousel('carousel-e3-cs01');
    initCarousel('carousel-e3-cs03');
    initCarousel('carousel-e3-cs04');
    initCarousel('carousel-e3-cs05');
    initCarousel('carousel-e4-cs01');
    initCarousel('carousel-e4-cs02');
    initCarousel('carousel-e4-cs03');
    initCarousel('carousel-e4-cs04');
});

// 6. Script para desplegables independientes
function toggleAccordion(sectionId) {
    const section = document.getElementById(sectionId);
    const content = section.querySelector('.accordion-content');
    const chevron = section.querySelector('.accordion-chevron');

    // Toggle expanded state
    const isExpanded = section.getAttribute('aria-expanded') === 'true';
    section.setAttribute('aria-expanded', !isExpanded);

    if (isExpanded) {
        // Collapse
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        chevron.style.transform = 'rotate(0deg)';
    } else {
        // Expand
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        chevron.style.transform = 'rotate(180deg)';
    }
}

// Inicializar todos los acordeones como colapsados al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const sections = ['seccion-1', 'seccion-2', 'seccion-3', 'seccion-4'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.setAttribute('aria-expanded', 'false');
        }
    });
});

// Evitar propagación de clics en enlaces de Notion
document.getElementById('notionLink').addEventListener('click', (event) => {
    event.stopPropagation();
});
document.getElementById('notionLinkMobile').addEventListener('click', (event) => {
    event.stopPropagation();
});

// Funcionalidad del modal de imagen
function openImageModal(imgElement) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    
    // Configurar imagen del modal
    modalImage.src = imgElement.src;
    modalImage.alt = imgElement.alt;
    modalTitle.textContent = imgElement.alt;
    
    // Mostrar modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

// Event listeners para el modal
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar modal
    document.getElementById('closeModal').addEventListener('click', closeImageModal);
    
    // Cerrar modal al hacer clic en el fondo
    document.getElementById('imageModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeImageModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
    
    // Añadir click listener a todas las imágenes de carrusel
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    carouselImages.forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this);
        });
    });
});