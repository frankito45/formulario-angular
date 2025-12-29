import { Component, input, computed, signal} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { DataService } from '../data-service';


@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [],
  template: `
<p>solo los administradores tienen acceso a esta sección</p>
    `,
  styles: '',
})

export class Stock {
  
  grupo = input<string | null>(null);
  id = input<number | null>(null);

  constructor(private data: DataService) {}  

  stocks = httpResource(() => {
  const id = this.id();
  const grupo = this.grupo();

  console.log('Stock Component - id:', id, 'grupo:', grupo);

  // if (id !== null) {
  //   return {
  //     url: `https://web-66vzoi1semdv.up-de-fra1-k8s-1.apps.run-on-seenode.com/stock/${id}`,
  //   };
  // }

  // if (grupo !== null) {
  //   return {
  //     url: `https://web-66vzoi1semdv.up-de-fra1-k8s-1.apps.run-on-seenode.com/stock/group/${grupo}`,
  //   };
  // }

  return {
    url: 'https://web-jtwq3l8uxb9p.up-de-fra1-k8s-1.apps.run-on-seenode.com/granjapico/stock',
  };
  
});

objectKeys = Object.keys;

stockListRaw = computed(() => {
  const v = this.stocks.value();
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
});

groupedByDate = computed(() => {
  const list = this.stockListRaw();

  return list.reduce((acc: Record<string, any[]>, item) => {
    const fecha = item.fecha; // 👈 clave de agrupación

    if (!acc[fecha]) {
      acc[fecha] = [];
    }

    acc[fecha].push(item);
    return acc;
  }, {});
});

fechas = computed(() => Object.keys(this.groupedByDate()));



}


