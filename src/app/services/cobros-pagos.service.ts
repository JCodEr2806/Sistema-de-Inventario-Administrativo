import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compra, Venta } from '../models/compras.interface';

@Injectable({
  providedIn: 'root',
})
export class CobrosPagosService {
  private apiComprasURL = 'http://localhost:3000/compras';
  private apiVentasURL = 'http://localhost:3000/ventas';
  private apiRegistrosURL = 'http://localhost:3000/registros';

  constructor(private http: HttpClient) {}

  getCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiComprasURL);
  }

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiVentasURL);
  }

  getRegistros(): Observable<any[]> {
    return this.http.get<any[]>(this.apiRegistrosURL);
  }
  actualizarRegistros(registros: any): Observable<any> {
    return this.http.put(`${this.apiRegistrosURL}/1`, registros);
  }

  actualizarCompra(compra: Compra): Observable<Compra> {
    return this.http.put<Compra>(`${this.apiComprasURL}/${compra.id}`, compra);
  }

  actualizarVenta(venta: Venta): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiVentasURL}/${venta.id}`, venta);
  }

  registrarPago(pago: any): void {
    this.getRegistros().subscribe({
      next: (data) => {
        const registros = data[0];
        registros.pagos.push(pago);
        this.actualizarRegistros(registros).subscribe();
      },
    });
  }

  registrarCobro(cobro: any): void {
    this.getRegistros().subscribe({
      next: (data) => {
        const registros = data[0];
        registros.cobros.push(cobro);
        this.actualizarRegistros(registros).subscribe();
      },
    });
  }
}
