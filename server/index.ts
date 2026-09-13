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
