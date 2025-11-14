// Variables del carrusel
let currentIndex = 0;
const cardsVisible = 4; // Número de tarjetas visibles a la vez

// Función para mover el carrusel
function moverCarrusel(direction) {
    const carrusel = document.querySelector('.carrusel');
    const cards = document.querySelectorAll('.producto-card');
    const totalCards = cards.length;
    const cardWidth = cards[0].offsetWidth;
    const gap = 20; // Gap entre tarjetas
    const moveDistance = cardWidth + gap;
    
    // Calcular el máximo índice posible
    const maxIndex = totalCards - cardsVisible;
    
    // Actualizar el índice
    currentIndex += direction;
    
    // Limitar el índice
    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
    
    // Aplicar la transformación
    const translateX = -(currentIndex * moveDistance);
    carrusel.style.transform = `translateX(${translateX}px)`;
}

// Ajustar el carrusel cuando cambie el tamaño de la ventana
window.addEventListener('resize', () => {
    currentIndex = 0;
    const carrusel = document.querySelector('.carrusel');
    if (carrusel) {
        carrusel.style.transform = 'translateX(0)';
    }
});

// Hacer las tarjetas clickeables (funcionalidad futura)
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.producto-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            console.log('Producto seleccionado:', card.querySelector('h3').textContent);
            // Aquí se podría abrir un modal o redirigir a la página del producto
        });
    });
});