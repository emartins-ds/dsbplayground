import { Routes } from '@angular/router';
import { CalendarDemoComponent } from './calendar-demo/calendar-demo.component';
import { ComponentsPageComponent } from './ui-components/components-page.component';
import { ServiceListComponent } from './service-list/service-list.component';

export const routes: Routes = [
  { path: '', component: ComponentsPageComponent },
  { path: 'calendar-demo', component: CalendarDemoComponent },
  { path: 'service-list', component: ServiceListComponent }
];
