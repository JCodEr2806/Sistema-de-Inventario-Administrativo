import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css',
})
export class AgregarProductoComponent implements OnInit {
  nuevoProducto = {
    id: '' as string | number,
    nombre: '',
    categoria: '',
    descripcion: '',
    cantidad: 0,
    precio: 0,
    proveedorId: '' as string | number,
  };

  proveedores: any[] = [];

  modoEdicion: boolean = false;

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (err) => console.error('Error al cargar proveedores:', err),
    });

    if (id) {
      this.modoEdicion = true;
      this.cargarProducto(id);
    }
  }

  cargarProducto(id: string): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        const producto = productos.find((p) => p.id === id);
        console.log(producto);
        if (producto) {
          this.nuevoProducto = { ...producto };
        } else {
          alert('Producto no encontrado');
          this.router.navigate(['/inventario']);
        }
      },
      error: (err) => {
        console.error('Error al cargar el producto:', err);
        alert('Error al cargar el producto. Inténtalo de nuevo.');
        this.router.navigate(['/inventario']);
      },
    });
  }

  guardarProducto(): void {
    if (this.modoEdicion) {
      this.actualizarProducto();
    } else {
      this.agregarProducto();
    }
  }

  agregarProducto(): void {
    this.productoService.getProductos().subscribe({
      next: (prod) => {
        const ultimoId =
          prod.length > 0
            ? Math.max(...prod.map((p: any) => Number(p.id)))
            : 100;

        let idNuevo = ultimoId + 1;

        this.nuevoProducto.id = idNuevo.toString();

        this.productoService.agregarProducto(this.nuevoProducto).subscribe({
          next: (productoAgregado) => {
            // Registrar la compra asociada al nuevo producto
            const nuevaCompra = {
              id: Date.now(),
              fecha: new Date().toISOString().split('T')[0],
              proveedorId: this.nuevoProducto.proveedorId,
              pagado: false,
              total: this.nuevoProducto.precio * this.nuevoProducto.cantidad,
              detalles: [
                {
                  productoId: this.nuevoProducto.id,
                  nombre: this.nuevoProducto.nombre,
                  cantidad: this.nuevoProducto.cantidad,
                  precioUnitario: this.nuevoProducto.precio,
                  subTotal:
                    this.nuevoProducto.precio * this.nuevoProducto.cantidad,
                },
              ],
            };

            // Guardar la compra
            this.productoService.añadirProductoACompras(nuevaCompra).subscribe({
              next: () => {
                alert('Producto agregado exitosamente');
                this.router.navigate(['/inventario']);
              },
              error: (err) => {
                console.error('Error al registrar la compra:', err);
                alert(
                  'Producto agregado, pero hubo un error al registrar la compra.'
                );
                this.router.navigate(['/inventario']);
              }
            })
          },
          error: (err) => {
            console.log('Error al agregar producto:', err);
            alert('Error al agregar el producto. Inténtalo de nuevo.');
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener producto', err);
        alert('Error al obtener producto');
      },
    });
  }

  actualizarProducto(): void {
    this.productoService.actualizarProducto(this.nuevoProducto).subscribe({
      next: (res) => {
        alert('Producto actualizado exitosamente');
        this.router.navigate(['/inventario']);
      },
      error: (err) => {
        console.log('Error al actualizar producto:', err);
        alert('Error al actualizar el producto. Inténtalo de nuevo.');
      },
    });
  }
}
