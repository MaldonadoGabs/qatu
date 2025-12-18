import type { Categoria } from '../services/productosService.js';
export interface ProductoPredeterminado {
    nombre: string;
    precio: number;
    categoria: Categoria;
    descripcion: string;
    imagen: string;
    vendedor: string;
}
export declare const productosPredeterminados: ProductoPredeterminado[];
//# sourceMappingURL=productosPredeterminados.d.ts.map