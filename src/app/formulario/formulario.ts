import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../data-service';

interface Item {
  name: string;
  peso: number;
}

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<form [formGroup]="formulario"
       (ngSubmit)="onSubmint()"
      class="max-w-2xl mx-auto p-4 bg-[#f5e4c2] dark:bg-[#271d2c] rounded shadow space-y-4">

  <!-- FECHA -->
  <div >
    <label class="font-bold block mb-1">Fecha:</label>
    <input type="datetime-local"
           formControlName="fecha"
           class="border p-2 rounded w-full bg-white text-black">
  </div>

  <!-- LOCAL -->
  <div>
    <label class="font-bold block mb-1">Local:</label>
    <select formControlName="local"
            class="border p-2 rounded w-full bg-white text-black">
      <option value="">Seleccionar...</option>
      <option value="Guernica">Guernica</option>
      <option value="Central Glew">Central Glew</option>
      <option value="Frezzer">Frezzer</option>
      <option value="Otro">Otro</option>
    </select>
  </div>
  <!-- ESTADO -->
  <div>
    <label class="font-bold block mb-1">Estado:</label>
    <select formControlName="estado"
            class="border p-2 rounded w-full bg-white text-black">
      <option value="">Seleccionar...</option>
      <option value="inicio">Inicio</option>
      <option value="produccion">Produccion</option>
      <option value="envio">Envio</option>
      <option value="ingreso">Ingreso</option>
      <option value="final">Final</option>
    </select>
  </div>

  <!-- GRUPO -->
  <div>
    <label class="font-bold block mb-1">Grupo:</label>
    <select formControlName="grupo"
            (change)="onGrupoChange($event)"
            class="border p-2 rounded w-full bg-white text-black">
      <option value="">Seleccionar...</option>
      <option value="pollo">Pollo</option>
      <option value="cerdo">Cerdo</option>
      <option value="otro">Otro</option>
    </select>
  </div>
  
  <!-- ITEMS -->
  @for (item of itemsFormArray.controls; track $index) {
    <div [formGroup]="item" class="space-y-1 flex justify-between">
      <label class="font-bold font-mono px-3" >{{item.get('name')?.value}}</label>
      <input type="number" formControlName="peso" class="mx-3 bg-amber-50 rounded-lg text-center dark:text-black">
    </div>
  }

  <div class="flex justify-end pt-2" >
    <button type="submit" class="hover:border-b-indigo-600 border-b-2 rounded-xs px-3 ">  Enviar  </button>
  </div>
</form>
`,
  styles: ``,
})
export class Formulario {

  ITEMS_POR_GRUPO: Record<string, Item[]> = {
    pollo: [
      { name: 'pata y muslo', peso: 0 },
      { name: 'suprema', peso: 0 },
      { name: 'ala', peso: 0 },
      { name: 'menudo', peso: 0 },
      { name: 'huevo', peso: 0 },
      { name: 'milanesa', peso: 0},
      { name: 'pollo', peso: 0},
      { name: 'cajon pollo', peso: 0}

    ],
    cerdo: [
      { name: 'Bondiola', peso: 0 },
      { name: 'Pechito', peso: 0 },
      { name: 'Lomo', peso: 0 },
      { name: 'Carre', peso: 0 },
      { name: 'Matambre', peso:0 },
      { name: 'salame', peso:0 },
      { name: 'chorizo', peso:0 },
      { name: 'chorizo super', peso:0 },
      { name: 'morcilla', peso:0 },
      { name: 'morcilla vasca', peso:0 }
    ],
    otro: []
  };

  formulario = new FormGroup({
    fecha: new FormControl(''),
    local: new FormControl(''),
    grupo: new FormControl(''),
    estado: new FormControl(''),
    item: new FormArray([])  
  });

  constructor(private dataServise:DataService) {
    this.setFechaActual();

  }

  get itemsFormArray():FormArray<FormGroup>  {
    return this.formulario.get('item') as FormArray;
  }

  setFechaActual() {
    const iso = new Date().toISOString().slice(0, 16); 
    this.formulario.get('fecha')?.setValue(iso);
  }

  onGrupoChange(event: Event) {
    const grupo = (event.target as HTMLSelectElement).value;

    const items = this.ITEMS_POR_GRUPO[grupo] ?? [];

    this.itemsFormArray.clear();

    items.forEach(it => {
      this.itemsFormArray.push(
        new FormGroup({
          name: new FormControl(it.name),
          peso: new FormControl(it.peso),
        })
      );
    });
  }

 onSubmint() {

  const formValue = this.formulario.value;

  const itemsValidos = this.itemsFormArray.value
    .filter(i => i.peso != null && i.peso > 0);

  if (itemsValidos.length === 0) {
    alert('Debe ingresar al menos un peso');
    return;
  }

  const payload = {
    fecha: formValue.fecha,
    local: formValue.local,
    estado: formValue.estado,
    grupo: formValue.grupo,
    item: itemsValidos
  };

  console.log('Payload a enviar:', payload);

  this.dataServise.postData(payload).subscribe({
    next: res => {
      console.log('Guardado correctamente:', res);
      this.formulario.reset();
      this.itemsFormArray.clear();
      this.setFechaActual();
    },
    error: err => console.error('Error al guardar:', err)
  });
}


}
