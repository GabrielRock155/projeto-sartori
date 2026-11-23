import Dexie, { type Table } from 'dexie';
import type { Suit } from '../types';

export class SuitStoreDatabase extends Dexie {
  suits!: Table<Suit, string>;

  constructor() {
    super('SartoriaGabrielDB');
    this.version(1).stores({
      suits: 'id, code, name, category, status, stock, price',
    });
  }
}

export const db = new SuitStoreDatabase();

export const initialSuits: Suit[] = [];

export async function initializeDatabase() {
  await db.suits.clear();
}
