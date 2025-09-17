import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { config } from '@fortawesome/fontawesome-svg-core';

// Configure Font Awesome
config.autoAddCss = false; // Prevent Font Awesome from adding CSS automatically

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
