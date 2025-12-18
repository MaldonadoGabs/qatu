import { db } from '../config/firebaseConfig.js';

// Firebase Firestore se carga desde CDN
declare const firebase: any;

const COLLECTION_NAME = 'productos';

export type Categoria = 'electronicos' | 'hogar' | 'ropa' | 'belleza' | 'deportes' | 'libros' | 'juguetes' | 'alimentos';

export interface Producto {
    id?: string;
    nombre: string;
    precio: number;
    categoria: Categoria;
    descripcion: string;
    imagen: string;
    vendedorEmail: string;
    vendedorNombre: string;
    fechaCreacion?: Date;
}

// ✅ Agregar producto
export async function agregarProducto(producto: Omit<Producto, 'id'>): Promise<string> {
    try {
        // Validar categoría
        const categoriasValidas: Categoria[] = ['electronicos', 'hogar', 'ropa', 'belleza', 'deportes', 'libros', 'juguetes', 'alimentos'];
        if (categoriasValidas.indexOf(producto.categoria) === -1) {
            throw new Error(`Categoría inválida: ${producto.categoria}`);
        }

        const docRef = await db.collection(COLLECTION_NAME).add({
            ...producto,
            fechaCreacion: firebase.firestore.Timestamp.now()
        });
        
        console.log('✅ Producto agregado a Firebase:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error al agregar producto:', error);
        throw error;
    }
}

// ✅ Obtener todos los productos
export async function obtenerProductos(): Promise<Producto[]> {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).get();
        const productos: Producto[] = [];
        
        snapshot.forEach((doc: any) => {
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
                fechaCreacion: data.fechaCreacion?.toDate()
            });
        });
        
        console.log('✅ Productos obtenidos de Firebase:', productos.length);
        return productos;
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        throw error;
    }
}

// ✅ Obtener productos por vendedor
export async function obtenerProductosPorVendedor(emailVendedor: string): Promise<Producto[]> {
    try {
        const snapshot = await db.collection(COLLECTION_NAME)
            .where('vendedorEmail', '==', emailVendedor)
            .get();
            
        const productos: Producto[] = [];
        
        snapshot.forEach((doc: any) => {
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
                fechaCreacion: data.fechaCreacion?.toDate()
            });
        });
        
        console.log(`✅ Productos del vendedor ${emailVendedor}:`, productos.length);
        return productos;
    } catch (error) {
        console.error('❌ Error al obtener productos del vendedor:', error);
        throw error;
    }
}

// ✅ Obtener productos por categoría
export async function obtenerProductosPorCategoria(categoria: Categoria): Promise<Producto[]> {
    try {
        const snapshot = await db.collection(COLLECTION_NAME)
            .where('categoria', '==', categoria)
            .get();
            
        const productos: Producto[] = [];
        
        snapshot.forEach((doc: any) => {
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
                fechaCreacion: data.fechaCreacion?.toDate()
            });
        });
        
        return productos;
    } catch (error) {
        console.error('❌ Error al obtener productos por categoría:', error);
        throw error;
    }
}

// ✅ Actualizar producto
export async function actualizarProducto(id: string, datos: Partial<Producto>): Promise<void> {
    try {
        await db.collection(COLLECTION_NAME).doc(id).update(datos);
        console.log('✅ Producto actualizado en Firebase:', id);
    } catch (error) {
        console.error('❌ Error al actualizar producto:', error);
        throw error;
    }
}

// ✅ Eliminar producto
export async function eliminarProducto(id: string): Promise<void> {
    try {
        await db.collection(COLLECTION_NAME).doc(id).delete();
        console.log('✅ Producto eliminado de Firebase:', id);
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        throw error;
    }
}

// ✅ Buscar productos
export async function buscarProductos(termino: string): Promise<Producto[]> {
    try {
        const productos = await obtenerProductos();
        const terminoLower = termino.toLowerCase();
        
        return productos.filter(p => 
            p.nombre.toLowerCase().includes(terminoLower) ||
            p.descripcion.toLowerCase().includes(terminoLower) ||
            p.categoria.toLowerCase().includes(terminoLower)
        );
    } catch (error) {
        console.error('❌ Error al buscar productos:', error);
        throw error;
    }
}