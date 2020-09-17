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
    this.cookie.set('token', btoa(username + ':' + secret), 10, '/');
  }

  setHeaders(): any {
    const token = this.cookie.get('token');
    let header: HttpHeaders;
    if (token.length > 0) {
      header = new HttpHeaders().append('Content-Type', 'application/json').append(this.headerKey, token)
        .append('Access-Control-Allow-Origin', environment.backendUrl);
    } else {
      header = new HttpHeaders().append('Content-Type', 'application/json');
    }
    return header;
  }

  get_request(path): any {
    const header = this.setHeaders();
    return this.http.get(this.serverUrl + path, { headers: header });
  }

  post_request(path, data): any {
    const header = this.setHeaders();
    return this.http.post(this.serverUrl + path, data, { headers: header, responseType: 'json' });
  }

  login(username, secret): any {
    this.setCookie(username, secret);
    this.post_request('/user/login_check/' + username,  { secret }).subscribe(res => {
      this.common.setUserDetails(res.result);
    }, err => {
      let msg;
      if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
        msg = 'User or Password is wrong';
      } else {
        msg = err.error.response;
      }
      this.common.clearCookies();
      this.common.openDialogMessage('Login Failed', msg);
    });
  }

  signup(name, username, email, secret): any {
    this.setCookie(username, secret);
    const data = { name, username, email, secret };
    this.post_request('/user/add/', data).subscribe(res => {
      this.common.setUserDetails(res.result);
    }, err => {
      this.common.clearCookies();
      this.common.openDialogMessage('SignUp Failed', err.error.message);
    });
  }

  fetchUserDetails(): any {
    const username = atob(this.cookie.get('token')).split(':')[0];
    return this.get_request('/user/id/' + username);
  }

  checkUsernameAvailability(username): any {
    return this.get_request('/user/available/' + username);
  }

  checkEmailAvailability(email): any {
    return this.post_request('/user/email_available/', {email});
  }

  checkShortUrlAvailability(shortUrl): any {
    return this.get_request('/card/available/' + shortUrl);
  }

  createShortUrl(data): any {
    return this.post_request('/card/add/', data);
  }

  getCardDetails(cardId): any {
    if (typeof cardId === typeof 'abc') {
      cardId = {card_id: [cardId]};
    }
    return this.post_request('/card/id/', cardId);
  }

  getRedirectUrl(shortUrl): any {
    return this.get_request('/short_url/' + shortUrl);
  }

  resendVerification(): any {
    return this.post_request('/user/action/resend_verification/', {username: this.common.username});
  }

  sendPasswordReset(email): any {
    return this.post_request('/user/password_reset/', {email});
  }

  updatePasswordByToken(data): any {
    return this.post_request('/user/update_password_by_token/', data);
  }

  verify(code): any {
    return this.post_request('/user/action/verify/', {username: this.common.username, verification_code: code});
  }

  getProfileData(): any {
    return this.post_request('/profile/get_data/', {username: this.common.username});
  }

  createGroup(title, description, iconUrl, cardIds): any {
    const data = {
      username: this.common.username,
      title,
      description,
      icon_url: iconUrl,
      card_ids: cardIds
    };
    if (iconUrl.length === 0) {
      delete data.icon_url;
    }
    return this.post_request('/group/add/', data);
  }

  getCardDetailsByGroupIds(groupIds): any {
    return this.post_request('/group/id/', {group_ids: groupIds});
  }

  updateCardDetails(cardId, data): any {
    return this.post_request('/card/update/' + cardId, data);
  }

  addCardAccess(data): any {
    return this.post_request('/card_access/add/', data);
  }
}
