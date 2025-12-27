import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../../../models/proveedor.interface';
import { ProveedorService } from '../../../services/proveedor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-proveedor-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proveedor-page.component.html',
  styleUrl: './proveedor-page.component.css'
})
export class ProveedorPageComponent implements OnInit {
  proveedores: Proveedor[] = [];

  proveedoresOriginales: Proveedor[] = [];

  mensaje: string | null = null;

  cargando: boolean = false;

  filtro: string = '';

  constructor(
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.cargando = true;
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.proveedoresOriginales = [...data];
        this.cargando = false;
        this.mensaje = null;
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
        this.cargando = false;
        this.mensaje = 'Error al conectar con la base de datos (json-server).';
      },
    });
  }

  filtrarProveedores(): void {
    const texto = this.filtro.toLowerCase().trim();
    
    this.proveedores = this.proveedoresOriginales.filter((prov) => {
      const coincideTexto = 
        prov.nombre.toLowerCase().includes(texto) ||
        prov.id.toString().includes(texto);

      return coincideTexto;

    });
  }


  eliminarProveedor(id: number | string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      console.log('Eliminando proveedor con ID:', id);
      this.proveedorService.eliminarProveedor(id).subscribe({
        next: () => {
          alert('Proveedor eliminado exitosamente');
          this.proveedores = this.proveedores.filter((p) => p.id !== id);
          this.proveedoresOriginales = this.proveedoresOriginales.filter(
            (p) => p.id !== id
          );
        },
        error: (err) => {
          console.log('Error al eliminar proveedor:', err);
          alert('Error al eliminar el proveedor. Inténtalo de nuevo.');
          console.log(this.proveedoresOriginales);
        },
      });
    }
  }
}
