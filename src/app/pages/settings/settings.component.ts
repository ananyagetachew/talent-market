import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TalentService, Talent } from '../../services/talent.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Profile Settings</h1>
      
     
      
      <form (ngSubmit)="onSubmit()" *ngIf="profile" class="space-y-6">
        <div>
          <label for="name" class="form-label">Name</label>
          <input type="text" id="name" name="name" [(ngModel)]="profile.name"
                 class="form-input">
        </div>

        <div>
          <label for="role" class="form-label">Role</label>
          <select id="role" name="role" [(ngModel)]="profile.role" class="form-input">
            <option value="Software Developer">Software Developer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Marketing Specialist">Marketing Specialist</option>
          </select>
        </div>

        <div>
          <label for="skills" class="form-label">Skills (comma-separated)</label>
          <input type="text" id="skills" name="skills" 
                 [(ngModel)]="skillsString"
                 class="form-input">
        </div>

        <div>
          <label for="description" class="form-label">Description</label>
          <textarea id="description" name="description" 
                    [(ngModel)]="profile.description"
                    class="form-input" rows="4"></textarea>
        </div>

        <div>
          <label for="profilePicture" class="form-label">Profile Picture</label>
          <input type="file" id="profilePicture" 
                 (change)="onFileSelected($event)"
                 accept="image/*" class="form-input">
        </div>

        <button type="submit" class="btn btn-primary w-full">
          Save Changes
        </button>
      </form>
       <div *ngIf="successMessage" class="bg-green-500 text-white p-4 mb-4 rounded">
        {{ successMessage }}
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  profile: Talent | null = null;
  skillsString = '';
  selectedFile: File | null = null;
  successMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private talentService: TalentService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user?.id) {
        this.talentService.getTalentById(user.id).subscribe(talent => {
          this.profile = talent;
          this.skillsString = talent.skills.join(', ');
        });
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.profile) return;

    if (!this.authService.isAuthenticated()) {
      console.error('User is not authenticated');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.profile.name);
    formData.append('role', this.profile.role);
    formData.append('skills', this.skillsString);
    formData.append('description', this.profile.description);
    
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile);
    }

    this.talentService.updateTalent(this.profile.id, formData).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.skillsString = updatedProfile.skills.join(', ');
        this.successMessage = 'Profile updated successfully!';

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Profile update failed:', error);
        this.successMessage = null;
      }
    });
  }
}