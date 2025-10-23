import { Component, inject } from '@angular/core';
// import { NgIf, DecimalPipe } from '@angular/common';
import { RootService, Periodo, DashboardResumo, SerieMensal } from '../../root.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-root-dashboard',
  standalone: true,
  // imports: [NgIf, DecimalPipe, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './root-dashboard.component.html',
  styleUrls: ['./root-dashboard.component.scss']
})
export class RootDashboardComponent {
  private rootService = inject(RootService);

  periodo: Periodo = 'mensal';
  resumo?: DashboardResumo;
  notasFiscais?: number;
  serieRevendas?: SerieMensal;
  serieEmpresas?: SerieMensal;

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

  onPeriodoChange(value: string) {
    this.periodo = (value as Periodo);
    this.carregarDados();
  }

  private carregarDados() {
    this.rootService.getResumo(this.periodo).subscribe(r => this.resumo = r);
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
