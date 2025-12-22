import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ RouterLink, RouterLinkActive, RouterOutlet],
  template: `
<h1 class="text-4xl font-bold text-center my-8">
   {{ title() }}
</h1>

<header>
  <nav class="flex justify-center gap-4 mb-8">
    
    <button class=" px-4 py-2 rounded border-b-2 hover:border-b-indigo-600 hover:text-indigo-400 transition" routerLink="/" routerLinkActive="active">
      Home
    </button> 

     <button class="px-4 py-2 rounded border-b-2 hover:border-b-indigo-600 hover:text-indigo-400 transition" routerLink="/stock" routerLinkActive="active">
      Stock
    </button> 

    
  </nav>
</header>
<div class="flex justify-center">
  <router-outlet/>
</div>

  `,
  styles: ``,
})
export class App {
 title = signal('Granja Pico');
}
