import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthErrors, GeneralErrors, FormValidationErrors, RequestStates, LoginCredentials } from '@core/models';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss']
})
export class LoginPanelComponent implements OnInit {

  loginForm: FormGroup | undefined;
  loginRequestState: RequestStates = RequestStates.None;
  credentialsError = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.redirectIfTheUserIsAlreadyLoggedIn();
    this.buildLoginForm();
  }

  private redirectIfTheUserIsAlreadyLoggedIn(): void {
    const authData = this.authService.getAuthData(false);
    if (authData) {
      const routeToRedirect = this.authService.getRouteToRedirectAfterLogin();
      this.router.navigateByUrl(routeToRedirect);
    }
  }

  private buildLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('', [
        Validators.required,
        Validators.email
      ]),
      password: this.formBuilder.control('', [
        Validators.required
      ])
    });
  }

  handleFormSubmit(): void {
    if (this.loginForm?.invalid) {
      return;
    }

    this.loginRequestState = RequestStates.Loading;

    const credentials = {
      email: this.loginForm?.controls['email'].value,
      password: this.loginForm?.controls['password'].value
    };

    this.submitLoginRequest(credentials);
  }

  private submitLoginRequest(credentials: LoginCredentials): void {
    this.authService.login(credentials)
      .subscribe({
        next: (result) => {
          this.router.navigateByUrl(result.routeToRedirect);
          this.loginRequestState = RequestStates.Success;
        },
        error: (error) => {
          if (error === AuthErrors.Credentials) {
            this.credentialsError = AuthErrors.Credentials;
          }
          else {
            this.notificationService.openNotification(GeneralErrors.Unexpected, 'error');
          }
          this.loginRequestState = RequestStates.None;
        }
      });
  }

  getFormControlErrorMessage(formControlName: string): string {
    const formControl = this.loginForm?.controls[formControlName];

    if (!formControl) {
      return '';
    }
    if (formControl.hasError('required')) {
      return FormValidationErrors.Required;
    }
    if (formControl.hasError('email')) {
      return FormValidationErrors.Invalid;
    }

    return '';
  }
}
