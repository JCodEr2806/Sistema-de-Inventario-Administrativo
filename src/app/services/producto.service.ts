import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/productos.interface';
import { Compra } from '../models/compras.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiURL = 'http://localhost:3000/productos';
  private apiURLCompras = 'http://localhost:3000/compras';

  constructor(private http: HttpClient) {}

  // Obtener la lista de productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiURL);
  }

  // Agregar un nuevo producto
  agregarProducto(producto: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.post<Producto>(this.apiURL, producto);
  }

  // Actualizar un producto existente
  actualizarProducto(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiURL}/${producto.id}`, producto);
  }

  // Eliminar un producto por su ID
  eliminarProducto(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }

  // Implementar el producto en las compras
  añadirProductoACompras(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.apiURLCompras, compra);
  }
}
