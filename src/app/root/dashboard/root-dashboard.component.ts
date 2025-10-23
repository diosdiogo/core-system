import { Component, inject } from '@angular/core';
// import { JsonPipe } from '@angular/common';
import { RootService, SerieMensal } from '../root.service';
import { RootDashboardService, DashboardResumoItem } from './root-dashboard.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ResumoCardComponent } from '../../shared/component/resumo-card/resumo-card.component';
import { ButtonFilterComponent } from "src/app/shared/component/button-filter/button-filter.component";
// import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root-dashboard',
  standalone: true,
  // imports: [NgIf, DecimalPipe, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './root-dashboard.component.html',
  styleUrls: ['./root-dashboard.component.scss'],
  imports: [ResumoCardComponent, ButtonFilterComponent]
})
export class RootDashboardComponent {
  private rootService = inject(RootService);
  private rootDashboardService = inject(RootDashboardService);

  // periodo: Periodo = {value:'monthly', label:'Mensal'};
  periodo: string = 'monthly';
  // resumo?: DashboardResumo;
  resumoArray: DashboardResumoItem[] = [];
  notasFiscais?: number;
  serieRevendas?: SerieMensal;
  serieEmpresas?: SerieMensal;
  
  // Estado de carregamento
  isLoading = true;

  // chart configs
  revendasData?: ChartConfiguration<'line'>['data'];
  empresasData?: ChartConfiguration<'line'>['data'];
  lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: true }
    }
  };

  constructor() {
    this.carregarDados();
  }

  onPeriodoChange(label: string) {
    // Mapear o texto do botão para o valor do período
    const periodoMap: { [key: string]: string } = {
      'Diário': 'daily',
      'Semanal': 'weekly', 
      'Mensal': 'monthly'
    };
    
    this.periodo = periodoMap[label] || 'monthly';
    this.carregarDados();
  }

  private carregarDados() {
    this.isLoading = true;
    
    this.rootDashboardService.getResumo(this.periodo).subscribe(r => {
      // this.resumo = r;
      this.resumoArray = Object.values(r);
      this.isLoading = false;
    });
    this.rootService.getTotalNotasFiscaisFaturadas(this.periodo).subscribe(n => this.notasFiscais = n);
    this.rootService.getSerieRevendasMensal().subscribe(s => {
      this.serieRevendas = s;
      this.revendasData = {
        labels: s.labels,
        datasets: [
          { data: s.valores, label: 'Revendas', fill: false, borderColor: '#3f51b5', tension: 0.2 }
        ]
      };
    });
    this.rootService.getSerieEmpresasMensal().subscribe(s => {
      this.serieEmpresas = s;
      this.empresasData = {
        labels: s.labels,
        datasets: [
          { data: s.valores, label: 'Empresas', fill: false, borderColor: '#009688', tension: 0.2 }
        ]
      };
    });
  }
}
