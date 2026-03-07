import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Stocks } from '../data-service';

@Component({
selector: 'app-stock',
standalone: true,
imports: [CommonModule, FormsModule],
template: `

<div class="container">

<h1 class="titulo">Stock</h1>

<input
type="date"
class="inputFecha"
[(ngModel)]="fechaSeleccionada"
/>

@if(fechaSeleccionada()){

@for(local of stockAgrupado(); track local.local){

<div class="card">

<h2>{{local.local}}</h2>

<table>

<thead>
<tr>
<th>Item</th>
<th>Inicio</th>
<th>Ingreso</th>
<th>Producción</th>
<th>Envio</th>
<th>Stock Teórico</th>
<th>Merma</th>
<th>Stock Real</th>
<th>Final</th>
<th>Vendido</th>
</tr>
</thead>

<tbody>

@for(item of local.items; track item.item){

<tr [class.error]="item.vendido < 0">

<td>{{item.item}}</td>
<td>{{item.inicio}}</td>
<td>{{item.ingreso}}</td>
<td>{{item.produccion}}</td>
<td>{{item.envio}}</td>
<td>{{item.stockTeorico}}</td>
<td>{{item.merma}}</td>
<td>{{item.stockReal}}</td>
<td>{{item.final}}</td>
<td class="vendido">{{item.vendido}}</td>

</tr>

}

</tbody>

</table>

</div>

}

}

</div>

`,
styles: [`

.container{
max-width:900px;
margin:auto;
padding:20px;
}

.titulo{
font-size:40px;
margin-bottom:20px;
}

.inputFecha{
font-size:22px;
padding:10px;
border-radius:8px;
margin-bottom:30px;
}

.card{
border:1px solid #555;
border-radius:12px;
padding:20px;
margin-bottom:25px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:10px;
}

th,td{
border:1px solid #444;
padding:8px;
text-align:center;
}

th{
background:#111;
}

.vendido{
font-weight:bold;
color:#22c55e;
}

.error{
background:#3b0a0a;
color:#ffb4b4;
}

`]
})
export class Stock {

dataService = inject(DataService);

stocks = signal<Stocks[]>([]);

fechaSeleccionada = signal('');


// porcentaje de merma editable
mermas: Record<string, number> = {

"pata y muslo": 0.05,
"suprema": 0.03,
"ala": 0.04,
"milanesa": 0.06

};

constructor(){

this.dataService.getAll().subscribe(res=>{
this.stocks.set(res);
});

}


stocksFiltrados = computed(()=>{

if(!this.fechaSeleccionada()) return [];

return this.stocks().filter(s => {

const fechaApi = new Date(s.fecha).toISOString().slice(0,10);

return fechaApi === this.fechaSeleccionada();

});

});


stockAgrupado = computed(()=>{

const datos = this.stocksFiltrados();

const resultado:any = {};

datos.forEach(s=>{

const local = s.local;
const item = s.item;
const peso = Number(s.peso);

if(!resultado[local]) resultado[local] = {};

if(!resultado[local][item]){

resultado[local][item] = {
item,
inicio:0,
ingreso:0,
produccion:0,
envio:0,
final:0,
stockTeorico:0,
merma:0,
stockReal:0,
vendido:0
};

}

if(s.estado === 'inicio') resultado[local][item].inicio += peso;
if(s.estado === 'ingreso') resultado[local][item].ingreso += peso;
if(s.estado === 'produccion') resultado[local][item].produccion += peso;
if(s.estado === 'envio') resultado[local][item].envio += peso;
if(s.estado === 'final') resultado[local][item].final += peso;

});


const salida:any[] = [];

Object.keys(resultado).forEach(local=>{

const items:any[] = [];

Object.keys(resultado[local]).forEach(item=>{

const r = resultado[local][item];

r.stockTeorico =
r.inicio +
r.ingreso +
r.produccion -
r.envio;

const porcentajeMerma = this.mermas[r.item] || 0;

r.merma = Number((r.stockTeorico * porcentajeMerma).toFixed(2));

r.stockReal = Number((r.stockTeorico - r.merma).toFixed(2));

r.vendido = Number((r.stockReal - r.final).toFixed(2));

items.push(r);

});

salida.push({
local,
items
});

});

return salida;

});

}