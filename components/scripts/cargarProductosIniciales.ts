import { agregarProducto, obtenerProductos } from '../services/productosService.js';
import { productosPredeterminados } from '../data/productosPredeterminados.js';

// 🔄 Verificar y cargar productos solo si la BD está vacía
export async function verificarYCargarProductosIniciales(): Promise<void> {
    try {
        console.log('🔍 Verificando productos en Firebase...');
        
        const productosExistentes = await obtenerProductos();
        
        if (productosExistentes.length > 0) {
            console.log(`✅ Ya existen ${productosExistentes.length} productos en Firebase`);
            return;
        }
        
        console.log('📦 Base de datos vacía. Cargando productos iniciales...');
        await cargarProductosIniciales();
        
    } catch (error) {
        console.error('❌ Error al verificar productos:', error);
    }
}

// ✅ Cargar productos iniciales a Firebase
export async function cargarProductosIniciales(): Promise<void> {
    try {
        console.log('📦 Cargando productos iniciales a Firebase...');
        
        let contador = 0;
        for (const producto of productosPredeterminados) {
            await agregarProducto({
                nombre: producto.nombre,
                precio: producto.precio,
                categoria: producto.categoria,
                descripcion: producto.descripcion,
                imagen: producto.imagen,
                vendedorEmail: `${producto.vendedor.toLowerCase().replace(/\s+/g, '.')}@qatu.com`,
                vendedorNombre: producto.vendedor
            });
            contador++;
            console.log(`   ${contador}/${productosPredeterminados.length} - ${producto.nombre}`);
        }
        
        console.log(`✅ ${contador} productos cargados exitosamente a Firebase`);
        
    } catch (error) {
        console.error('❌ Error al cargar productos iniciales:', error);
        throw error;
    }
}

// 🔄 Resetear productos (útil para desarrollo)
export async function resetearProductos(): Promise<void> {
    console.log('🔄 Esta función eliminará todos los productos y cargará los iniciales');
    console.log('⚠️ Por seguridad, debes implementar la eliminación manual desde Firebase Console');
}