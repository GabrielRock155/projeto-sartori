export type SuitCategory = 
  | 'Sob Medida'
  | 'Slim Fit Italiano'
  | 'Cerimonial & Noivos'
  | 'Smoking / Black Tie'
  | 'Linho Puro Riviera'
  | 'Clássico Executivo';

export type SuitStatus = 'disponivel' | 'baixo_estoque' | 'esgotado' | 'em_ajuste';

export interface Suit {
  id: string;
  code: string;
  name: string;
  category: SuitCategory;
  fabric: string; // e.g., Lã Fria Super 150s, Linho Irlandês, Seda & Algodão
  color: string;
  colorHex: string;
  size: string; // e.g., 48R, 50L, 52R
  price: number; // Preço de venda
  costPrice: number; // Preço de custo
  stock: number;
  minStock: number;
  image: string;
  status: SuitStatus;
  soldCount: number;
}

export interface UserPermissions {
  canInsert: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
