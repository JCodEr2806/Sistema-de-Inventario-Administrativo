import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from '../models/proveedor.interface';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private apiURL = 'http://localhost:3000/proveedores';

  constructor(private http: HttpClient) {}

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiURL);
  }

  agregarProveedor(proveedor: Omit<Proveedor, 'id'>): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiURL, proveedor);
  }

  actualizarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(
      `${this.apiURL}/${proveedor.id}`,
      proveedor
    );
  }

  eliminarProveedor(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }
}
