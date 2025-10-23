import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppsService } from './apps.service';
import { IApps } from '../core/models/apps.interface';

@Component({
    selector: 'app-apps',
    templateUrl: './apps.component.html',
    styleUrls: ['./apps.component.scss'],
    standalone: false
})
export class AppsComponent implements OnInit {
  apps: IApps[] = [];
  loading = true;

  constructor(
    private appsService: AppsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApps();
  }

  private loadApps(): void {
    this.loading = true;

    this.appsService.getApps().subscribe({
      next: (apps) => {
        this.apps = apps;
        this.loading = false;

        // Se retornar apenas um app, redireciona para ele
        if (apps.length === 1) {
          // Define o app como selecionado antes de navegar
          this.appsService.setSelectedApp(apps[0]);
          this.router.navigate([apps[0].url]);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar apps:', error);
        this.loading = false;
      }
    });
  }

  navigateToApp(app: IApps): void {
    // Define o app como selecionado antes de navegar
    this.appsService.setSelectedApp(app);
    this.router.navigate([app.url]);
  }
}
