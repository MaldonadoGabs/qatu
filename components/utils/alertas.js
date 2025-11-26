// Archivo único y compartido para TODAS las alertas personalizadas

export function mostrarAlerta(titulo, mensaje, tipo = 'info') {
    // Remover alerta anterior si existe
    let modalExistente = document.getElementById('modal-alerta-custom');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'modal-alerta-custom';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const colores = {
        exito: '#4CAF50',
        error: '#f44336',
        info: '#E43636'
    };
    
    const iconos = {
        exito: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    const contenido = document.createElement('div');
    contenido.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
    `;
    
    const colorTipo = colores[tipo] || colores.info;
    const iconoTipo = iconos[tipo] || iconos.info;
    
    contenido.innerHTML = `
        <div style="
            font-size: 3rem;
            margin-bottom: 15px;
            color: ${colorTipo};
        ">
            ${iconoTipo}
        </div>
        <h2 style="
            color: #333;
            margin: 0 0 10px 0;
            font-size: 1.5rem;
            font-family: 'Stack Sans Notch', sans-serif;
        ">
            ${titulo}
        </h2>
        <p style="
            color: #666;
            margin: 0 0 20px 0;
            font-size: 1rem;
            font-family: 'Stack Sans Text', sans-serif;
            line-height: 1.5;
        ">
            ${mensaje}
        </p>
        <button id="btn-alerta-cerrar"
                style="
                    background: ${colorTipo};
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-family: 'Stack Sans Notch', sans-serif;
                    transition: all 0.3s;
                    font-weight: 600;
                "
        >
            Aceptar
        </button>
    `;
    
    modal.appendChild(contenido);
    document.body.appendChild(modal);
    
    // Evento del botón
    document.getElementById('btn-alerta-cerrar').addEventListener('click', () => {
        modal.remove();
    });
    
    // Cerrar con ESC
    const cerrarConEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', cerrarConEsc);
        }
    };
    document.addEventListener('keydown', cerrarConEsc);
}

// Función auxiliar para confirmación
export function mostrarConfirmacion(titulo, mensaje, onAceptar, onCancelar = null) {
    let modalExistente = document.getElementById('modal-confirmacion-custom');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'modal-confirmacion-custom';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const contenido = document.createElement('div');
    contenido.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
    `;
    
    contenido.innerHTML = `
        <h2 style="
            color: #333;
            margin: 0 0 15px 0;
            font-size: 1.5rem;
            font-family: 'Stack Sans Notch', sans-serif;
        ">
            ${titulo}
        </h2>
        <p style="
            color: #666;
            margin: 0 0 25px 0;
            font-size: 1rem;
            font-family: 'Stack Sans Text', sans-serif;
            line-height: 1.5;
        ">
            ${mensaje}
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="btn-confirmar-cancelar"
                    style="
                        background: #ccc;
                        color: #333;
                        border: none;
                        padding: 10px 25px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1rem;
                        font-family: 'Stack Sans Notch', sans-serif;
                        transition: all 0.3s;
                        flex: 1;
                    "
            >
                Cancelar
            </button>
            <button id="btn-confirmar-aceptar"
                    style="
                        background: #E43636;
                        color: white;
                        border: none;
                        padding: 10px 25px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1rem;
                        font-family: 'Stack Sans Notch', sans-serif;
                        transition: all 0.3s;
                        flex: 1;
                        font-weight: 600;
                    "
            >
                Aceptar
            </button>
        </div>
    `;
    
    modal.appendChild(contenido);
    document.body.appendChild(modal);
    
    document.getElementById('btn-confirmar-aceptar').addEventListener('click', () => {
        onAceptar();
        modal.remove();
    });
    
    document.getElementById('btn-confirmar-cancelar').addEventListener('click', () => {
        if (onCancelar) onCancelar();
        modal.remove();
    });
}