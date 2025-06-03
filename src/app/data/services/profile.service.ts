import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Profile} from '../../helpers/interfaces/profile';
import {Pageble} from '../../helpers/interfaces/pageble';
import {map, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient);
  me = signal<Profile | null>(null)

  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  getTestAccount() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(
        tap(res => this.me.set(res))
      );
  }

  getSubscribersShortList(subsAmount = 3): Observable<Profile[]> {
    return this.http.get<Pageble<Profile>>(
      `${this.baseApiUrl}account/subscribers/`)
      .pipe(
        map(res => res.items.slice(0, subsAmount))
      )
  }


  getAccount(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
  }



  patchProfile(profile: Partial<Profile>): Observable<Profile> {
    return this.http.patch<Profile>(`${this.baseApiUrl}account/me`, profile);
  }

  uploadAvatar(file: File){
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<Profile>(`${this.baseApiUrl}account/upload_image `, fd);
  }
}
