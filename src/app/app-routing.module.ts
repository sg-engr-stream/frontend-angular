import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { NgDefaultComponent } from './ng-default/ng-default.component';
import { LoginSignupComponent } from './routes/login-signup/login-signup.component';
import { RedirectComponent } from './routes/redirect/redirect.component';
import { WidgetComponent } from './routes/widget/widget.component';
import { NotFoundComponent } from './routes/not-found/not-found.component';
import { ProfileComponent } from './routes/profile/profile.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { LoginSignupGuardService } from './services/login-signup-guard/login-signup-guard.service';
import { PasswordResetByTokenComponent } from './routes/password-reset-by-token/password-reset-by-token.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'app/login', component: LoginSignupComponent, data: { type: 'login'}, canActivate: [LoginSignupGuardService]},
  {path: 'app/signup', component: LoginSignupComponent, data: { type: 'signup'}, canActivate: [LoginSignupGuardService]},
  {path: 'app/profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  {path: 'w/:widget', component: WidgetComponent},
  {path: 'app/password_reset/:token/:username', component: PasswordResetByTokenComponent, canActivate: [LoginSignupGuardService]},
  {path: 'app/default', component: NgDefaultComponent},
  {path: ':shortUrl', component: RedirectComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
