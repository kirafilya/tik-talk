import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Pageble, Profile} from '@tt/data-access';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  baseApiUrl: string = '/yt-course/';


  filterProfiles(params: Record<string, any>) {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, { params })
  }


  getTestAccount() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }


  getMe(): Observable<Profile>  {
    return this.http
      .get<Profile>(`${this.baseApiUrl}account/me`)
  }

  getSubscribersShortList(subsAmount = 3): Observable<Profile[]> {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(map((res) => res.items.slice(0, subsAmount)));
  }

  getAccount(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`);
  }

  patchProfile(profile: Partial<Profile>): Observable<Profile> {
    return this.http.patch<Profile>(`${this.baseApiUrl}account/me`, profile);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<Profile>(
      `${this.baseApiUrl}account/upload_image `,
      fd
    );
  }
}
