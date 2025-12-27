import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Compra, Venta } from '../../models/compras.interface';
import { CobrosPagosService } from '../../services/cobros-pagos.service';
import { Router, RouterModule } from '@angular/router';
import { ProveedorService } from '../../services/proveedor.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cobros-pagos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cobros-pagos.component.html',
  styleUrl: './cobros-pagos.component.css',
})
export class CobrosPagosComponent implements OnInit {
  compras: Compra[] = [];
  ventas: Venta[] = [];
  proveedores: any[] = [];
  clientes: any[] = [];
  totalPagosPendientes: number = 0;
  totalCobrosPendientes: number = 0;

  cargando: boolean = true;

  constructor(
    private cobrosPagosService: CobrosPagosService,
    private proveedorService: ProveedorService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCompras();
    this.cargarVentas();
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (err) => console.error('Error al cargar proveedores:', err),
    });

    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => console.error('Error al cargar clientes:', err),
    });
  }

  obtenerNombreProveedor(id: number | string): string {
    const proveedor = this.proveedores.find((prov) => prov.id === id);
    return proveedor ? proveedor.nombre : 'Desconocido';
  }

  obtenerNombreCliente(id: number | string): string {
    const cliente = this.clientes.find((cli) => cli.id === id);
    return cliente ? cliente.nombre : 'Desconocido';
  }
  obtenerDireccionVenta(id: number | string): string {
    const cliente = this.clientes.find((cli) => cli.id === id);
    return cliente ? cliente.direccion : 'Desconocido';
  }

  cargarCompras(): void {
    this.cargando = true;
    this.cobrosPagosService.getCompras().subscribe({
      next: (data) => {
        //Filtrar solo los pendientes
        this.compras = data.filter((c) => !c.pagado);
        this.cargando = false;

        // Calcular total de pago
        this.totalPagosPendientes = this.compras.reduce(
          (sum, compra) => sum + Number(compra.total || 0),
          0
        );
      },
      error: (err) => {
        console.error('Error al cargar compras:', err);
        this.cargando = false;
      },
    });
  }

  cargarVentas(): void {
    this.cargando = true;
    this.cobrosPagosService.getVentas().subscribe({
      next: (data) => {
        //Filtrar solo los pendientes
        this.ventas = data.filter((v) => !v.pagado);
        this.cargando = false;

        // Calcular total de pago
        this.totalCobrosPendientes = this.ventas.reduce(
          (sum, venta) => sum + Number(venta.total || 0),
          0
        );
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
        this.cargando = false;
      },
    });
  }

  realizarPago(id: number | string) {
    const compra = this.compras.find((c) => c.id === id);
    if (!compra) return;

    if (confirm(`¿Realizar el pago de $${compra.total}?`)) {
      const compraActualizada = { ...compra, pagado: true };

      this.cobrosPagosService.actualizarCompra(compraActualizada).subscribe({
        next: () => {
          alert('Pago registrado con exito');
          const nuevoPago = {
            id: Date.now().toString(),
            id_compra: compra.id,
            'documento-emitido': true,
            fecha_pago: new Date().toISOString().split('T')[0],
            proveedor_id: compra.proveedorId,
            total_pago: compra.total,
          };
          this.cobrosPagosService.registrarPago(nuevoPago);

          this.compras = this.compras.filter((c) => c.id !== id);
          this.totalPagosPendientes = this.compras.reduce(
            (sum, compra) => sum + Number(compra.total || 0),
            0
          );
        },
        error: (err) => console.error('Error al realizar pago:', err),
      });
    }
  }

  realizarCobro(id: number | string) {
    const venta = this.ventas.find((v) => v.id === id);
    if (!venta) return;

    if (confirm(`¿Deseas registrar el cobro de $${venta.total}?`)) {
      const ventaActualizada = { ...venta, pagado: true };

      this.cobrosPagosService.actualizarVenta(ventaActualizada).subscribe({
        next: () => {
          const nuevoCobro = {
            id: Date.now().toString(),
            id_venta: venta.id,
            'documento-emitido': true,
            fecha_cobro: new Date().toISOString().split('T')[0],
            cliente_id: venta.clienteId,
            total_cobro: venta.total,
          };
          this.cobrosPagosService.registrarCobro(nuevoCobro);

          alert('Cobro registrado con exito');
          this.ventas = this.ventas.filter((v) => v.id !== id);
          this.totalCobrosPendientes = this.ventas.reduce(
            (sum, venta) => sum + Number(venta.total || 0),
            0
          );
        },
        error: (err) => console.error('Error al registrar el cobro:', err),
      });
    }
  }
}
