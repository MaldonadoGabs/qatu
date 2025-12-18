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
export declare function agregarProducto(producto: Omit<Producto, 'id'>): Promise<string>;
export declare function obtenerProductos(): Promise<Producto[]>;
export declare function obtenerProductosPorVendedor(emailVendedor: string): Promise<Producto[]>;
export declare function obtenerProductosPorCategoria(categoria: Categoria): Promise<Producto[]>;
export declare function actualizarProducto(id: string, datos: Partial<Producto>): Promise<void>;
export declare function eliminarProducto(id: string): Promise<void>;
export declare function buscarProductos(termino: string): Promise<Producto[]>;
//# sourceMappingURL=productosService.d.ts.map