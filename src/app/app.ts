import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {
  // This component now serves as a routing shell
  // All UI component demos have been moved to ComponentsPageComponent
}
