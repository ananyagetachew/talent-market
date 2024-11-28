import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <a routerLink="/" class="text-xl font-bold text-gray-800">Talent Directory</a>
          
          <div class="flex space-x-4">
            <a routerLink="/" class="text-gray-600 hover:text-gray-800">Home</a>
            <ng-container *ngIf="!(authService.currentUser$ | async); else authenticatedLinks">
              <a routerLink="/create-profile" class="text-gray-600 hover:text-gray-800">Create Profile</a>
              <a routerLink="/login" class="text-gray-600 hover:text-gray-800">Login</a>
            </ng-container>
            <ng-template #authenticatedLinks>
              <a routerLink="/dashboard" class="text-gray-600 hover:text-gray-800">Dashboard</a>
              <a routerLink="/settings" class="text-gray-600 hover:text-gray-800">Settings</a>
              <button (click)="logout()" class="text-gray-600 hover:text-gray-800">Logout</button>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}