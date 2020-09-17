import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './routes/home/home.component';
import { NgDefaultComponent } from './ng-default/ng-default.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { LoginSignupComponent } from './routes/login-signup/login-signup.component';
import { RedirectComponent } from './routes/redirect/redirect.component';
import { WidgetComponent } from './routes/widget/widget.component';
import { NotFoundComponent } from './routes/not-found/not-found.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { CommonService } from './services/common/common.service';
import { RequestsService } from './services/requests/requests.service';
import { ProfileComponent } from './routes/profile/profile.component';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoaderComponent } from './shared/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from './services/loader/loader.service';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CardCreateComponent } from './dialogs/card-create/card-create.component';
import { LoginSignupGuardService } from './services/login-signup-guard/login-signup-guard.service';
import { MatTableModule } from '@angular/material/table';
import { PasswordResetByTokenComponent } from './routes/password-reset-by-token/password-reset-by-token.component';
import { EditComponent } from './routes/edit/edit.component';
import { ContactComponent } from './routes/contact/contact.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { DialogService } from './services/dialog/dialog.service';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';
import { BtnCellRendererComponent } from './renderer/btn-cell-renderer/btn-cell-renderer.component';
import { InputDialogComponent } from './dialogs/input-dialog/input-dialog.component';
import 'ag-grid-enterprise';
import { ConfirmComponent } from './dialogs/confirm/confirm.component';
import { AccessListDialogComponent } from './dialogs/access-list-dialog/access-list-dialog.component';
import { Dialog2Service } from './services/dialog2/dialog2.service';
import { GroupWidgetComponent } from './routes/group-widget/group-widget.component';
import { ClipboardService } from 'ngx-clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    NgDefaultComponent,
    SidenavListComponent,
    LoginSignupComponent,
    RedirectComponent,
    WidgetComponent,
    NotFoundComponent,
    ProfileComponent,
    LoaderComponent,
    MessageDialogComponent,
    CardCreateComponent,
    PasswordResetByTokenComponent,
    EditComponent,
    ContactComponent,
    BtnCellRendererComponent,
    InputDialogComponent,
    ConfirmComponent,
    AccessListDialogComponent,
    GroupWidgetComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([BtnCellRendererComponent]),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRippleModule,
    MatGridListModule,
    MatSidenavModule,
    MatTableModule,
    MatRadioModule,
    MatListModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTreeModule,
    MatTooltipModule,
  ],
  providers: [AuthGuardService, LoginSignupGuardService, CommonService, RequestsService, CookieService, LoaderService, {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true
  }, { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
    { provide: MAT_DIALOG_DATA, useValue: null }, DialogService, Dialog2Service, ClipboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
