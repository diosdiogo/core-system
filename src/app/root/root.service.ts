import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type Periodo = 'mensal' | 'semanal' | 'diario';

export interface DashboardResumo {
	totalRevendas: number;
	totalEmpresas: number;
	faturamento: number; // no período selecionado
	usuariosLogados: number;
}

export interface SerieMensal {
	labels: string[];
	valores: number[];
}

@Injectable({
	providedIn: 'root'
})
export class RootService {
	constructor() {}

	getResumo(periodo: Periodo = 'mensal'): Observable<DashboardResumo> {
		// mocks simples e determinísticos
		const base = periodo === 'mensal' ? 1 : periodo === 'semanal' ? 0.25 : 0.08;
		return of({
			totalRevendas: 1280,
			totalEmpresas: 432,
			faturamento: Math.round(950000 * base),
			usuariosLogados: 57
		});
	}

	getSerieRevendasMensal(): Observable<SerieMensal> {
		return of({
			labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
			valores: [80, 95, 120, 150, 140, 160, 170, 210, 190, 220, 230, 260]
		});
	}

	getSerieEmpresasMensal(): Observable<SerieMensal> {
		return of({
			labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
			valores: [20, 24, 28, 32, 30, 34, 36, 45, 40, 48, 50, 58]
		});
	}

	getTotalNotasFiscaisFaturadas(periodo: Periodo = 'mensal'): Observable<number> {
		const base = periodo === 'mensal' ? 1 : periodo === 'semanal' ? 0.25 : 0.08;
		return of(Math.round(620000 * base));
	}
}
