import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'sartoria';

export const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
});

export async function initDatabase() {
  try {
    // 1. Ensure database exists
    const rootConn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConn.end();

    // 2. Ensure table suits exists in sartoria
    await pool.query(`
      CREATE TABLE IF NOT EXISTS suits (
        id VARCHAR(64) PRIMARY KEY,
        code VARCHAR(64) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        fabric VARCHAR(255) NOT NULL,
        color VARCHAR(100) NOT NULL,
        colorHex VARCHAR(50) NOT NULL DEFAULT '#0f172a',
        size VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        costPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
        stock INT NOT NULL DEFAULT 0,
        minStock INT NOT NULL DEFAULT 3,
        image TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'disponivel',
        soldCount INT NOT NULL DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Ensure table sales exists in sartoria (4ª Funcionalidade: Histórico de Vendas)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(64) PRIMARY KEY,
        suitId VARCHAR(64) NOT NULL,
        suitCode VARCHAR(64) NOT NULL,
        suitName VARCHAR(255) NOT NULL,
        customerName VARCHAR(255) NOT NULL DEFAULT 'Cliente Balcão',
        paymentMethod VARCHAR(100) NOT NULL DEFAULT 'PIX',
        quantity INT NOT NULL DEFAULT 1,
        unitPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
        totalPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
        profit DECIMAL(10, 2) NOT NULL DEFAULT 0,
        soldAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log(`[MySQL] Conexão com o banco '${DB_NAME}' no XAMPP estabelecida com sucesso!`);
  } catch (error) {
    console.error('[MySQL Error] Falha ao inicializar o banco de dados MySQL:', error);
  }
}
