export interface Compra {
    id: string | number;
    fecha: string;
    proveedorId: string | number;
    pagado: boolean,
    total: number;
    detalles: {
        productoId: string | number;
        nombre: string;
        cantidad: number;
        precioUnitario: number;
        subTotal: number;
    }[];
}

export interface Venta {
    id: string | number;
    fecha: string;
    clienteId: string | number;
    pagado: boolean;
    total: number;
    detalles: {
        productoId: string | number;
        nombre: string;
        cantidad: number;
        precioUnitario: number;
        subTotal: number;
    }[];
    metodoPago: string;
}