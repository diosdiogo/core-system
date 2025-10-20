export interface IApps {
  id: string;
  appId: string;
  appName: string;
  url: string;
  icon: string;
  companyId: string;
  companyName: string;
  ativo: boolean;
  status: string;
  validade: string | null;
}
