import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TalentService, Talent } from '../../services/talent.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto px-4">
      <div class="mb-6">
        <label class="form-label">Filter by Role</label>
        <select [(ngModel)]="selectedRole" (change)="filterTalents()" class="form-input">
          <option value="">All Roles</option>
          <option *ngFor="let role of roles" [value]="role">{{role}}</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let talent of filteredTalents" 
             class="card cursor-pointer hover:shadow-lg transition-shadow"
             [routerLink]="['/talent', talent.id]">
          <img [src]="talent.profilePicture || 'assets/default-avatar.png'" 
               [alt]="talent.name"
               class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">{{talent.name}}</h3>
            <p class="text-gray-600 mb-2">{{talent.role}}</p>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let skill of talent.skills" 
                    class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {{skill}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  talents: Talent[] = [];
  filteredTalents: Talent[] = [];
  selectedRole = '';
  roles: string[] = [];

  constructor(private talentService: TalentService) {}

  ngOnInit(): void {
    this.talentService.getAllTalents().subscribe(talents => {
      this.talents = talents;
      this.filteredTalents = talents;
      this.roles = [...new Set(talents.map(t => t.role))];
    });
  }

  filterTalents(): void {
    this.filteredTalents = this.selectedRole
      ? this.talents.filter(t => t.role === this.selectedRole)
      : this.talents;
  }
}