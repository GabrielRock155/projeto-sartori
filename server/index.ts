import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { pool, initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize MySQL schema & database on startup
initDatabase();

// API Routes
// GET all suits
app.get('/api/suits', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM suits ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar ternos do MySQL:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST create suit (1ª AC: Cadastro de Terno)
app.post('/api/suits', async (req, res) => {
  try {
    const {
      name,
      code,
      category,
      fabric,
      color,
      colorHex,
      size,
      price,
      costPrice,
      stock,
      minStock,
      image,
    } = req.body;

    const id = `s-${Date.now()}`;
    const status = (stock || 0) <= (minStock || 3) ? 'baixo_estoque' : 'disponivel';

    await pool.query(
      `INSERT INTO suits (id, code, name, category, fabric, color, colorHex, size, price, costPrice, stock, minStock, image, status, soldCount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        id,
        code || `ALF-${Math.floor(100 + Math.random() * 900)}`,
        name,
        category || 'Sob Medida',
        fabric || 'Lã Fria Super 130s',
        color || 'Preto',
        colorHex || '#0f172a',
        size || '50R',
        Number(price) || 0,
        Number(costPrice) || 0,
        Number(stock) || 0,
        Number(minStock) || 3,
        image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
        status,
      ]
    );

    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error('Erro ao cadastrar terno no MySQL:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT update suit (2ª AC: Edição de Terno)
app.put('/api/suits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      fabric,
      color,
      colorHex,
      size,
      price,
      costPrice,
      stock,
      minStock,
      image,
    } = req.body;

    const numStock = Number(stock) || 0;
    const numMinStock = Number(minStock) || 0;
    const status = numStock <= numMinStock ? 'baixo_estoque' : 'disponivel';

    await pool.query(
      `UPDATE suits 
       SET name = ?, code = ?, category = ?, fabric = ?, color = ?, colorHex = ?, size = ?, price = ?, costPrice = ?, stock = ?, minStock = ?, image = ?, status = ?
       WHERE id = ?`,
      [
        name,
        code,
        category,
        fabric,
        color,
        colorHex || '#0f172a',
        size,
        Number(price) || 0,
        Number(costPrice) || 0,
        numStock,
        numMinStock,
        image,
        status,
        id,
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar terno no MySQL:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE suit (3ª AC: Exclusão de Terno)
app.delete('/api/suits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM suits WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar terno do MySQL:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST register sale (4ª Funcionalidade: Registrar Venda e Baixa de Estoque)
app.post('/api/suits/:id/sell', async (req, res) => {
  try {
    const { id } = req.params;
    const quantity = Math.max(1, Number(req.body.quantity) || 1);
    const customerName = (req.body.customerName || '').trim() || 'Cliente Balcão';
    const paymentMethod = req.body.paymentMethod || 'PIX';

    const [rows] = await pool.query(
      'SELECT code, name, price, costPrice, stock, minStock, soldCount FROM suits WHERE id = ?',
      [id]
    );
    const list = rows as Array<{
      code: string;
      name: string;
      price: number;
      costPrice: number;
      stock: number;
      minStock: number;
      soldCount: number;
    }>;

    if (!list || list.length === 0) {
      return res.status(404).json({ error: 'Terno não encontrado no banco de dados.' });
    }

    const currentSuit = list[0];
    if (currentSuit.stock < quantity) {
      return res.status(400).json({ error: 'Estoque insuficiente para realizar esta venda.' });
    }

    const newStock = currentSuit.stock - quantity;
    const newSoldCount = (currentSuit.soldCount || 0) + quantity;
    const newStatus =
      newStock === 0
        ? 'esgotado'
        : newStock <= currentSuit.minStock
          ? 'baixo_estoque'
          : 'disponivel';

    const unitPrice = Number(currentSuit.price) || 0;
    const unitCost = Number(currentSuit.costPrice) || 0;
    const totalPrice = unitPrice * quantity;
    const profit = (unitPrice - unitCost) * quantity;
    const saleId = `sale-${Date.now()}`;

    // 1. Atualiza o estoque, soldCount e status na tabela suits
    await pool.query(
      'UPDATE suits SET stock = ?, soldCount = ?, status = ? WHERE id = ?',
      [newStock, newSoldCount, newStatus, id]
    );

    // 2. Grava o registro da venda na tabela sales do MySQL
    await pool.query(
      `INSERT INTO sales (id, suitId, suitCode, suitName, customerName, paymentMethod, quantity, unitPrice, totalPrice, profit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        saleId,
        id,
        currentSuit.code,
        currentSuit.name,
        customerName,
        paymentMethod,
        quantity,
        unitPrice,
        totalPrice,
        profit,
      ]
    );

    res.json({
      success: true,
      saleId,
      stock: newStock,
      soldCount: newSoldCount,
      status: newStatus,
    });
  } catch (error) {
    console.error('Erro ao registrar venda no MySQL:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET sales history
app.get('/api/sales', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sales ORDER BY soldAt DESC');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar histórico de vendas do MySQL:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Serve static frontend files in production
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Start backend
app.listen(PORT, () => {
  console.log(`[MySQL Server] Sartoria backend rodando em http://localhost:${PORT}`);
});
