import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: false
})
export class MainLayoutComponent implements OnInit {
  showToolbar = false;
  isMenuOpen = false;

  private hideToolbarRoutes = ['/login', '/apps'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showToolbar = !this.hideToolbarRoutes.includes(event.url);
      }
    });
  }

  onMenuToggle(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
