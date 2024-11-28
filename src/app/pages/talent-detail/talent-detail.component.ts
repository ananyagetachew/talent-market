import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TalentService, Talent } from '../../services/talent.service';

@Component({
  selector: 'app-talent-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8" *ngIf="talent">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/3">
            <img [src]="talent.profilePicture || 'assets/default-avatar.png'"
                 [alt]="talent.name"
                 class="w-full h-64 object-cover">
          </div>
          <div class="p-8 md:w-2/3">
            <h1 class="text-3xl font-bold mb-4">{{talent.name}}</h1>
            <p class="text-xl text-gray-600 mb-4">{{talent.role}}</p>
            
            <div class="mb-6">
              <h2 class="text-xl font-semibold mb-2">Skills</h2>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let skill of talent.skills"
                      class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {{skill}}
                </span>
              </div>
            </div>
            
            <div>
              <h2 class="text-xl font-semibold mb-2">About</h2>
              <p class="text-gray-700">{{talent.description}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TalentDetailComponent implements OnInit {
  talent: Talent | null = null;

  constructor(
    private route: ActivatedRoute,
    private talentService: TalentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.talentService.getTalentById(id).subscribe(talent => {
      this.talent = talent;
    });
  }
}