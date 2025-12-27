import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  nombreUsuario: string = '';
  nombreEmpresa: string = 'Abarrotes El Buen Sabor';

  menuItems = [
    { name: 'Dashboard', route: '/dashboard', icon: 'bi-speedometer2' },
    { name: 'Cobros/Pagos', route: '/cobros-pagos', icon: 'bi-cash-stack' },
    { name: 'Productos', route: '/inventario', icon: 'bi-box-seam' },
    { name: 'Clientes', route: '/clientes', icon: 'bi-people' },
    { name: 'Proveedores', route: '/proveedores', icon: 'bi-person-lines-fill' },
    // { name: 'Reportes', route: '/reportes', icon: 'bi-file-earmark-text' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();
    this.nombreUsuario = usuario ? usuario.nombreUsuario : 'Invitado';
  }
  
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
}
