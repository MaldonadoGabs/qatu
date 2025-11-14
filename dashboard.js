// Carrusel de productos
let posicionActual = 0;
let carrusel;
let totalProductos;
const productosPorPagina = 4;
let maxPosicion;
// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    carrusel = document.querySelector('.carrusel');
    totalProductos = document.querySelectorAll('.producto-card').length;
    maxPosicion = totalProductos - productosPorPagina;
    // Configurar botones del carrusel
    const btnPrev = document.querySelector('.carrusel-btn.prev');
    const btnNext = document.querySelector('.carrusel-btn.next');
    if (btnPrev) {
        btnPrev.addEventListener('click', () => moverCarrusel(-1));
    }
    if (btnNext) {
        btnNext.addEventListener('click', () => moverCarrusel(1));
    }
    // Configurar botón de login
    const btnLogin = document.querySelector('.btn-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});
function moverCarrusel(direccion) {
    posicionActual += direccion;
    if (posicionActual < 0) {
        posicionActual = 0;
    }
    else if (posicionActual > maxPosicion) {
        posicionActual = maxPosicion;
    }
    const tarjeta = document.querySelector('.producto-card');
    if (tarjeta && carrusel) {
        const anchoTarjeta = tarjeta.offsetWidth;
        const gap = 20;
        const desplazamiento = -(posicionActual * (anchoTarjeta + gap));
        carrusel.style.transform = `translateX(${desplazamiento}px)`;
    }
}
// Hacer la función disponible globalmente para compatibilidad
window.moverCarrusel = moverCarrusel;
