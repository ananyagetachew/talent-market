import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Observable, map,catchError  } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { throwError } from 'rxjs';

export interface Talent {
  id: number;
  name: string;
  role: string;
  skills: string[];
  profilePicture: string;
  description: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class TalentService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllTalents(): Observable<Talent[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/talents`).pipe(
      map(talents => talents.map(talent => ({
        ...talent,
        skills: typeof talent.skills === 'string' ? talent.skills.split(',') : talent.skills
      })))
    );
  }

  getTalentById(id: number): Observable<Talent> {
    return this.http.get<any>(`${environment.apiUrl}/talents/${id}`).pipe(
      map(talent => ({
        ...talent,
        skills: typeof talent.skills === 'string' ? talent.skills.split(',') : talent.skills
      }))
    );
  }

  createTalent(talent: FormData): Observable<Talent> {
    return this.http.post<any>(`${environment.apiUrl}/talents`, talent).pipe(
      map(talent => ({
        ...talent,
        skills: typeof talent.skills === 'string' ? talent.skills.split(',') : talent.skills
      }))
    );
  }








   updateTalent(id: number, talent: FormData): Observable<Talent> {
    return this.http.put<any>(`${environment.apiUrl}/talents/${id}`, talent, this.getAuthHeaders()).pipe(
      map(talent => ({
        ...talent,
        skills: typeof talent.skills === 'string' ? talent.skills.split(',') : talent.skills
      })),
      catchError(this.handleError)
    );
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.Authenticated();
    if (token) {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    }
          return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };

  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized. Please log in.';
    } else if (error.status === 403) {
      errorMessage = 'Forbidden. You do not have permission to perform this action.';
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}