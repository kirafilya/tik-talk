import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TokenResponse} from './auth.interface';
import {CookieService} from 'ngx-cookie-service';
import {catchError, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http: HttpClient = inject(HttpClient);
  cookieService = inject(CookieService);
  router = inject(Router);

  baseApiUrl: string = 'https://icherniakov.ru/yt-course';

  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }
    return !!this.token;
  }

  login (data: { username: string, password: string })  {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}/auth/token`,
      formData
    ).pipe(
        tap(val => this.saveTokens(val))
    );
  }


  refreshAuthToken() {
    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}/auth/refresh`,
      {
        refresh_token: this.refreshToken,
      }
    ).pipe(
      tap(val => this.saveTokens(val),
      catchError(err => {
        this.logout()
        return throwError(err);
      })
      )
    )
  }

  logout() {
    this.cookieService.deleteAll();
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }

  saveTokens(res: TokenResponse) {
      this.token = res.access_token;
      this.refreshToken = res.refresh_token;

      this.cookieService.set('token', this.token);
      this.cookieService.set('refreshToken', this.refreshToken);
  }

}
