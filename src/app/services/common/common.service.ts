import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { CardCreateComponent } from '../../dialogs/card-create/card-create.component';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { EditComponent } from '../../routes/edit/edit.component';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isLoggedIn: boolean;
  username: string;
  name: string;
  emailVerified: boolean;
  email: string;
  onlyWidget = false;
  constructor(private dialog: MatDialog, private cookie: CookieService, private router: Router) {
    if (this.cookie.check('name')) {
      this.name = this.cookie.get('name');
    }
    if (this.cookie.check('loggedIn')) {
      this.isLoggedIn = this.cookie.get('loggedIn') === '1';
    }
    if (this.cookie.check('verified')) {
      this.emailVerified = this.cookie.get('verified') === '1';
    }
    if (this.cookie.check('username')) {
      this.username = this.cookie.get('username');
    }
  }

  openDialogMessage(title, message): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '90%',
      maxWidth: '400px',
      data: {title, message}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog Closed', result);
    });
  }

  openDialogCardCreate(message): void {
    const dialogRef = this.dialog.open(CardCreateComponent, {
      width: '90%',
      data: {message}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog Closed', result);
    });
  }

  openConfirmationDialog(): any {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      maxHeight: (window.screen.height - 260) + 'px'
    });
    return dialogRef.afterClosed();
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn || this.cookie.check('token');
  }

  logout(): void {
    this.isLoggedIn = false;
    this.clearCookies();
    this.router.navigate(['/']);
  }

  setUserDetails(res, redirect = true): void {
    const user = res as User;
    this.cookie.set('name', user.name.toUpperCase(), 10, '/');
    this.cookie.set('loggedIn', '1', 10, '/');
    this.cookie.set('verified', user.verified ? '1' : '0', 10, '/');
    this.cookie.set('username', user.username, 10, '/');
    this.name = user.name.toUpperCase();
    this.username = user.username;
    this.email = user.email;
    this.emailVerified = user.verified;
    this.isLoggedIn = true;
    if (redirect === true) {
      this.router.navigate(['/']);
    }
  }

  clearCookies(): void {
    this.cookie.deleteAll();
    this.cookie.deleteAll('/');
    this.cookie.deleteAll('/app');
    this.cookie.deleteAll('/*');
  }
}
