export interface Producto {
  id: string | number;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  proveedorId: string | number;
}
