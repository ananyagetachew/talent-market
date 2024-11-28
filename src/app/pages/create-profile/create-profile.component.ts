import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; //Corrected import
import { Router } from '@angular/router';
import { TalentService } from '../../services/talent.service';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], //Corrected imports array
  template: `
    <div class="max-w-2xl mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Create Your Profile</h1>

      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label for="name" class="form-label">Name</label>
          <input type="text" id="name" formControlName="name" class="form-input">
          <div *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched" class="text-red-500">Name is required</div>
        </div>

        <div>
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" formControlName="email" class="form-input">
          <div *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched" class="text-red-500">Email is required and must be a valid email address</div>
        </div>

        <div>
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" formControlName="password" class="form-input">
          <div *ngIf="profileForm.get('password')?.invalid && profileForm.get('password')?.touched" class="text-red-500">Password is required</div>
        </div>

        <div>
          <label for="role" class="form-label">Role</label>
          <select id="role" formControlName="role" class="form-input">
            <option value="">Select a role</option>
            <option value="Software Developer">Software Developer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Marketing Specialist">Marketing Specialist</option>
          </select>
          <div *ngIf="profileForm.get('role')?.invalid && profileForm.get('role')?.touched" class="text-red-500">Role is required</div>
        </div>

        <div>
          <label for="skills" class="form-label">Skills (comma-separated)</label>
          <input type="text" id="skills" formControlName="skills" class="form-input" placeholder="e.g., JavaScript, React, Node.js">
        </div>

        <div>
          <label for="description" class="form-label">Description</label>
          <textarea id="description" formControlName="description" class="form-input" rows="4"></textarea>
        </div>

        <div>
          <label for="profilePicture" class="form-label">Profile Picture</label>
          <input type="file" id="profilePicture" (change)="onFileSelected($event)" accept="image/*" class="form-input">
        </div>

        <button type="submit" [disabled]="!profileForm.valid" class="btn btn-primary w-full">
          Create Profile
        </button>
      </form>
    </div>
  `
})
export class CreateProfileComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private talentService: TalentService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      skills: [''],
      description: [''],
    });
  }

  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('name', this.profileForm.value.name);
      formData.append('email', this.profileForm.value.email);
      formData.append('password', this.profileForm.value.password);
      formData.append('role', this.profileForm.value.role);
      formData.append('skills', this.profileForm.value.skills);
      formData.append('description', this.profileForm.value.description);

      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile);
      }

      this.talentService.createTalent(formData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => console.error('Profile creation failed:', error)
      });
    }
  }
}
