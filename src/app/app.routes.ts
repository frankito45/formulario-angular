import { Routes } from '@angular/router';
import { Stock } from './stock/stock';
import { Formulario } from './formulario/formulario';

export const routes: Routes = [
    {
        path: 'informes',
        component: Stock,
    },
    {
        path: '',
        component:Formulario
    },
    
];
