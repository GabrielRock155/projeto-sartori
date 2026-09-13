-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 11/09/2026 às 02:15
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sartoria`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `suits`
--

CREATE TABLE `suits` (
  `id` varchar(64) NOT NULL,
  `code` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `fabric` varchar(255) NOT NULL,
  `color` varchar(100) NOT NULL,
  `colorHex` varchar(50) NOT NULL DEFAULT '#0f172a',
  `size` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `costPrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `minStock` int(11) NOT NULL DEFAULT 3,
  `image` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'disponivel',
  `soldCount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `suits`
--

INSERT INTO `suits` (`id`, `code`, `name`, `category`, `fabric`, `color`, `colorHex`, `size`, `price`, `costPrice`, `stock`, `minStock`, `image`, `status`, `soldCount`) VALUES
('s-1788749820096', 'ALF-299', 'teste', 'Slim Fit Italiano', 'testest', 'testtesa', '#0f172a', 'afsd', 1.00, 11.00, 111, 11, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcMhrpUzNGkJME86oh_606Ru2HxL2XCxhbRU7H7KneqQ&s=10', 'disponivel', 0);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `suits`
--
ALTER TABLE `suits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
