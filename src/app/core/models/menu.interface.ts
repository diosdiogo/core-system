import { SubMenuItem } from "./submenu.interface";

export interface MenuItem {
  name: string;
  url?: string;
  icon: string;
  versao: string;
  ativo: boolean;
  status: string;
  ordem: number;
  submenu?: SubMenuItem[];
}


