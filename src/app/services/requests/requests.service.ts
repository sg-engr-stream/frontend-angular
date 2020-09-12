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
  headerKey = 'Shorturl-Access-Token';

  constructor(private http: HttpClient, private cookie: CookieService, private common: CommonService) {
  }

  setCookie(username, secret): void {
    this.cookie.set('token', btoa(username + ':' + secret));
  }

  get_request(path): any {
    const token = this.cookie.get('token');
    let header: HttpHeaders;
    if (token.length > 0) {
      header = new HttpHeaders().append('Content-Type', 'application/json').append(this.headerKey, token);
    } else {
      header = new HttpHeaders().append('Content-Type', 'application/json');
    }
    return this.http.get(this.serverUrl + path, { headers: header });
  }

  post_request(path, data): any {
    const token = this.cookie.get('token');
    let header: HttpHeaders;
    if (token.length > 0) {
      header = new HttpHeaders().append('Content-Type', 'application/json').append(this.headerKey, token);
    } else {
      header = new HttpHeaders().append('Content-Type', 'application/json');
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

  fetchUserDetails(): any {
    const username = atob(this.cookie.get('token')).split(':')[0];
    return this.get_request('/user/id/' + username);
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

  getCardDetails(cardId): any {
    return this.get_request('/card/id/' + cardId);
  }

  getRedirectUrl(shortUrl): any {
    return this.get_request('/card/short_url/' + shortUrl);
  }
}
