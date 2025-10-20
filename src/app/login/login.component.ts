import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class LoginComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly senha = new FormControl('', [Validators.required]);
  hide = signal(true);
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('E-mail obrigatório');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('E-mail inválido');
    } else {
      this.errorMessage.set('');
    }
  }

  onSubmit() {
    if (this.email.valid && this.senha.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      this.authService.login(this.email.value!, this.senha.value!).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage.set('Credenciais inválidas');
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Erro ao fazer login');
          this.isLoading.set(false);
        }
      });
    }
  }
}
