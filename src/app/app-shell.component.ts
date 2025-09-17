import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <!-- Navigation -->
    <div class="p-4 border-b border-base-border">
      <nav class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <h1 class="text-xl font-bold text-text-primary">UI Component Library</h1>
          <div class="flex items-center space-x-4">
            <a routerLink="/" class="text-text-secondary hover:text-text-primary transition-colors">Components</a>
            <a routerLink="/calendar-demo" class="text-text-secondary hover:text-text-primary transition-colors">Calendar Demo</a>
          </div>
        </div>
      </nav>
    </div>

    <!-- Router Outlet -->
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppShellComponent {}
