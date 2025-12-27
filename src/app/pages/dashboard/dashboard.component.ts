import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CobrosPagosService } from '../../services/cobros-pagos.service';
import { ClienteService } from '../../services/cliente.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Compra, Venta } from '../../models/compras.interface';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/productos.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  compras: Compra[] = [];
  ventas: Venta[] = [];
  proveedores: any[] = [];
  clientes: any[] = [];

  totalPagosPendientes: number = 0;
  totalCobrosPendientes: number = 0;


  productos: Producto[] = [];
  productosBajoStock: Producto[] = [];

  cargando: boolean = true;

  resumen = {
    productos: 12,
    proveedores: 3,
    clientes: 8,
    comprasTotal: 12500,
    ventasTotal: 17800,
    ganancia: 5300,
  };

  billetera = {
    comprasTotal: 100,
    ventasTotal: 0,
    ganancia: 0,
  }

  ultimasVentas = [
    { id: 'V001', fecha: '2025-11-06', cliente: 'Juan Pérez', total: 350 },
    { id: 'V002', fecha: '2025-11-07', cliente: 'Ana López', total: 420 },
    { id: 'V003', fecha: '2025-11-07', cliente: 'Carlos Díaz', total: 280 },
  ];

  alertasStock = [
    { nombre: 'Leche', cantidad: 8 },
    { nombre: 'Milo', cantidad: 12 },
    { nombre: 'Frijoles', cantidad: 5 },
  ];

  constructor(
    private cobrosPagosService: CobrosPagosService,
    private proveedorService: ProveedorService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCompras();
    this.obtenerComprasTotales();
    this.cargarVentas();
    this.obtenerVentasTotales();
    this.cargarProductos();
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

    this.billetera.ganancia = this.billetera.ventasTotal - this.billetera.comprasTotal
  }

  obtenerComprasTotales(): void {
    if(this.compras && this.compras.length>0){
      const gastos = this.compras.reduce((acum, compra) => acum + compra.total, 0)
      this.billetera.comprasTotal = gastos;
    } else {
      this.billetera.comprasTotal = 100;
    }
  }
  obtenerVentasTotales(): void {
    if(this.ventas && this.ventas.length>0){
      const ganancias = this.ventas.reduce((acum, venta) => acum + venta.total, 0)
      this.billetera.ventasTotal = ganancias;
    } else {
      this.billetera.ventasTotal = 100;
    }
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos =data
        this.productosBajoStock = data.filter(p => p.cantidad < 10)
      },
      error: (err) =>  {
        console.error('Error al cargar productos:', err);
      }
    })
  }


  //Ventas
  obtenerNombreCliente(id: number | string): string {
    const cliente = this.clientes.find((cli) => cli.id === id);
    return cliente ? cliente.nombre : 'Desconocido';
  }
  cargarVentas(): void {
    this.cargando = true;
    this.cobrosPagosService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
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
  cargarCompras(): void {
    this.cargando = true;
    this.cobrosPagosService.getCompras().subscribe({
      next: (data) => {
        //Filtrar solo los pendientes
        this.compras = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar compras:', err);
        this.cargando = false;
      },
    });
  }

  cargarProveedores(): void {
    this.cargando = true;
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
      },
    });
  }
}
