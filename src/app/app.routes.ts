import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { LayoutComponent } from './layout/layout.component';
import { AgregarProductoComponent } from './pages/agregar-producto/agregar-producto.component';
import { ProveedorPageComponent } from './pages/proveedor/proveedor-page/proveedor-page.component';
import { AgregarProveedorComponent } from './pages/proveedor/agregar-proveedor/agregar-proveedor.component';
import { CobrosPagosComponent } from './pages/cobros-pagos/cobros-pagos.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { AgregarClienteComponent } from './pages/clientes/agregar-cliente/agregar-cliente.component';
import { HistorialComponent } from './pages/cobros-pagos/historial/historial.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  // Ruta por defecto (login)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta para el componente de login
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'inventario',
        children: [
          { path: '', component: InventarioComponent },
          { path: 'agregar', component: AgregarProductoComponent },
          { path: 'editar/:id', component: AgregarProductoComponent },
        ],
      },
      {
        path: 'clientes',
        children: [
          {path: '', component: ClientesComponent},
          {path: 'agregar', component: AgregarClienteComponent},
          {path: 'editar/:id', component: AgregarClienteComponent},
        ]
      },
      {
        path: 'proveedores',
        children: [
          { path: '', component: ProveedorPageComponent },
          { path: 'agregar', component: AgregarProveedorComponent },
          { path: 'editar/:id', component: AgregarProveedorComponent },
        ],
      },
      {
        path: 'cobros-pagos',
        children: [
          { path: '', component: CobrosPagosComponent },
          { path: 'historial/pagos', component: HistorialComponent},
          { path: 'historial/cobros', component: HistorialComponent}
        ]
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'login' }, // Por si no se encuentra una ruta 
];
