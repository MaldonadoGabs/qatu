var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from '../config/firebaseConfig.js';
const COLLECTION_NAME = 'productos';
// ✅ Agregar producto
export function agregarProducto(producto) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validar categoría
            const categoriasValidas = ['electronicos', 'hogar', 'ropa', 'belleza', 'deportes', 'libros', 'juguetes', 'alimentos'];
            if (categoriasValidas.indexOf(producto.categoria) === -1) {
                throw new Error(`Categoría inválida: ${producto.categoria}`);
            }
            const docRef = yield db.collection(COLLECTION_NAME).add(Object.assign(Object.assign({}, producto), { fechaCreacion: firebase.firestore.Timestamp.now() }));
            console.log('✅ Producto agregado a Firebase:', docRef.id);
            return docRef.id;
        }
        catch (error) {
            console.error('❌ Error al agregar producto:', error);
            throw error;
        }
    });
}
// ✅ Obtener todos los productos
export function obtenerProductos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snapshot = yield db.collection(COLLECTION_NAME).get();
            const productos = [];
            snapshot.forEach((doc) => {
                var _a;
                const data = doc.data();
                productos.push({
                    id: doc.id,
                    nombre: data.nombre,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    imagen: data.imagen,
                    vendedorEmail: data.vendedorEmail,
                    vendedorNombre: data.vendedorNombre,
                    fechaCreacion: (_a = data.fechaCreacion) === null || _a === void 0 ? void 0 : _a.toDate()
                });
            });
            console.log('✅ Productos obtenidos de Firebase:', productos.length);
            return productos;
        }
        catch (error) {
            console.error('❌ Error al obtener productos:', error);
            throw error;
        }
    });
}
// ✅ Obtener productos por vendedor
export function obtenerProductosPorVendedor(emailVendedor) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snapshot = yield db.collection(COLLECTION_NAME)
                .where('vendedorEmail', '==', emailVendedor)
                .get();
            const productos = [];
            snapshot.forEach((doc) => {
                var _a;
                const data = doc.data();
                productos.push({
                    id: doc.id,
                    nombre: data.nombre,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    imagen: data.imagen,
                    vendedorEmail: data.vendedorEmail,
                    vendedorNombre: data.vendedorNombre,
                    fechaCreacion: (_a = data.fechaCreacion) === null || _a === void 0 ? void 0 : _a.toDate()
                });
            });
            console.log(`✅ Productos del vendedor ${emailVendedor}:`, productos.length);
            return productos;
        }
        catch (error) {
            console.error('❌ Error al obtener productos del vendedor:', error);
            throw error;
        }
    });
}
// ✅ Obtener productos por categoría
export function obtenerProductosPorCategoria(categoria) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snapshot = yield db.collection(COLLECTION_NAME)
                .where('categoria', '==', categoria)
                .get();
            const productos = [];
            snapshot.forEach((doc) => {
                var _a;
                const data = doc.data();
                productos.push({
                    id: doc.id,
                    nombre: data.nombre,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    imagen: data.imagen,
                    vendedorEmail: data.vendedorEmail,
                    vendedorNombre: data.vendedorNombre,
                    fechaCreacion: (_a = data.fechaCreacion) === null || _a === void 0 ? void 0 : _a.toDate()
                });
            });
            return productos;
        }
        catch (error) {
            console.error('❌ Error al obtener productos por categoría:', error);
            throw error;
        }
    });
}
// ✅ Actualizar producto
export function actualizarProducto(id, datos) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db.collection(COLLECTION_NAME).doc(id).update(datos);
            console.log('✅ Producto actualizado en Firebase:', id);
        }
        catch (error) {
            console.error('❌ Error al actualizar producto:', error);
            throw error;
        }
    });
}
// ✅ Eliminar producto
export function eliminarProducto(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db.collection(COLLECTION_NAME).doc(id).delete();
            console.log('✅ Producto eliminado de Firebase:', id);
        }
        catch (error) {
            console.error('❌ Error al eliminar producto:', error);
            throw error;
        }
    });
}
// ✅ Buscar productos
export function buscarProductos(termino) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const productos = yield obtenerProductos();
            const terminoLower = termino.toLowerCase();
            return productos.filter(p => p.nombre.toLowerCase().includes(terminoLower) ||
                p.descripcion.toLowerCase().includes(terminoLower) ||
                p.categoria.toLowerCase().includes(terminoLower));
        }
        catch (error) {
            console.error('❌ Error al buscar productos:', error);
            throw error;
        }
    });
}
//# sourceMappingURL=productosService.js.map