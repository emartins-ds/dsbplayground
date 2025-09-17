import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faChevronDown, faClock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { HlmButton } from '../../component/ui/ui-button-helm/src';
import { HlmBadge } from '../../component/ui/ui-badge-helm/src';
import { HlmCard, HlmCardHeader, HlmCardTitle, HlmCardContent } from '../../component/ui/ui-card-helm/src';
import { HlmFormFieldModule } from '../../component/ui/ui-form-field-helm/src';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  description?: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  isSelected: boolean;
}

interface Employee {
  id: string;
  name: string;
}

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    HlmButton,
    HlmBadge,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardContent,
    HlmFormFieldModule,
    BrnSelectImports,
    HlmSelectImports
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css'
})
export class ServiceListComponent {
  // Icons
  protected readonly faPlus = faPlus;
  protected readonly faChevronDown = faChevronDown;
  protected readonly faClock = faClock;
  protected readonly faCheck = faCheck;

  // Selected employee
  protected readonly selectedEmployee = signal<string>('all');

  // Selected services
  protected readonly selectedServices = signal<Set<string>>(new Set());

  // Categories with selection state
  protected readonly categories = signal<Category[]>([
    { id: 'haircuts', name: 'Haircuts', isSelected: false },
    { id: 'hairstyling', name: 'Hairstyling', isSelected: false },
    { id: 'highlights', name: 'Highlights/Lowlights', isSelected: false },
    { id: 'coloring', name: 'Hair Coloring', isSelected: false }
  ]);

  // Test data for employees
  protected readonly employees: Employee[] = [
    { id: 'all', name: 'All Employees' },
    { id: 'sarah', name: 'Sarah Johnson' },
    { id: 'mike', name: 'Mike Chen' },
    { id: 'emma', name: 'Emma Rodriguez' },
    { id: 'david', name: 'David Kim' }
  ];

  // Test data for services
  protected readonly services: Service[] = [
    // Haircuts
    { id: '1', name: 'Clipper Cut', duration: '30 Min', price: '$50', category: 'haircuts' },
    { id: '2', name: 'Middle Length Haircut', duration: '30 Min', price: '$75', description: 'Choose this option if your hair is chin to shoulder length.', category: 'haircuts' },
    { id: '3', name: 'Long Haircut', duration: '30 Min', price: 'Starts at $95', description: 'Choose this option if your hair is longer than your shoulders. Price may vary depending on length.', category: 'haircuts' },
    
    // Hairstyling
    { id: '4', name: 'Wedding Consult', duration: '30 Min', price: '$0', description: 'You must schedule a consult before booking a wedding package.', category: 'hairstyling' },
    { id: '5', name: 'Wedding Package', duration: '30 Min', price: '$75', description: 'Complete wedding day styling package.', category: 'hairstyling' },
    { id: '6', name: 'Special Event Styling', duration: '45 Min', price: '$65', description: 'Perfect for proms, parties, and special occasions.', category: 'hairstyling' },
    
    // Highlights/Lowlights
    { id: '7', name: 'Partial Highlights', duration: '2 Hr', price: '$120', description: 'Highlights on the top layer of hair.', category: 'highlights' },
    { id: '8', name: 'Full Highlights', duration: '3 Hr', price: '$180', description: 'Complete highlights throughout all hair.', category: 'highlights' },
    { id: '9', name: 'Lowlights', duration: '2.5 Hr', price: '$150', description: 'Add depth and dimension with darker tones.', category: 'highlights' },
    
    // Hair Coloring
    { id: '10', name: 'Single Process Color', duration: '1.5 Hr', price: '$85', description: 'All-over hair color application.', category: 'coloring' },
    { id: '11', name: 'Root Touch-Up', duration: '1 Hr', price: '$65', description: 'Color just the new growth at the roots.', category: 'coloring' },
    { id: '12', name: 'Color Correction', duration: '3 Hr', price: 'Starts at $200', description: 'Fixing previous color issues. Price varies by complexity.', category: 'coloring' }
  ];

  // Get filtered services by category
  protected getServicesByCategory(categoryId: string): Service[] {
    return this.services.filter(service => service.category === categoryId);
  }

  // Get selected categories
  protected getSelectedCategories(): Category[] {
    return this.categories().filter(cat => cat.isSelected);
  }

  // Toggle category selection
  protected toggleCategory(categoryId: string): void {
    this.categories.update(current => 
      current.map(cat => ({
        ...cat,
        isSelected: cat.id === categoryId ? !cat.isSelected : false
      }))
    );
  }

  // Select employee
  protected selectEmployee(employeeId: string | string[] | undefined): void {
    if (employeeId && typeof employeeId === 'string') {
      this.selectedEmployee.set(employeeId);
    }
  }

  // Check if a service is selected
  protected isServiceSelected(serviceId: string): boolean {
    return this.selectedServices().has(serviceId);
  }

  // Toggle service selection
  protected toggleServiceSelection(serviceId: string): void {
    this.selectedServices.update(current => {
      const newSet = new Set(current);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  }

  // Get services for selected categories
  protected getFilteredServices(): Service[] {
    const selectedCategories = this.getSelectedCategories();
    if (selectedCategories.length === 0) {
      // If no categories are selected, show all services
      return this.services;
    }
    
    return this.services.filter(service => 
      selectedCategories.some(cat => cat.id === service.category)
    );
  }
}
