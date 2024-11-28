import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Job {
  id: number;
  title: string;
  description: string;
  role: string;
  postedDate: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Welcome, {{(authService.currentUser$ | async)?.name}}!</h1>
        <p class="text-gray-600">Here are some job opportunities matching your profile</p>
      </div>

      <div class="grid gap-6">
        <div *ngFor="let job of jobs" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-2">{{job.title}}</h2>
          <p class="text-gray-600 mb-4">{{job.role}}</p>
          <p class="text-gray-700 mb-4">{{job.description}}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">Posted: {{job.postedDate | date}}</span>
            <button class="btn btn-primary">Apply Now</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  jobs: Job[] = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      description: 'Looking for an experienced frontend developer with React expertise.',
      role: 'Software Developer',
      postedDate: new Date().toISOString()
    },
    {
      id: 2,
      title: 'UX Designer',
      description: 'Seeking a talented UX designer to join our product team.',
      role: 'UI/UX Designer',
      postedDate: new Date().toISOString()
    }
  ];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // In a real application, we would fetch jobs from an API
  }
}