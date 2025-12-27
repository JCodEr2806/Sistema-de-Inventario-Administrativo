import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Credenciales } from '../../models/usuario.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  mensajeError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contraseña: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.mensajeError = null;
    
    if(this.loginForm.valid){
      const credenciales: Credenciales = this.loginForm.value;

      this.authService.login(credenciales).subscribe({
        next: (usuario) => {
          if(usuario){
            console.log('Login exitoso', usuario);
            this.router.navigate(['/inventario']);
          } else {
            this.mensajeError = 'Nombre de usuario o contraseña incorrectos.';
          }
        },
        error: (err) => {
          console.error('Error en el login', err);
          this.mensajeError = 'Ocurrió un error durante el proceso de login. Por favor, intenta nuevamente más tarde.';
        }
      })
    
      // console.log('Datos del login validos', this.loginForm.value);
    } else {
      this.mensajeError = 'Por favor, completa todos los campos del formulario.';
      // console.log('Formulario invalido');
    }
  }
}
