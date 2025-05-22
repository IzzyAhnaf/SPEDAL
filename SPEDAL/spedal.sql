-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2025 at 12:11 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spedal`
--

-- --------------------------------------------------------

--
-- Table structure for table `buku`
--

CREATE TABLE `buku` (
  `uid` varchar(16) NOT NULL,
  `nama` varchar(64) NOT NULL,
  `penulis` varchar(48) NOT NULL,
  `penerbit` varchar(48) NOT NULL,
  `stok` int(255) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku`
--

INSERT INTO `buku` (`uid`, `nama`, `penulis`, `penerbit`, `stok`, `create_at`) VALUES
('323a9977-6ef9-47', 'The Silent Patient', 'Alex Michaelides', 'Celadon Books', 6, '2025-05-22 13:52:54'),
('b4712677-d64e-4c', 'Atomic Habits', 'James Clear', 'Gramedia', 70, '2025-05-11 09:46:23');

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman`
--

CREATE TABLE `peminjaman` (
  `id` int(11) NOT NULL,
  `uid_buku` varchar(16) DEFAULT NULL,
  `nm_plgn` varchar(96) NOT NULL,
  `nik` bigint(16) NOT NULL,
  `email` text NOT NULL,
  `kontak` bigint(18) NOT NULL,
  `status` enum('1','2','3') NOT NULL,
  `tanggal_pnjm` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bataswkt` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `peminjaman`
--

INSERT INTO `peminjaman` (`id`, `uid_buku`, `nm_plgn`, `nik`, `email`, `kontak`, `status`, `tanggal_pnjm`, `bataswkt`) VALUES
(3, 'b4712677-d64e-4c', 'Lamir', 19872831312312, 'L@gmail.com', 19872831312312, '1', '2025-05-11 09:46:53', '2025-05-30'),
(4, 'b4712677-d64e-4c', 'Japra', 9018390183908321, 'mantapsantuy884@gmail.com', 9018390183908321, '2', '2025-05-11 09:46:44', '2025-05-31'),
(5, '323a9977-6ef9-47', 'Mimir', 913286231321, 'bijibapuk94@gmail.com', 182733321213, '2', '2025-05-22 13:54:57', '2025-05-31');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uid` varchar(37) NOT NULL,
  `email` text NOT NULL,
  `uname` varchar(32) NOT NULL,
  `pwd` varchar(16) NOT NULL,
  `notelp` bigint(18) NOT NULL,
  `role` enum('admin','pekerja','user') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uid`, `email`, `uname`, `pwd`, `notelp`, `role`) VALUES
('80817abb-839d-4b8f-a348-bf2b70f9150f', 'm@gmail.com', 'Magud', '123', 9087345612312983, 'pekerja'),
('e7b37c54-35f4-48f8-bd95-c68d9ad15a16', 'w@gmail.com', 'w', '123', 9087345612312123, 'admin'),
('fb5332a7-940b-4586-8013-5486d3b23401', 'K@gmail.com', 'Kasimir', '123', 9876543212345678, 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buku`
--
ALTER TABLE `buku`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid_buku` (`uid_buku`) USING BTREE;

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `peminjaman`
--
ALTER TABLE `peminjaman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD CONSTRAINT `uidbuku` FOREIGN KEY (`uid_buku`) REFERENCES `buku` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
