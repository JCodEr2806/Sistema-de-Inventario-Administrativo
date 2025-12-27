import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CobrosPagosService } from '../../../services/cobros-pagos.service';
import { ClienteService } from '../../../services/cliente.service';
import { ProveedorService } from '../../../services/proveedor.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent implements OnInit {
  pagos: any[] = [];
  cobros: any[] = [];

  proveedores: any[] = [];
  clientes: any[] = [];

  cargando: boolean = true;

  tipoHistorial: 'pagos' | 'cobros' = 'pagos';

  constructor(
    private cobrosPagosService: CobrosPagosService,
    private proveedorService: ProveedorService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Detectar el tipo de historial segun la URL
    this.route.url.subscribe((segments) => {
      const path = segments.map((s) => s.path).join('/');
      this.tipoHistorial = path.includes('cobros') ? 'cobros' : 'pagos';
      this.cargarHistorial();
    });

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

  obtenerResultadoDocEmitPag(id: number | string): string {
    const pago = this.pagos.find((p) => p.id === id);

    if (pago) {
      return pago['documento-emitido']
        ? 'Factura Emitida'
        : 'Factura no Emitida';
    }

    return 'Sin información';
  }
  obtenerResultadoDocEmitCob(id: number | string): string {
    const cobro = this.cobros.find((p) => p.id === id);

    if (cobro) {
      return cobro['documento-emitido']
        ? 'Factura Emitida'
        : 'Factura no Emitida';
    }

    return 'Sin información';
  }

  obtenerNombreCliente(id: number | string): string {
    const cliente = this.clientes.find((cli) => cli.id === id);
    return cliente ? cliente.nombre : 'Desconocido';
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.cobrosPagosService.getRegistros().subscribe({
      next: (data) => {
        if (data.length > 0) {
          const registro = data[0];
          this.pagos = registro.pagos || [];
          this.cobros = registro.cobros || [];
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
        this.cargando = false;
      },
    });
  }

  //Ya no se usa estos
  cargarPagos(): void {
    this.cargando = true;
    this.cobrosPagosService.getRegistros().subscribe({
      next: (data) => {
        if (data.length > 0) {
          const registro = data[0];
          this.pagos = registro.pagos || [];
          this.cobros = registro.cobros || [];
        } else {
          this.pagos = [];
          this.cobros = [];
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pagos:', err);
        this.cargando = false;
      },
    });
  }

  cargarCobros(): void {
    this.cargando = true;
    this.cobrosPagosService.getRegistros().subscribe({
      next: (data) => {
        this.pagos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pagos:', err);
        this.cargando = false;
      },
    });
  }

  cargarCLientes(): void {
    this.cargando = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => {
        console.error('Error al cargar cliente:', err);
      },
    });
  }
}
