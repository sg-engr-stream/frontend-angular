import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  serverUrl: string = environment.backendUrl;
  headerKey = 'shorturl-access-token';

  constructor(private http: HttpClient, private cookie: CookieService, private common: CommonService) {
  }

  setCookie(username, secret): void {
    this.cookie.set('token', btoa(username + ':' + secret));
  }

  get_request(path): any {
    const token = this.cookie.get('token');
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token.length > 0) {
      header.append(this.headerKey, token);
    }
    return this.http.get(this.serverUrl + path, { headers: header });
  }

  post_request(path, data): any {
    const token = this.cookie.get('token');
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token.length > 0) {
      header.append(this.headerKey, token);
    }
    return this.http.post(this.serverUrl + path, data, { headers: header, responseType: 'json' });
  }

  login(username, secret): any {
    this.setCookie(username, secret);
    return this.post_request('/user/login_check/' + username,  { secret });
  }

  signup(name, username, email, secret): any {
    this.setCookie(username, secret);
    const data = { name, username, email, secret };
    return this.post_request('/user/add/', data);
  }

  checkUsernameAvailability(username): any {
    return this.get_request('/user/available/' + username);
  }

  checkShortUrlAvailability(shortUrl): any {
    return this.get_request('/card/available/' + shortUrl);
  }

  createShortUrl(data): any {
    return this.post_request('/card/add/', data);
  }
}
