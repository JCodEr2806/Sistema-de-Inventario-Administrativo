import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-agregar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agregar-cliente.component.html',
  styleUrl: './agregar-cliente.component.css',
})
export class AgregarClienteComponent implements OnInit {
  nuevoCliente = {
    id: '' as string | number,
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: '',
  };

  modoEdicion: boolean = false;

  constructor(
    private clientesService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modoEdicion = true;
      this.cargarCliente(id);
    }
  }

  cargarCliente(id: string): void {
    this.clientesService.getClientes().subscribe({
      next: (client) => {
        const cliente = client.find((p) => p.id === id);
        if (cliente) {
          this.nuevoCliente = { ...cliente };
        } else {
          alert('cliente no encontrado');
          this.router.navigate(['/clientes']);
        }
      },
      error: (err) => {
        console.error('Error al cargar el cliente:', err);
        alert('Error al cargar el cliente. Inténtalo de nuevo.');
        this.router.navigate(['/clientes']);
      },
    });
  }

  guardarCliente(): void {
    if (this.modoEdicion) {
      this.actualizarCliente();
    } else {
      this.agregarCliente();
    }
  }

  agregarCliente(): void {
    this.clientesService.getClientes().subscribe({
      next: (client) => {
        const ultimoId =
          client.length > 0
            ? Math.max(...client.map((p: any) => Number(p.id)))
            : 0;

        let idNuevo = ultimoId + 1;

        this.nuevoCliente.id = idNuevo.toString();

        this.clientesService.agregarCliente(this.nuevoCliente).subscribe({
          next: () => {
            alert('Cliente agregado exitosamente');
            this.router.navigate(['/clientes']);
          },
          error: (err) => {
            console.error('Error al agregar el Cliente:', err);
            alert('Error al agregar el Cliente. Inténtalo de nuevo.');
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
        alert('Error al conectar con la base de datos. Inténtalo de nuevo.');
      },
    });
  }

  actualizarCliente(): void {
    this.clientesService.actualizarCliente(this.nuevoCliente).subscribe({
      next: () => {
        alert('Cliente actualizado exitosamente');
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        console.error('Error al actualizar el cliente:', err);
        alert('Error al actualizar el cliente. Inténtalo de nuevo.');
      },
    });
  }
}
