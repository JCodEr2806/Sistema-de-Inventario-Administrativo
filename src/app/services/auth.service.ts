import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credenciales, Usuario } from '../models/usuario.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://localhost:3000/usuarios';
  private usuarioActual: Usuario | null = null;

  constructor(private http: HttpClient) { }

  login(credenciales: Credenciales): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiURL}?nombreUsuario=${credenciales.nombreUsuario}`).pipe(
      map(usuarios => {
        if(usuarios && usuarios.length > 0){
          const usuarioEncontrado = usuarios[0];

          if(usuarioEncontrado.contraseña === credenciales.contraseña){
            this.usuarioActual = usuarioEncontrado;
            return usuarioEncontrado;
          }
        }

        return null;
      })
    )
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual;
  }

  logout(): void {
    this.usuarioActual = null;
  }
  
}
