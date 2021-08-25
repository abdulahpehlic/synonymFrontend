import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'synonym';
  mediaSub: Subscription;
  deviceSm: boolean;
  constructor (private router: Router) {}

  navigate(url: string){
    this.router.navigateByUrl(url);
  }

  currentRoute() {
    return this.router.url;
  }
}
