import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type Periodo = 'monthly' | 'weekly' | 'daily';

export interface DashboardResumoItem {
	titulo: string;
	valor: number | string;
	variacao: string;
	icone: string;
  isPositive: boolean;
}

export interface DashboardResumo {
	totalRevendas: DashboardResumoItem;
	totalEmpresas: DashboardResumoItem;
	faturamento: DashboardResumoItem; // no período selecionado
	usuariosLogados: DashboardResumoItem;
}

export interface SerieMensal {
	labels: string[];
	valores: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RootDashboardService {

  constructor() { }

  getResumo(periodo: String = 'monthly'): Observable<DashboardResumo> {
    const base = periodo === 'monthly' ? 1 : periodo === '' ? 0.25 : 0.08;
    const totalRev = {titulo: 'Total de Revendas', valor: (85/base), variacao: '+1.89%', icone: 'storefront', isPositive: true};
    const totalEmp = {titulo: 'Total de Empresas', valor: (210/base), variacao: '+1.94%', icone: 'business', isPositive: true };
    const usuariosLog = {titulo: 'Usuários Logados', valor: (342/base), variacao: '+12.5%', icone: 'person', isPositive: true };
    const fatur = {titulo: 'Total NF Faturado', valor: `R$ ${Math.round(1.12 * base)}M`, variacao: '+14.2%', icone: 'attach_money', isPositive: false };
    
    return of({
      totalRevendas: totalRev,
			totalEmpresas: totalEmp,
			faturamento: fatur,
			usuariosLogados: usuariosLog
		});
  }

  getSerieRevendasMensal(): Observable<SerieMensal> {
		return of({
			labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
			valores: [80, 95, 120, 150, 140, 160, 170, 210, 190, 220, 230, 260]
		});
	}
}
