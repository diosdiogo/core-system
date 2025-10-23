import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DashboardResumoItem } from '../../../root/dashboard/root-dashboard.service';

@Component({
  selector: 'app-resumo-card',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './resumo-card.component.html',
  styleUrls: ['./resumo-card.component.scss']
})
export class ResumoCardComponent {
  @Input() item!: DashboardResumoItem;
}
