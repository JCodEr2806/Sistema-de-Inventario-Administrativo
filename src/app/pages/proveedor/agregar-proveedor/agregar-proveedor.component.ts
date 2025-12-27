import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Proveedor } from '../../../models/proveedor.interface';
import { ProveedorService } from '../../../services/proveedor.service';

@Component({
  selector: 'app-agregar-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agregar-proveedor.component.html',
  styleUrl: './agregar-proveedor.component.css',
})
export class AgregarProveedorComponent implements OnInit {
  nuevoProveedor = {
    id: '' as string | number,
    nombre: '',
    ruc: '',
    telefono: '',
    email: '',
    direccion: '',
    codigo_postal: '',
    ciudad: '',
    pais: '',
    descripcion: '',
  };

  modoEdicion: boolean = false;

  constructor(
    private proveedorService: ProveedorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modoEdicion = true;
      this.cargarProveedor(id);
    }
  }

  cargarProveedor(id: string): void {
    this.proveedorService.getProveedores().subscribe({
      next: (proveedor) => {
        const prov = proveedor.find((p) => p.id === id);
        if (prov) {
          this.nuevoProveedor = { ...prov };
        } else {
          alert('Proveedor no encontrado');
          this.router.navigate(['/proveedores']);
        }
      },
      error: (err) => {
        console.error('Error al cargar el proveedor:', err);
        alert('Error al cargar el proveedor. Inténtalo de nuevo.');
        this.router.navigate(['/proveedores']);
      },
    });
  }

  guardarProveedor(): void {
    if (this.modoEdicion) {
      this.actualizarProveedor();
    } else {
      this.agregarProveedor();
    }
  }

  agregarProveedor(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (prov) => {
        const ultimoId =
          prov.length > 0 ? Math.max(...prov.map((p: any) => Number(p.id))) : 0;

        let idNuevo = ultimoId + 1;

        this.nuevoProveedor.id = idNuevo.toString();

        this.proveedorService.agregarProveedor(this.nuevoProveedor).subscribe({
          next: () => {
            alert('Proveedor agregado exitosamente');
            this.router.navigate(['/proveedores']);
          },
          error: (err) => {
            console.error('Error al agregar el proveedor:', err);
            alert('Error al agregar el proveedor. Inténtalo de nuevo.');
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener proveedores:', err);
        alert('Error al conectar con la base de datos. Inténtalo de nuevo.');
      },
    });
  }

  actualizarProveedor(): void {
    this.proveedorService.actualizarProveedor(this.nuevoProveedor).subscribe({
      next: () => {
        alert('Proveedor actualizado exitosamente');
        this.router.navigate(['/proveedores']);
      },
      error: (err) => {
        console.error('Error al actualizar el proveedor:', err);
        alert('Error al actualizar el proveedor. Inténtalo de nuevo.');
      },
    });
  }
}
