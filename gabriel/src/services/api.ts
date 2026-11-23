import type { Suit } from '../types';
import { initialSuits } from '../db/database';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchSuits(): Promise<Suit[]> {
  try {
    const res = await fetch(`${API_BASE}/suits`);
    if (!res.ok) throw new Error('Falha ao buscar ternos do servidor');
    return await res.json();
  } catch (error) {
    console.warn('[Backend] Servidor offline ou indisponivel. Usando dados locais.', error);
    return initialSuits;
  }
}

export async function createSuit(data: Partial<Suit>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/suits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error('Erro ao cadastrar terno:', error);
    return false;
  }
}

export async function updateSuit(id: string, data: Partial<Suit>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/suits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error('Erro ao atualizar terno:', error);
    return false;
  }
}

export async function deleteSuit(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/suits/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.error('Erro ao deletar terno:', error);
    return false;
  }
}

export async function sellSuit(
  id: string,
  quantity: number,
  customerName?: string,
  paymentMethod?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/suits/${id}/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, customerName, paymentMethod }),
    });
    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        return { ok: false, error: json.error || `Erro HTTP ${res.status}` };
      } catch {
        return { ok: false, error: `Servidor desatualizado (HTTP ${res.status}). Reinicie o terminal do npm run dev.` };
      }
    }
    return { ok: true };
  } catch (error) {
    console.error('Erro ao registrar venda do terno:', error);
    return { ok: false, error: 'Não foi possível conectar ao servidor backend.' };
  }
}
