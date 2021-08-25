import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWordComponent } from './create-word/create-word.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'create', component: CreateWordComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
