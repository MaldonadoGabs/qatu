var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { agregarProducto, obtenerProductos } from '../services/productosService.js';
import { productosPredeterminados } from '../data/productosPredeterminados.js';
// 🔄 Verificar y cargar productos solo si la BD está vacía
export function verificarYCargarProductosIniciales() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🔍 Verificando productos en Firebase...');
            const productosExistentes = yield obtenerProductos();
            if (productosExistentes.length > 0) {
                console.log(`✅ Ya existen ${productosExistentes.length} productos en Firebase`);
                return;
            }
            console.log('📦 Base de datos vacía. Cargando productos iniciales...');
            yield cargarProductosIniciales();
        }
        catch (error) {
            console.error('❌ Error al verificar productos:', error);
        }
    });
}
// ✅ Cargar productos iniciales a Firebase
export function cargarProductosIniciales() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('📦 Cargando productos iniciales a Firebase...');
            let contador = 0;
            for (const producto of productosPredeterminados) {
                yield agregarProducto({
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
        }
        catch (error) {
            console.error('❌ Error al cargar productos iniciales:', error);
            throw error;
        }
    });
}
// 🔄 Resetear productos (útil para desarrollo)
export function resetearProductos() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔄 Esta función eliminará todos los productos y cargará los iniciales');
        console.log('⚠️ Por seguridad, debes implementar la eliminación manual desde Firebase Console');
    });
}
//# sourceMappingURL=cargarProductosIniciales.js.map