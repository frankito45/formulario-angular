import { Routes } from '@angular/router';
import { Stock } from './stock/stock';
import { Formulario } from './formulario/formulario';

export const routes: Routes = [
    {
        path: 'stock',
        component: Stock,
    },
    {
        path: '',
        component:Formulario
    },
    
];
