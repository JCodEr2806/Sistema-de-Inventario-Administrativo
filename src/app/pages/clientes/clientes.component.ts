import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/usuario.interface';
import { ClienteService } from '../../services/cliente.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements OnInit{
  clientes: Cliente[] = [];

  clientesOriginales: Cliente[] = [];

  mensaje: string | null = null;

  cargando: boolean = false;

  filtro: string = '';

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
      this.cargarCLientes();
  }

  cargarCLientes(): void {
    this.cargando = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesOriginales = [...data];
        this.cargando = false;
        this.mensaje = null;
      },
      error: (err) => {
        console.error('Error al cargar cliente:', err);
        this.cargando = false;
        this.mensaje = 'Error al conectar con la base de datos (json-server).';
      },
    });
  }

  filtrarClientes(): void {
    const texto = this.filtro.toLowerCase().trim();

    this.clientes = this.clientesOriginales.filter((client) => {
      const coincideTexto =
        client.nombre.toLowerCase().includes(texto) ||
        client.apellido.toLowerCase().includes(texto) ||
        client.id.toString().includes(texto);

      return coincideTexto;
        
    });
  }

  eliminarCliente(id: number | string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      console.log('Eliminando cliente con ID:', id);
      this.clienteService.eliminarCliente(id).subscribe({
        next: () => {
          alert('cliente eliminado exitosamente');
          this.clientes = this.clientes.filter((p) => p.id !== id);
          this.clientesOriginales = this.clientesOriginales.filter(
            (p) => p.id !== id
          );
        },
        error: (err) => {
          console.log('Error al eliminar cliente:', err);
          alert('Error al eliminar el cliente. Inténtalo de nuevo.');
          console.log(this.clientesOriginales);
        },
      });
    }
  }
}
