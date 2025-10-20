import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { IThemeConfig, IUser, ICompany } from '../../core/models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false
})
export class ToolbarComponent implements OnInit {
  @Input() isMenuOpen = false;
  @Output() menuToggle = new EventEmitter<void>();

  themeConfig: IThemeConfig | null = null;
  currentUser: IUser | null = null;
  companies: ICompany[] = [];
  selectedCompany: ICompany | null = null;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carrega configuração de tema
    this.themeService.themeConfig$.subscribe(theme => {
      this.themeConfig = theme;
    });

    // Carrega dados do usuário
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Carrega companies
    this.companies = this.authService.getCompanies();
    this.selectedCompany = this.authService.getSelectedCompany();

    // Carrega tema se não estiver carregado
    if (!this.themeConfig) {
      this.themeService.loadThemeConfig();
    }
  }

  toggleMenu(): void {
    this.menuToggle.emit();
  }

  onCompanyChange(): void {
    if (this.selectedCompany) {
      this.authService.setSelectedCompany(this.selectedCompany);
      // Recarrega tema para nova company
      this.themeService.loadThemeConfig();
      // Recarrega página para aplicar mudanças
     // window.location.reload();
    }
  }

  goToProfile(): void {
    // Implementar navegação para perfil
    console.log('Ir para perfil');
  }

  changePassword(): void {
    // Implementar mudança de senha
    console.log('Trocar senha');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getToolbarStyle(): any {
    if (!this.themeConfig) return {};

    return {
      'background-color': this.themeConfig.corToolbar,
      'color': this.themeConfig.corTextoMenuBar
    };
  }

  getLogoToolbar(): string {
    return this.themeService.getLogoToolbar();
  }

  getLogoToolbarMin(): string {
    return this.themeService.getLogoToolbarMin();
  }

  getCompanyName(): string {
    return this.selectedCompany?.name_fant || this.themeConfig?.companyName || 'Empresa';
  }

  getUserName(): string {
    return this.currentUser?.name || 'Usuário';
  }
}
