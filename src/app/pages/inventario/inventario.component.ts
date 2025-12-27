import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/productos.interface';
import { ProductoService } from '../../services/producto.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent implements OnInit {
  //Lista de los productos
  productos: Producto[] = [];

  // Lista de productos originales (sin filtrar)
  productosOriginales: Producto[] = [];

  //Mensaje de exito o error
  mensaje: string | null = null;

  cargando: boolean = true;

  // Filtro de búsqueda
  filtro: string = '';
  categorias: string[] = [];
  categoriaSeleccionada: string = '';

  proveedores: any[] = [];

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (err) => console.error('Error al cargar proveedores:', err),
    });
  }

  obtenerNombreProveedor(id: number | string): string {
    const proveedor = this.proveedores.find((prov) => prov.id === id);
    return proveedor ? proveedor.nombre : 'Desconocido';
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosOriginales = [...data];
        this.categorias = [...new Set(data.map((prod) => prod.categoria))];
        this.cargando = false;
        this.mensaje = null;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.cargando = false;
        this.mensaje = 'Error al conectar con la base de datos.';
      },
    });
  }

  filtrarProductos(): void {
    const texto = this.filtro.toLowerCase().trim();
    const categoria = this.categoriaSeleccionada;

    this.productos = this.productosOriginales.filter((prod) => {
      const coincideTexto =
        prod.nombre.toLowerCase().includes(texto) ||
        prod.categoria.toLowerCase().includes(texto) ||
        prod.id.toString().includes(texto);

      const coincideCategoria =
        categoria === '' || prod.categoria === categoria;

      return coincideTexto && coincideCategoria;
    });
  }

  editarProducto(producto: Producto): void {
    // Llevar a la pagina de edicion
    // console.log('Editar producto: ', producto.id);
  }

  eliminarProducto(id: number | string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      console.log('Eliminando producto con ID:', id);
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          alert('Producto eliminado exitosamente');
          this.productos = this.productos.filter((p) => p.id !== id);
          this.productosOriginales = this.productosOriginales.filter(
            (p) => p.id !== id
          );
        },
        error: (err) => {
          console.log('Error al eliminar producto:', err);
          alert('Error al eliminar el producto. Intentalo de nuevo.');
          console.log(this.productosOriginales);
        },
      });
    }
  }
}
