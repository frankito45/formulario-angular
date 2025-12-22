// Ejemplo de servicio (en Angular)
import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';

export interface Stocks {
  id: number;
  fecha: string;
  item: string;
  peso: string;
  estado: string;
  local: string;
  grupo: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly apiUrl = 'https://web-jtwq3l8uxb9p.up-de-fra1-k8s-1.apps.run-on-seenode.com/granjapico/stock/'; //  URL de la API

  constructor(private http: HttpClient) { }

  // Método GET
   getAll() {
    return this.http.get<Stocks[]>(this.apiUrl);
  }

  // GET por ID
  getById(id: number) {
    return this.http.get<Stocks>(`${this.apiUrl}/${id}`);
  }

  // GET por grupo
  getByGroup(grupo: string) {
    return this.http.get<Stocks[]>(`${this.apiUrl}/group/${grupo}`);
  }
  
  // POST
  postData(data:object) {
    return this.http.post<object>(this.apiUrl,data)
    
  }



}
