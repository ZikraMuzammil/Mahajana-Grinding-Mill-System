-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2026 at 06:46 AM
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
-- Database: `mahajana_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(80) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`) VALUES
(1, 'admin', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_name`, `phone`, `address`, `email`, `password`, `created_at`) VALUES
(1, 'Zikra Muzzammil', '0771434991', 'colombo', 'zikra@gmail.com', 'test1234', '2026-07-05 07:10:25'),
(2, 'ayyoub', '0771234567', 'colombo', 'ayyoub@gmail.com', 'ayb12345', '2026-07-05 07:23:02'),
(3, 'zumla', '0774545655', 'nawalapitiya', 'zumgmail.com', 'zum7676', '2026-07-05 08:27:52'),
(4, 'zumla', '0774545655', 'nawal', 'zum@gmail.com', 'zum1212', '2026-07-05 08:29:22'),
(5, 'Zikra Muzzammil', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-1', '2026-07-06 09:07:22'),
(6, 'Zikra Muzzammil', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-2', '2026-07-06 09:07:22'),
(7, 'ayyoub', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-3', '2026-07-06 09:07:22'),
(8, 'umar', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-4', '2026-07-06 09:07:22'),
(9, 'ayyoub', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-5', '2026-07-06 09:07:22'),
(10, 'Zikra Muzzammil', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-6', '2026-07-06 09:07:22'),
(11, 'ayyoub', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-7', '2026-07-06 09:07:22'),
(12, 'Zikra Muzzammil', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-8', '2026-07-06 09:07:22'),
(13, 'Zikra Muzzammil', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-9', '2026-07-06 09:07:22'),
(14, 'Zikra Muzzammil', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-10', '2026-07-06 09:07:22'),
(15, 'Zikra Muzzammil', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-11', '2026-07-06 09:07:22'),
(16, 'Zikra Muzzammil', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-12', '2026-07-06 09:07:22'),
(17, 'umar', '0771434991', 'B,47/1 Mosque Road Hapugasthalawa', 'mrrimziya2@gmail.com', 'guest-18', '2026-07-06 09:07:22'),
(18, 'zuha', '07745454755', 'mawanalla', 'zuha@gmail.com', '2001', '2026-07-07 09:47:37'),
(19, 'zumra', '07745454750', 'mawanalla', 'zumyyy@gmail.com', 'zum1234', '2026-07-08 11:28:36'),
(20, 'zumra', '07745454750', 'kandy', 'zumra@gmail.com', 'shamra123', '2026-07-08 11:30:17'),
(21, 'amriya', '0772121344', '23/1 galle,road colombo', 'amris@gmail.com', 'guest-1783541854409', '2026-07-08 20:17:34'),
(22, 'shamra', '0776767899', '67/1 gampola road keerapana', 'sham@gmail.om', 'guest-1783583605540', '2026-07-09 07:53:25'),
(23, 'umama', '0773434389', 'colombo', 'umama@gmail.com', 'umam2121', '2026-07-09 15:49:20'),
(24, 'umama', '077898978', 'colombo', 'umam@gmail.com', 'umam2121', '2026-07-09 15:50:27'),
(25, 'aathika', '076554991', 'kandy', 'aathika@gmail.com', 'aathi00', '2026-07-09 16:31:58');

-- --------------------------------------------------------

--
-- Table structure for table `grinding_orders`
--

CREATE TABLE `grinding_orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `spice_name` varchar(255) DEFAULT NULL,
  `quantity` varchar(100) DEFAULT NULL,
  `grinding_type` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(120) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal` varchar(20) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `delivery_method` varchar(20) DEFAULT 'home',
  `payment_method` varchar(20) DEFAULT 'cod',
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL,
  `payment_status` varchar(20) NOT NULL DEFAULT 'unpaid',
  `coupon` varchar(50) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `customer_name`, `phone`, `email`, `address`, `city`, `postal`, `notes`, `delivery_method`, `payment_method`, `stripe_payment_intent_id`, `payment_status`, `coupon`, `total`, `status`, `created_at`) VALUES
(1, NULL, 'Zikra Muzzammil', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '45', 490.00, 'Cancelled', '2026-07-02 21:19:29'),
(2, NULL, 'Zikra Muzzammil', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '45', 680.00, 'Shipped', '2026-07-03 01:42:07'),
(3, NULL, 'ayyoub', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'pickup', 'cod', NULL, 'unpaid', '45', 650.00, 'Pending', '2026-07-03 01:43:52'),
(4, NULL, 'umar', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '45', 610.00, 'Delivered', '2026-07-03 01:53:58'),
(5, NULL, 'ayyoub', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'pickup', 'cod', NULL, 'unpaid', '', 635.00, 'Pending', '2026-07-03 03:09:14'),
(6, NULL, 'Zikra Muzzammil', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '45', 500.00, 'Delivered', '2026-07-03 03:10:14'),
(7, NULL, 'ayyoub', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 275.00, 'Shipped', '2026-07-03 03:10:35'),
(8, NULL, 'Zikra Muzzammil', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '45', 635.00, 'Delivered', '2026-07-03 08:22:41'),
(9, NULL, 'Zikra Muzzammil', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '45', 635.00, 'Pending', '2026-07-03 08:26:56'),
(10, NULL, 'Zikra Muzzammil', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '45', 320.00, 'Pending', '2026-07-03 08:37:39'),
(11, NULL, 'Zikra Muzzammil', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '45', 415.00, 'Pending', '2026-07-03 08:37:59'),
(12, NULL, 'Zikra Muzzammil', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '45', 415.00, 'Pending', '2026-07-03 08:38:14'),
(13, 4, 'zumla', '0774545655', 'zum@gmail.com', 'colombo/mosque road', 'Nawalapitiya', 'E27', '', 'pickup', 'bank', NULL, 'unpaid', '', 1260.00, 'Shipped', '2026-07-05 08:30:53'),
(14, 4, 'zumla', '0774545655', 'zum@gmail.com', 'colombo/mosque road', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 216.00, 'Shipped', '2026-07-05 09:11:37'),
(15, 4, 'zumla', '0774545655', 'zum@gmail.com', 'colombo/mosque road', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 510.00, 'Pending', '2026-07-05 15:20:47'),
(16, 4, 'zumla', '0774545655', 'zum@gmail.com', 'colombo/mosque road', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 705.00, 'Delivered', '2026-07-05 18:49:14'),
(17, 4, 'umama', '0774545655', 'zum@gmail.com', 'colombo/mosque road', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 920.00, 'Pending', '2026-07-06 08:41:38'),
(18, NULL, 'umar', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 340.00, 'Pending', '2026-07-06 08:55:49'),
(19, NULL, 'Zikra Muzzammil', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 430.00, 'Shipped', '2026-07-06 09:11:55'),
(20, 5, 'shahna', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 650.00, 'Pending', '2026-07-07 08:47:13'),
(21, 5, 'shahna', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 1164.00, 'Cancelled', '2026-07-07 09:32:11'),
(22, 18, 'zuha', '0774545775', 'zuha@gmail.com', 'colombo/mosque road', 'Nawalapitiya', '', '', 'pickup', 'card', NULL, 'unpaid', '', 280.00, 'Pending', '2026-07-07 09:51:29'),
(23, 18, 'zikraaaaa', '0774545775', 'zuha@gmail.com', 'colombo/mosque road', 'Nawalapitiya', '', '', 'home', 'cod', NULL, 'unpaid', '', 630.00, 'Pending', '2026-07-07 10:04:12'),
(24, 18, 'maryam', '0774545775', 'zuha@gmail.com', 'colombo/mosque road', 'Nawalapitiya', '', '', 'home', 'cod', NULL, 'unpaid', '', 1568.00, 'Shipped', '2026-07-07 11:54:29'),
(25, 18, 'shahama', '0774545775', 'zuha@gmail.com', 'colombo/mosque road', 'Nawalapitiya', '', '', 'pickup', 'bank', NULL, 'unpaid', '', 540.00, 'Shipped', '2026-07-07 19:46:39'),
(26, 4, 'shamra', '07734348787', 'zum@gmail.com', 'colombo/mosque road', 'Nawalapitiya', 'E27', '', 'pickup', 'cod', NULL, 'unpaid', '', 2165.00, 'Delivered', '2026-07-08 20:07:52'),
(27, 4, 'amriya', '07734348787', 'zum@gmail.com', 'colombo/mosque road', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 300.00, 'Pending', '2026-07-08 20:12:22'),
(28, 21, 'amriya', '0772121344', 'amris@gmail.com', '23/1 galle,road colombo', 'galle', '45', '', 'pickup', 'card', NULL, 'unpaid', '', 340.00, 'Shipped', '2026-07-08 20:17:34'),
(29, 21, 'amriya', '0772121344', 'amris@gmail.com', '23/1 galle,road colombo', 'galle', '45', '', 'home', 'cod', NULL, 'unpaid', '', 310.00, 'Delivered', '2026-07-08 20:24:02'),
(30, 22, 'shamra', '0776767899', 'sham@gmail.om', '67/1 gampola road keerapana', 'gampola', '46', '', 'pickup', 'bank', NULL, 'unpaid', '', 570.00, 'Delivered', '2026-07-09 07:53:25'),
(31, 18, 'madheeha', '0774545775', 'zuha@gmail.com', 'colombo/mosque road', 'Nawalapitiya', '', '', 'pickup', 'card', NULL, 'unpaid', '', 290.00, 'Shipped', '2026-07-09 08:07:27'),
(32, 18, 'madheeha', '0774545775', 'zuha@gmail.com', 'colombo/mosque road', 'Nawalapitiya', '', '', 'home', 'cod', NULL, 'unpaid', '', 3930.00, 'Pending', '2026-07-09 08:09:56'),
(33, 18, 'ameeza', '0774545775', 'zuha@gmail.com', 'colombo/mosque road', 'Nawalapitiya', '', '', 'home', 'cod', NULL, 'unpaid', '', 300.00, 'Pending', '2026-07-09 13:51:40'),
(34, 5, 'umar', '0771434991', 'mrrimziya2@gmail.com', 'B,47/1 Mosque Road Hapugasthalawa', 'Nawalapitiya', 'E27', '', 'pickup', 'card', NULL, 'unpaid', '', 320.00, 'Pending', '2026-07-09 15:46:43'),
(35, 24, 'umama', '0774545655', 'umam@gmail.com', 'colombo/mosque road', 'Nawalapitiya', 'E27', '', 'home', 'cod', NULL, 'unpaid', '', 520.00, 'Pending', '2026-07-09 15:53:35'),
(36, 25, 'aathika', '077554991', 'aathika@gmail.com', 'C/57 mosques road kaludhamada', 'Nawalapitiya', '67', '', 'pickup', 'bank', NULL, 'unpaid', '', 460.00, 'Pending', '2026-07-09 16:33:40'),
(37, 25, 'aathika', '0774545655', 'aathika@gmail.com', 'C/57 mosques road kaludhamada', 'Nawalapitiya', '67', '', 'home', 'card', NULL, 'paid', '', 460.00, 'Pending', '2026-07-10 04:30:37');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `weight` varchar(20) DEFAULT NULL,
  `qty` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `line_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_name`, `image`, `category`, `weight`, `qty`, `unit_price`, `line_total`) VALUES
(1, 1, 'Gotukola Powder', NULL, 'Herbal', '500g', 1, 150.00, 150.00),
(2, 1, 'Moringa Powder', NULL, 'Herbal', '500g', 1, 160.00, 160.00),
(3, 1, 'Iramusu Powder', NULL, 'Herbal', '500g', 1, 180.00, 180.00),
(4, 2, 'Roasted Chili Powder', NULL, 'General', '500g', 2, 140.00, 280.00),
(5, 2, 'Chili Powder', NULL, 'General', '500g', 2, 125.00, 250.00),
(6, 3, 'Chili Powder', NULL, 'General', '1kg', 2, 250.00, 500.00),
(7, 4, 'Millet Flour', NULL, 'General', '500g', 1, 170.00, 170.00),
(8, 4, 'Hopper Flour', NULL, 'General', '500g', 1, 140.00, 140.00),
(9, 4, 'Green Gram Flour', NULL, 'General', '500g', 1, 150.00, 150.00),
(10, 5, 'Dosa Mix', NULL, 'General', '500g', 1, 160.00, 160.00),
(11, 5, 'Pongal Mix', NULL, 'General', '500g', 1, 170.00, 170.00),
(12, 5, 'Puttu Flour Mix', NULL, 'General', '500g', 1, 155.00, 155.00),
(13, 6, 'Venivel Powder', NULL, 'General', '500g', 1, 170.00, 170.00),
(14, 6, 'Iramusu Powder', NULL, 'General', '500g', 1, 180.00, 180.00),
(15, 7, 'Chili Powder', NULL, 'General', '500g', 1, 125.00, 125.00),
(16, 8, 'Jaffna Curry Powder', NULL, 'General', '500g', 1, 175.00, 175.00),
(17, 8, 'Roasted Curry Powder', NULL, 'General', '500g', 1, 160.00, 160.00),
(18, 8, 'Curry Powder', NULL, 'General', '500g', 1, 150.00, 150.00),
(19, 9, 'Jaffna Curry Powder', NULL, 'General', '500g', 1, 175.00, 175.00),
(20, 9, 'Roasted Curry Powder', NULL, 'General', '500g', 1, 160.00, 160.00),
(21, 9, 'Curry Powder', NULL, 'General', '500g', 1, 150.00, 150.00),
(22, 10, 'Venivel Powder', NULL, 'General', '500g', 1, 170.00, 170.00),
(23, 11, 'Roasted Chili Powder', NULL, 'General', '500g', 1, 140.00, 140.00),
(24, 11, 'Chili Powder', NULL, 'General', '500g', 1, 125.00, 125.00),
(25, 12, 'Roasted Chili Powder', NULL, 'General', '500g', 1, 140.00, 140.00),
(26, 12, 'Chili Powder', NULL, 'General', '500g', 1, 125.00, 125.00),
(27, 13, 'Gotukola Powder', NULL, 'General', '500g', 1, 150.00, 150.00),
(28, 13, 'Moringa Powder', NULL, 'General', '500g', 6, 160.00, 960.00),
(29, 14, 'Cassava Flour (Fine)', NULL, 'General', '200g', 1, 66.00, 66.00),
(30, 15, 'Iramusu Powder', NULL, 'General', '1kg', 1, 360.00, 360.00),
(31, 16, 'Iramusu Powder', NULL, 'General', '500g', 1, 180.00, 180.00),
(32, 16, 'Gotukola Powder', NULL, 'General', '500g', 1, 150.00, 150.00),
(33, 16, 'Gotukola Powder', NULL, 'General', '750g', 1, 225.00, 225.00),
(34, 17, 'Cardamom Chai Masala', NULL, 'General', '500g', 3, 200.00, 600.00),
(35, 17, 'Classic Chai Masala', NULL, 'General', '500g', 1, 170.00, 170.00),
(36, 18, 'Coconut Flour', NULL, 'General', '500g', 1, 190.00, 190.00),
(37, 19, 'Finger Millet (Kurakkan)', NULL, 'General', '500g', 1, 160.00, 160.00),
(38, 19, 'Cowpea (Me Karal)', NULL, 'General', '500g', 1, 120.00, 120.00),
(39, 20, 'Coconut Flour', NULL, 'General', '500g', 1, 190.00, 190.00),
(40, 20, 'Black Gram Flour', NULL, 'General', '500g', 1, 160.00, 160.00),
(41, 20, 'Atta (Wheat) Flour', NULL, 'General', '500g', 1, 150.00, 150.00),
(42, 21, 'Black Gram Flour', NULL, 'General', '200g', 1, 64.00, 64.00),
(43, 21, 'Corn Flour', NULL, 'General', '500g', 1, 130.00, 130.00),
(44, 21, 'Coconut Flour', NULL, 'General', '1kg', 1, 380.00, 380.00),
(45, 21, 'Green Gram Flour', NULL, 'General', '500g', 1, 150.00, 150.00),
(46, 21, 'Gram Flour (Besan)', NULL, 'General', '500g', 2, 145.00, 290.00),
(47, 22, 'Corn Flour', NULL, 'General', '500g', 1, 130.00, 130.00),
(48, 23, 'Moringa Powder', NULL, 'General', '500g', 3, 160.00, 480.00),
(49, 24, 'Coconut Flour', NULL, 'General', '100g', 31, 38.00, 1178.00),
(50, 24, 'Black Gram Flour', NULL, 'General', '750g', 1, 240.00, 240.00),
(51, 25, 'Corn Flour', NULL, 'Flour', '750g', 2, 195.00, 390.00),
(52, 26, 'Corn Flour', NULL, 'Flour', '500g', 2, 130.00, 260.00),
(53, 26, 'Corn Flour', NULL, 'Flour', '750g', 9, 195.00, 1755.00),
(54, 27, 'Gotukola Powder', NULL, 'Herbal', '500g', 1, 150.00, 150.00),
(55, 28, 'Signature Chai Blend', NULL, 'ChaiMasala', '500g', 1, 190.00, 190.00),
(56, 29, 'Black Gram Flour', NULL, 'Flour', '500g', 1, 160.00, 160.00),
(57, 30, 'Corn Flour', NULL, 'Flour', '500g', 2, 130.00, 260.00),
(58, 30, 'Black Gram Flour', NULL, 'Flour', '500g', 1, 160.00, 160.00),
(59, 31, 'Ranawara Powder', NULL, 'Herbal', '500g', 1, 140.00, 140.00),
(60, 32, 'Iramusu Powder', NULL, 'Herbal', '500g', 21, 180.00, 3780.00),
(61, 33, 'Gotukola Powder', NULL, 'Herbal', '500g', 1, 150.00, 150.00),
(62, 34, 'Venivel Powder', NULL, 'Herbal', '500g', 1, 170.00, 170.00),
(63, 35, 'Black Gram Flour', NULL, 'Flour', '750g', 1, 240.00, 240.00),
(64, 35, 'Corn Flour', NULL, 'Flour', '500g', 1, 130.00, 130.00),
(65, 36, 'Atta (Wheat) Flour', NULL, 'Flour', '500g', 1, 150.00, 150.00),
(66, 36, 'Black Gram Flour', NULL, 'Flour', '500g', 1, 160.00, 160.00),
(67, 37, 'Black Gram Flour', NULL, 'Flour', '500g', 1, 160.00, 160.00),
(68, 37, 'Atta (Wheat) Flour', NULL, 'Flour', '500g', 1, 150.00, 150.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category` varchar(50) NOT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `stock_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`stock_json`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `subcategory`, `base_price`, `stock_json`, `created_at`) VALUES
(21, 'Moringa Powder', 'Herbal', 'Herbal Powders', 320.00, '{\"100g\":80,\"200g\":4,\"500g\":20,\"750g\":18,\"1kg\":0}', '2026-07-05 12:05:18'),
(22, 'Gotukola Powder', 'Herbal', 'Herbal Powders', 300.00, '{\"100g\":54,\"200g\":0,\"500g\":41,\"750g\":13,\"1kg\":7}', '2026-07-05 12:05:18'),
(23, 'Iramusu Powder', 'Herbal', 'Herbal Drinks', 360.00, '{\"100g\":77,\"200g\":57,\"500g\":0,\"750g\":10,\"1kg\":7}', '2026-07-05 12:05:18'),
(24, 'Venivel Powder', 'Herbal', 'Herbal Powders', 340.00, '{\"100g\":53,\"200g\":44,\"500g\":35,\"750g\":29,\"1kg\":5}', '2026-07-05 12:05:18'),
(25, 'Ranawara Powder', 'Herbal', 'Herbal Drinks', 280.00, '{\"100g\":75,\"200g\":42,\"500g\":41,\"750g\":30,\"1kg\":0}', '2026-07-05 12:05:18'),
(26, 'Belimal Powder', 'Herbal', 'Herbal Drinks', 300.00, '{\"100g\": 54, \"200g\": 58, \"500g\": 38, \"750g\": 18, \"1kg\": 5}', '2026-07-05 12:05:18'),
(27, 'Nettle Leaf Powder', 'Herbal', 'Herbal Powders', 390.00, '{\"100g\": 88, \"200g\": 40, \"500g\": 42, \"750g\": 23, \"1kg\": 15}', '2026-07-05 12:05:18'),
(28, 'Hathawariya Powder', 'Herbal', 'Ayurvedic Herbs', 420.00, '{\"100g\": 57, \"200g\": 39, \"500g\": 26, \"750g\": 20, \"1kg\": 8}', '2026-07-05 12:05:18'),
(29, 'Curry Leaves Powder', 'Herbal', 'Herbal Powders', 250.00, '{\"100g\": 45, \"200g\": 54, \"500g\": 23, \"750g\": 21, \"1kg\": 16}', '2026-07-05 12:05:18'),
(30, 'Organic Herbal Mix', 'Herbal', 'Herbal Mixes', 480.00, '{\"100g\": 78, \"200g\": 46, \"500g\": 45, \"750g\": 11, \"1kg\": 19}', '2026-07-05 12:05:18'),
(31, 'Aloe Vera Powder', 'Herbal', 'Herbal Powders', 470.00, '{\"100g\": 74, \"200g\": 37, \"500g\": 49, \"750g\": 22, \"1kg\": 7}', '2026-07-05 12:05:18'),
(32, 'Ginger Powder', 'Herbal', 'Herbal Powders', 290.00, '{\"100g\":75,\"200g\":48,\"500g\":0,\"750g\":30,\"1kg\":16}', '2026-07-05 12:05:18'),
(33, 'Immunity Mix', 'Herbal', 'Herbal Mixes', 550.00, '{\"100g\": 76, \"200g\": 42, \"500g\": 42, \"750g\": 12, \"1kg\": 6}', '2026-07-05 12:05:18'),
(34, 'Oxy Herbal', 'Herbal', 'Herbal Mixes', 420.00, '{\"100g\": 82, \"200g\": 44, \"500g\": 44, \"750g\": 19, \"1kg\": 7}', '2026-07-05 12:05:18'),
(35, 'Majufal Powder', 'Herbal', 'Ayurvedic Herbs', 500.00, '{\"100g\": 54, \"200g\": 36, \"500g\": 32, \"750g\": 18, \"1kg\": 19}', '2026-07-05 12:05:18'),
(36, 'Chili Powder', 'Spice', 'Spice Powders', 250.00, '{\"100g\": 80, \"200g\": 53, \"500g\": 25, \"750g\": 21, \"1kg\": 16}', '2026-07-05 12:05:18'),
(37, 'Roasted Chili Powder', 'Spice', 'Spice Powders', 280.00, '{\"100g\": 53, \"200g\": 47, \"500g\": 42, \"750g\": 30, \"1kg\": 7}', '2026-07-05 12:05:18'),
(38, 'Curry Powder', 'Spice', 'Curry Blends', 300.00, '{\"100g\": 78, \"200g\": 70, \"500g\": 25, \"750g\": 27, \"1kg\": 12}', '2026-07-05 12:05:18'),
(39, 'Roasted Curry Powder', 'Spice', 'Curry Blends', 320.00, '{\"100g\": 50, \"200g\": 59, \"500g\": 32, \"750g\": 18, \"1kg\": 12}', '2026-07-05 12:05:18'),
(40, 'Jaffna Curry Powder', 'Spice', 'Curry Blends', 350.00, '{\"100g\": 83, \"200g\": 50, \"500g\": 46, \"750g\": 11, \"1kg\": 12}', '2026-07-05 12:05:18'),
(41, 'Fish Curry Powder', 'Spice', 'Curry Blends', 280.00, '{\"100g\": 42, \"200g\": 50, \"500g\": 32, \"750g\": 18, \"1kg\": 7}', '2026-07-05 12:05:18'),
(42, 'Meat Curry Powder', 'Spice', 'Curry Blends', 300.00, '{\"100g\": 53, \"200g\": 66, \"500g\": 48, \"750g\": 20, \"1kg\": 11}', '2026-07-05 12:05:18'),
(43, 'Turmeric Powder', 'Spice', 'Spice Powders', 200.00, '{\"100g\": 81, \"200g\": 61, \"500g\": 32, \"750g\": 30, \"1kg\": 19}', '2026-07-05 12:05:18'),
(44, 'Black Pepper Powder', 'Spice', 'Spice Powders', 400.00, '{\"100g\": 49, \"200g\": 46, \"500g\": 24, \"750g\": 17, \"1kg\": 13}', '2026-07-05 12:05:18'),
(45, 'White Pepper Powder', 'Spice', 'Spice Powders', 420.00, '{\"100g\": 87, \"200g\": 67, \"500g\": 33, \"750g\": 28, \"1kg\": 17}', '2026-07-05 12:05:18'),
(46, 'Coriander Powder', 'Spice', 'Spice Powders', 220.00, '{\"100g\": 63, \"200g\": 44, \"500g\": 24, \"750g\": 26, \"1kg\": 20}', '2026-07-05 12:05:18'),
(47, 'Cumin Powder', 'Spice', 'Spice Powders', 250.00, '{\"100g\": 45, \"200g\": 33, \"500g\": 47, \"750g\": 13, \"1kg\": 9}', '2026-07-05 12:05:18'),
(48, 'Fennel Powder', 'Spice', 'Spice Powders', 230.00, '{\"100g\": 80, \"200g\": 40, \"500g\": 45, \"750g\": 23, \"1kg\": 7}', '2026-07-05 12:05:18'),
(49, 'Fenugreek Powder', 'Spice', 'Spice Powders', 240.00, '{\"100g\": 64, \"200g\": 54, \"500g\": 39, \"750g\": 24, \"1kg\": 13}', '2026-07-05 12:05:18'),
(50, 'Mustard Powder', 'Spice', 'Spice Powders', 260.00, '{\"100g\": 75, \"200g\": 30, \"500g\": 41, \"750g\": 13, \"1kg\": 13}', '2026-07-05 12:05:18'),
(51, 'Cardamom Powder', 'Spice', 'Spice Powders', 500.00, '{\"100g\": 89, \"200g\": 51, \"500g\": 23, \"750g\": 19, \"1kg\": 18}', '2026-07-05 12:05:18'),
(52, 'Clove Powder', 'Spice', 'Spice Powders', 450.00, '{\"100g\": 50, \"200g\": 59, \"500g\": 20, \"750g\": 18, \"1kg\": 10}', '2026-07-05 12:05:18'),
(53, 'Cinnamon Powder', 'Spice', 'Spice Powders', 380.00, '{\"100g\": 72, \"200g\": 36, \"500g\": 47, \"750g\": 30, \"1kg\": 14}', '2026-07-05 12:05:18'),
(54, 'Nutmeg Powder', 'Spice', 'Spice Powders', 600.00, '{\"100g\": 80, \"200g\": 62, \"500g\": 39, \"750g\": 16, \"1kg\": 9}', '2026-07-05 12:05:18'),
(55, 'Ginger Powder', 'Spice', 'Spice Powders', 300.00, '{\"100g\": 63, \"200g\": 40, \"500g\": 37, \"750g\": 26, \"1kg\": 5}', '2026-07-05 12:05:18'),
(56, 'Garlic Powder', 'Spice', 'Spice Powders', 280.00, '{\"100g\": 78, \"200g\": 50, \"500g\": 35, \"750g\": 10, \"1kg\": 8}', '2026-07-05 12:05:18'),
(57, 'Tamarind Powder', 'Spice', 'Others', 260.00, '{\"100g\": 63, \"200g\": 49, \"500g\": 27, \"750g\": 11, \"1kg\": 12}', '2026-07-05 12:05:18'),
(58, 'Goraka Powder', 'Spice', 'Others', 270.00, '{\"100g\": 76, \"200g\": 35, \"500g\": 22, \"750g\": 25, \"1kg\": 7}', '2026-07-05 12:05:18'),
(59, 'Mixed Spice Powder', 'Spice', 'Blends', 350.00, '{\"100g\": 88, \"200g\": 64, \"500g\": 44, \"750g\": 14, \"1kg\": 9}', '2026-07-05 12:05:18'),
(60, 'Biryani Spice Mix', 'Spice', 'Blends', 450.00, '{\"100g\": 82, \"200g\": 60, \"500g\": 50, \"750g\": 27, \"1kg\": 10}', '2026-07-05 12:05:18'),
(61, 'Atta (Wheat) Flour', 'Flour', 'Grain Flours', 300.00, '{\"100g\":56,\"200g\":63,\"500g\":45,\"750g\":29,\"1kg\":0}', '2026-07-05 12:05:18'),
(62, 'Black Gram Flour', 'Flour', 'Grain Flours', 320.00, '{\"100g\":53,\"200g\":64,\"500g\":40,\"750g\":15,\"1kg\":14}', '2026-07-05 12:05:18'),
(63, 'Coconut Flour', 'Flour', 'Grain Flours', 380.00, '{\"100g\":65,\"200g\":53,\"500g\":0,\"750g\":26,\"1kg\":19}', '2026-07-05 12:05:18'),
(64, 'Corn Flour', 'Flour', 'Grain Flours', 260.00, '{\"100g\":47,\"200g\":45,\"500g\":22,\"750g\":1,\"1kg\":15}', '2026-07-05 12:05:18'),
(65, 'Gram Flour (Besan)', 'Flour', 'Grain Flours', 290.00, '{\"100g\": 41, \"200g\": 67, \"500g\": 37, \"750g\": 17, \"1kg\": 12}', '2026-07-05 12:05:18'),
(66, 'Green Gram Flour', 'Flour', 'Grain Flours', 300.00, '{\"100g\": 40, \"200g\": 34, \"500g\": 42, \"750g\": 30, \"1kg\": 6}', '2026-07-05 12:05:18'),
(67, 'Hopper Flour', 'Flour', 'Ready Mix Flours', 280.00, '{\"100g\": 54, \"200g\": 34, \"500g\": 48, \"750g\": 11, \"1kg\": 15}', '2026-07-05 12:05:18'),
(68, 'Millet Flour', 'Flour', 'Grain Flours', 340.00, '{\"100g\": 44, \"200g\": 62, \"500g\": 27, \"750g\": 18, \"1kg\": 20}', '2026-07-05 12:05:18'),
(69, 'Mixed Grain Flour', 'Flour', 'Grain Flours', 360.00, '{\"100g\": 53, \"200g\": 64, \"500g\": 24, \"750g\": 28, \"1kg\": 20}', '2026-07-05 12:05:18'),
(70, 'Pittu Flour', 'Flour', 'Ready Mix Flours', 270.00, '{\"100g\": 55, \"200g\": 60, \"500g\": 45, \"750g\": 23, \"1kg\": 11}', '2026-07-05 12:05:18'),
(71, 'Rice Flour', 'Flour', 'Rice Flours', 250.00, '{\"100g\": 46, \"200g\": 36, \"500g\": 41, \"750g\": 23, \"1kg\": 16}', '2026-07-05 12:05:18'),
(72, 'Roasted Rice Flour', 'Flour', 'Rice Flours', 270.00, '{\"100g\": 67, \"200g\": 56, \"500g\": 34, \"750g\": 11, \"1kg\": 8}', '2026-07-05 12:05:18'),
(73, 'Soya Flour', 'Flour', 'Grain Flours', 310.00, '{\"100g\": 43, \"200g\": 55, \"500g\": 43, \"750g\": 20, \"1kg\": 8}', '2026-07-05 12:05:18'),
(74, 'String Hopper Flour', 'Flour', 'Ready Mix Flours', 280.00, '{\"100g\": 55, \"200g\": 42, \"500g\": 26, \"750g\": 27, \"1kg\": 19}', '2026-07-05 12:05:18'),
(75, 'Wheat Flour', 'Flour', 'Grain Flours', 290.00, '{\"100g\": 48, \"200g\": 57, \"500g\": 25, \"750g\": 18, \"1kg\": 19}', '2026-07-05 12:05:18'),
(76, 'White Rice Flour', 'Flour', 'Rice Flours', 260.00, '{\"100g\": 55, \"200g\": 34, \"500g\": 34, \"750g\": 27, \"1kg\": 8}', '2026-07-05 12:05:18'),
(77, 'Black Gram (Undu)', 'Grains', 'Pulses', 280.00, '{\"100g\": 43, \"200g\": 64, \"500g\": 46, \"750g\": 10, \"1kg\": 7}', '2026-07-05 12:05:18'),
(78, 'Chickpeas (Kadala)', 'Grains', 'Pulses', 260.00, '{\"100g\": 88, \"200g\": 45, \"500g\": 25, \"750g\": 23, \"1kg\": 20}', '2026-07-05 12:05:18'),
(79, 'Cowpea (Me Karal)', 'Grains', 'Pulses', 240.00, '{\"100g\": 70, \"200g\": 43, \"500g\": 47, \"750g\": 22, \"1kg\": 6}', '2026-07-05 12:05:18'),
(80, 'Finger Millet (Kurakkan)', 'Grains', 'Millets', 320.00, '{\"100g\": 50, \"200g\": 54, \"500g\": 20, \"750g\": 22, \"1kg\": 13}', '2026-07-05 12:05:18'),
(81, 'Foxtail Millet', 'Grains', 'Millets', 350.00, '{\"100g\": 90, \"200g\": 59, \"500g\": 29, \"750g\": 23, \"1kg\": 20}', '2026-07-05 12:05:18'),
(82, 'Keeri Samba Rice', 'Grains', 'Rice', 300.00, '{\"100g\": 49, \"200g\": 42, \"500g\": 29, \"750g\": 16, \"1kg\": 6}', '2026-07-05 12:05:18'),
(83, 'Kuruluthuda Rice', 'Grains', 'Rice', 310.00, '{\"100g\": 77, \"200g\": 64, \"500g\": 21, \"750g\": 20, \"1kg\": 6}', '2026-07-05 12:05:18'),
(84, 'Maize (Corn)', 'Grains', 'Millets', 220.00, '{\"100g\": 43, \"200g\": 67, \"500g\": 35, \"750g\": 26, \"1kg\": 10}', '2026-07-05 12:05:18'),
(85, 'Green Gram (Mung Beans)', 'Grains', 'Pulses', 270.00, '{\"100g\": 43, \"200g\": 62, \"500g\": 22, \"750g\": 15, \"1kg\": 7}', '2026-07-05 12:05:18'),
(86, 'Basmati Rice', 'Grains', 'Rice', 420.00, '{\"100g\": 78, \"200g\": 34, \"500g\": 41, \"750g\": 17, \"1kg\": 17}', '2026-07-05 12:05:18'),
(87, 'Rice Flakes (Poha)', 'Grains', 'Rice', 230.00, '{\"100g\": 47, \"200g\": 66, \"500g\": 27, \"750g\": 28, \"1kg\": 6}', '2026-07-05 12:05:18'),
(88, 'Red Rice', 'Grains', 'Rice', 280.00, '{\"100g\": 79, \"200g\": 35, \"500g\": 33, \"750g\": 28, \"1kg\": 15}', '2026-07-05 12:05:18'),
(89, 'Samba Rice', 'Grains', 'Rice', 290.00, '{\"100g\": 56, \"200g\": 43, \"500g\": 41, \"750g\": 20, \"1kg\": 12}', '2026-07-05 12:05:18'),
(90, 'Sesame Seeds', 'Grains', 'Millets', 260.00, '{\"100g\": 56, \"200g\": 55, \"500g\": 24, \"750g\": 30, \"1kg\": 14}', '2026-07-05 12:05:18'),
(91, 'White Rice', 'Grains', 'Rice', 240.00, '{\"100g\": 69, \"200g\": 50, \"500g\": 49, \"750g\": 12, \"1kg\": 5}', '2026-07-05 12:05:18'),
(92, 'Almonds', 'Nuts', 'Nuts', 850.00, '{\"100g\": 69, \"200g\": 69, \"500g\": 38, \"750g\": 13, \"1kg\": 7}', '2026-07-05 12:05:18'),
(93, 'Cashew Nuts', 'Nuts', 'Nuts', 950.00, '{\"100g\": 74, \"200g\": 43, \"500g\": 36, \"750g\": 18, \"1kg\": 9}', '2026-07-05 12:05:18'),
(94, 'Chia Seeds', 'Nuts', 'Seeds', 600.00, '{\"100g\": 62, \"200g\": 34, \"500g\": 48, \"750g\": 17, \"1kg\": 16}', '2026-07-05 12:05:18'),
(95, 'Dried Coconut Bits', 'Nuts', 'Dried Fruit', 300.00, '{\"100g\": 58, \"200g\": 40, \"500g\": 34, \"750g\": 27, \"1kg\": 14}', '2026-07-05 12:05:18'),
(96, 'Flax Seeds', 'Nuts', 'Seeds', 380.00, '{\"100g\": 79, \"200g\": 63, \"500g\": 20, \"750g\": 27, \"1kg\": 14}', '2026-07-05 12:05:18'),
(97, 'Mixed Nuts', 'Nuts', 'Nuts', 780.00, '{\"100g\": 82, \"200g\": 36, \"500g\": 50, \"750g\": 14, \"1kg\": 13}', '2026-07-05 12:05:18'),
(98, 'Raw Peanuts', 'Nuts', 'Nuts', 320.00, '{\"100g\": 47, \"200g\": 36, \"500g\": 43, \"750g\": 27, \"1kg\": 9}', '2026-07-05 12:05:18'),
(99, 'Pistachio', 'Nuts', 'Nuts', 1200.00, '{\"100g\": 57, \"200g\": 48, \"500g\": 39, \"750g\": 16, \"1kg\": 15}', '2026-07-05 12:05:18'),
(100, 'Pumpkin Seeds', 'Nuts', 'Seeds', 420.00, '{\"100g\": 53, \"200g\": 70, \"500g\": 47, \"750g\": 18, \"1kg\": 20}', '2026-07-05 12:05:18'),
(101, 'Raisins', 'Nuts', 'Dried Fruit', 340.00, '{\"100g\": 56, \"200g\": 33, \"500g\": 22, \"750g\": 30, \"1kg\": 18}', '2026-07-05 12:05:18'),
(102, 'Roasted Mixed Nuts', 'Nuts', 'Nuts', 820.00, '{\"100g\": 57, \"200g\": 32, \"500g\": 20, \"750g\": 20, \"1kg\": 9}', '2026-07-05 12:05:18'),
(103, 'Roasted Peanuts', 'Nuts', 'Nuts', 300.00, '{\"100g\": 80, \"200g\": 46, \"500g\": 25, \"750g\": 24, \"1kg\": 18}', '2026-07-05 12:05:18'),
(104, 'Sesame Seeds', 'Nuts', 'Seeds', 260.00, '{\"100g\": 75, \"200g\": 30, \"500g\": 23, \"750g\": 12, \"1kg\": 9}', '2026-07-05 12:05:18'),
(105, 'Sunflower Seeds', 'Nuts', 'Seeds', 360.00, '{\"100g\": 74, \"200g\": 32, \"500g\": 46, \"750g\": 21, \"1kg\": 9}', '2026-07-05 12:05:18'),
(106, 'Walnuts', 'Nuts', 'Nuts', 980.00, '{\"100g\": 67, \"200g\": 38, \"500g\": 21, \"750g\": 19, \"1kg\": 16}', '2026-07-05 12:05:18'),
(107, 'Aloe Vera Face Pack', 'Facial', 'Face Packs', 380.00, '{\"100g\": 90, \"200g\": 32, \"500g\": 48, \"750g\": 21, \"1kg\": 11}', '2026-07-05 12:05:18'),
(108, 'Charcoal Face Pack', 'Facial', 'Exfoliants', 420.00, '{\"100g\": 83, \"200g\": 45, \"500g\": 41, \"750g\": 13, \"1kg\": 16}', '2026-07-05 12:05:18'),
(109, 'Curry Leaf Face Pack', 'Facial', 'Face Packs', 350.00, '{\"100g\": 89, \"200g\": 65, \"500g\": 48, \"750g\": 23, \"1kg\": 9}', '2026-07-05 12:05:18'),
(110, 'Fenugreek Face Pack', 'Facial', 'Face Packs', 340.00, '{\"100g\": 55, \"200g\": 40, \"500g\": 45, \"750g\": 15, \"1kg\": 18}', '2026-07-05 12:05:18'),
(111, 'Herbal Face Pack', 'Facial', 'Face Packs', 360.00, '{\"100g\": 41, \"200g\": 41, \"500g\": 43, \"750g\": 20, \"1kg\": 18}', '2026-07-05 12:05:18'),
(112, 'Multani Mitti (Fuller\'s Earth)', 'Facial', 'Exfoliants', 300.00, '{\"100g\": 82, \"200g\": 45, \"500g\": 28, \"750g\": 15, \"1kg\": 8}', '2026-07-05 12:05:18'),
(113, 'Neem Face Pack', 'Facial', 'Face Packs', 330.00, '{\"100g\": 64, \"200g\": 32, \"500g\": 47, \"750g\": 25, \"1kg\": 12}', '2026-07-05 12:05:18'),
(114, 'Orange Peel Powder', 'Facial', 'Exfoliants', 320.00, '{\"100g\": 52, \"200g\": 59, \"500g\": 31, \"750g\": 19, \"1kg\": 12}', '2026-07-05 12:05:18'),
(115, 'Rice Face Pack', 'Facial', 'Exfoliants', 290.00, '{\"100g\": 54, \"200g\": 31, \"500g\": 41, \"750g\": 16, \"1kg\": 17}', '2026-07-05 12:05:18'),
(116, 'Rose Petal Face Pack', 'Facial', 'Face Packs', 400.00, '{\"100g\": 61, \"200g\": 47, \"500g\": 47, \"750g\": 12, \"1kg\": 13}', '2026-07-05 12:05:18'),
(117, 'Sandalwood Face Pack', 'Facial', 'Face Packs', 480.00, '{\"100g\": 62, \"200g\": 62, \"500g\": 32, \"750g\": 27, \"1kg\": 15}', '2026-07-05 12:05:18'),
(118, 'Turmeric Face Pack', 'Facial', 'Face Packs', 310.00, '{\"100g\": 41, \"200g\": 37, \"500g\": 48, \"750g\": 18, \"1kg\": 10}', '2026-07-05 12:05:18'),
(119, 'Black Tea Masala', 'ChaiMasala', 'Chai Blends', 320.00, '{\"100g\": 77, \"200g\": 46, \"500g\": 21, \"750g\": 13, \"1kg\": 18}', '2026-07-05 12:05:18'),
(120, 'Signature Chai Blend', 'ChaiMasala', 'Chai Blends', 380.00, '{\"100g\":62,\"200g\":50,\"500g\":32,\"750g\":29,\"1kg\":8}', '2026-07-05 12:05:18'),
(121, 'Cardamom Chai Masala', 'ChaiMasala', 'Chai Blends', 400.00, '{\"100g\": 64, \"200g\": 66, \"500g\": 26, \"750g\": 18, \"1kg\": 6}', '2026-07-05 12:05:18'),
(122, 'Classic Chai Masala', 'ChaiMasala', 'Chai Blends', 340.00, '{\"100g\": 85, \"200g\": 57, \"500g\": 20, \"750g\": 26, \"1kg\": 11}', '2026-07-05 12:05:18'),
(123, 'Instant Coffee Mix', 'ChaiMasala', 'Coffee', 360.00, '{\"100g\": 63, \"200g\": 57, \"500g\": 22, \"750g\": 20, \"1kg\": 15}', '2026-07-05 12:05:18'),
(124, 'Golden Chai Masala', 'ChaiMasala', 'Chai Blends', 420.00, '{\"100g\": 82, \"200g\": 37, \"500g\": 43, \"750g\": 19, \"1kg\": 14}', '2026-07-05 12:05:18'),
(125, 'Green Tea Masala', 'ChaiMasala', 'Green Tea', 350.00, '{\"100g\": 82, \"200g\": 56, \"500g\": 30, \"750g\": 22, \"1kg\": 14}', '2026-07-05 12:05:18'),
(126, 'Healthy Herbal Chai', 'ChaiMasala', 'Chai Blends', 390.00, '{\"100g\": 75, \"200g\": 38, \"500g\": 26, \"750g\": 23, \"1kg\": 17}', '2026-07-05 12:05:18'),
(127, 'Herbal Chai Mix', 'ChaiMasala', 'Chai Blends', 370.00, '{\"100g\": 83, \"200g\": 41, \"500g\": 39, \"750g\": 28, \"1kg\": 14}', '2026-07-05 12:05:18'),
(128, 'Himalayan Chai Masala', 'ChaiMasala', 'Chai Blends', 430.00, '{\"100g\": 65, \"200g\": 65, \"500g\": 46, \"750g\": 10, \"1kg\": 14}', '2026-07-05 12:05:18'),
(129, 'Masala Tea Mix', 'ChaiMasala', 'Chai Blends', 330.00, '{\"100g\": 58, \"200g\": 43, \"500g\": 33, \"750g\": 28, \"1kg\": 15}', '2026-07-05 12:05:18'),
(130, 'Morning Energy Chai', 'ChaiMasala', 'Chai Blends', 360.00, '{\"100g\": 69, \"200g\": 58, \"500g\": 34, \"750g\": 16, \"1kg\": 20}', '2026-07-05 12:05:18'),
(131, 'Strong Ceylon Chai', 'ChaiMasala', 'Chai Blends', 340.00, '{\"100g\": 90, \"200g\": 40, \"500g\": 41, \"750g\": 12, \"1kg\": 14}', '2026-07-05 12:05:18'),
(132, 'Tea Masala Powder', 'ChaiMasala', 'Chai Blends', 300.00, '{\"100g\": 72, \"200g\": 70, \"500g\": 39, \"750g\": 20, \"1kg\": 7}', '2026-07-05 12:05:18'),
(133, 'Zen Green Tea', 'ChaiMasala', 'Green Tea', 380.00, '{\"100g\": 88, \"200g\": 45, \"500g\": 41, \"750g\": 19, \"1kg\": 12}', '2026-07-05 12:05:18'),
(134, 'Premium Wheat Flour', 'RiceFlour', 'Specialty', 280.00, '{\"100g\": 52, \"200g\": 39, \"500g\": 20, \"750g\": 11, \"1kg\": 12}', '2026-07-05 12:05:18'),
(135, 'Baking Flour', 'RiceFlour', 'Specialty', 300.00, '{\"100g\": 70, \"200g\": 69, \"500g\": 47, \"750g\": 12, \"1kg\": 19}', '2026-07-05 12:05:18'),
(136, 'Banana Flour', 'RiceFlour', 'Root Flours', 380.00, '{\"100g\": 66, \"200g\": 70, \"500g\": 38, \"750g\": 16, \"1kg\": 17}', '2026-07-05 12:05:18'),
(137, 'Bean Flour', 'RiceFlour', 'Specialty', 340.00, '{\"100g\": 71, \"200g\": 55, \"500g\": 27, \"750g\": 14, \"1kg\": 5}', '2026-07-05 12:05:18'),
(138, 'Cacao Powder', 'RiceFlour', 'Specialty', 520.00, '{\"100g\": 88, \"200g\": 36, \"500g\": 44, \"750g\": 23, \"1kg\": 12}', '2026-07-05 12:05:18'),
(139, 'Cassava Flour', 'RiceFlour', 'Root Flours', 320.00, '{\"100g\": 51, \"200g\": 63, \"500g\": 34, \"750g\": 11, \"1kg\": 12}', '2026-07-05 12:05:18'),
(140, 'Cassava Flour (Fine)', 'RiceFlour', 'Root Flours', 330.00, '{\"100g\": 47, \"200g\": 59, \"500g\": 24, \"750g\": 24, \"1kg\": 15}', '2026-07-05 12:05:18'),
(141, 'Jowar Flour (Sorghum)', 'RiceFlour', 'Specialty', 350.00, '{\"100g\": 88, \"200g\": 58, \"500g\": 39, \"750g\": 26, \"1kg\": 18}', '2026-07-05 12:05:18'),
(142, 'Organic Rice Flour', 'RiceFlour', 'Rice Flours', 300.00, '{\"100g\": 75, \"200g\": 58, \"500g\": 48, \"750g\": 15, \"1kg\": 20}', '2026-07-05 12:05:18'),
(143, 'Plantain Flour', 'RiceFlour', 'Root Flours', 360.00, '{\"100g\": 68, \"200g\": 46, \"500g\": 44, \"750g\": 17, \"1kg\": 13}', '2026-07-05 12:05:18'),
(144, 'Quinoa Flour', 'RiceFlour', 'Specialty', 480.00, '{\"100g\": 89, \"200g\": 63, \"500g\": 35, \"750g\": 30, \"1kg\": 12}', '2026-07-05 12:05:18'),
(145, 'Ragi Flour (Finger Millet)', 'RiceFlour', 'Specialty', 340.00, '{\"100g\": 57, \"200g\": 58, \"500g\": 22, \"750g\": 19, \"1kg\": 12}', '2026-07-05 12:05:18'),
(146, 'Rice Flour (Fine)', 'RiceFlour', 'Rice Flours', 260.00, '{\"100g\": 57, \"200g\": 51, \"500g\": 30, \"750g\": 27, \"1kg\": 7}', '2026-07-05 12:05:18'),
(147, 'Sweet Rice Flour', 'RiceFlour', 'Rice Flours', 290.00, '{\"100g\": 48, \"200g\": 39, \"500g\": 27, \"750g\": 22, \"1kg\": 9}', '2026-07-05 12:05:18'),
(148, 'White Rice Flour (Classic)', 'RiceFlour', 'Rice Flours', 250.00, '{\"100g\": 85, \"200g\": 43, \"500g\": 22, \"750g\": 23, \"1kg\": 18}', '2026-07-05 12:05:18'),
(149, 'Bath Curry Mix', 'ReadyMix', 'Breakfast Mixes', 350.00, '{\"100g\": 61, \"200g\": 64, \"500g\": 34, \"750g\": 23, \"1kg\": 6}', '2026-07-05 12:05:18'),
(150, 'Dosa Mix', 'ReadyMix', 'Breakfast Mixes', 320.00, '{\"100g\": 53, \"200g\": 56, \"500g\": 32, \"750g\": 28, \"1kg\": 5}', '2026-07-05 12:05:18'),
(151, 'Global Fusion Mix', 'ReadyMix', 'Snack Mixes', 380.00, '{\"100g\": 88, \"200g\": 66, \"500g\": 32, \"750g\": 25, \"1kg\": 5}', '2026-07-05 12:05:18'),
(152, 'Hopper (Appa) Mix', 'ReadyMix', 'Breakfast Mixes', 300.00, '{\"100g\": 62, \"200g\": 49, \"500g\": 44, \"750g\": 22, \"1kg\": 18}', '2026-07-05 12:05:18'),
(153, 'Mukwas Digestive Mix', 'ReadyMix', 'Snack Mixes', 280.00, '{\"100g\": 74, \"200g\": 64, \"500g\": 45, \"750g\": 29, \"1kg\": 12}', '2026-07-05 12:05:18'),
(154, 'Pongal Mix', 'ReadyMix', 'Breakfast Mixes', 340.00, '{\"100g\": 71, \"200g\": 44, \"500g\": 28, \"750g\": 23, \"1kg\": 20}', '2026-07-05 12:05:18'),
(155, 'Puttu Flour Mix', 'ReadyMix', 'Breakfast Mixes', 310.00, '{\"100g\": 41, \"200g\": 54, \"500g\": 30, \"750g\": 22, \"1kg\": 10}', '2026-07-05 12:05:18'),
(156, 'Rotti Mix', 'ReadyMix', 'Breakfast Mixes', 290.00, '{\"100g\": 69, \"200g\": 38, \"500g\": 39, \"750g\": 27, \"1kg\": 5}', '2026-07-05 12:05:18'),
(157, 'String Hopper Flour Mix', 'ReadyMix', 'Breakfast Mixes', 300.00, '{\"100g\": 65, \"200g\": 67, \"500g\": 38, \"750g\": 10, \"1kg\": 7}', '2026-07-05 12:05:18'),
(158, 'Upma Mix', 'ReadyMix', 'Breakfast Mixes', 270.00, '{\"100g\": 81, \"200g\": 57, \"500g\": 24, \"750g\": 24, \"1kg\": 10}', '2026-07-05 12:05:18'),
(159, 'Uttapam Mix', 'ReadyMix', 'Breakfast Mixes', 330.00, '{\"100g\": 43, \"200g\": 46, \"500g\": 32, \"750g\": 20, \"1kg\": 11}', '2026-07-05 12:05:18'),
(160, 'Ahana Spice Pouch', 'Packaging', 'Pouches', 180.00, '{\"100g\": 69, \"200g\": 50, \"500g\": 30, \"750g\": 22, \"1kg\": 13}', '2026-07-05 12:05:18'),
(161, 'Boost Gift Pack', 'Packaging', 'Pouches', 220.00, '{\"100g\": 88, \"200g\": 56, \"500g\": 28, \"750g\": 12, \"1kg\": 20}', '2026-07-05 12:05:18'),
(162, 'Clove Storage Tin', 'Packaging', 'Containers', 250.00, '{\"100g\": 41, \"200g\": 64, \"500g\": 21, \"750g\": 21, \"1kg\": 12}', '2026-07-05 12:05:18'),
(163, 'Dry Goods Pouch', 'Packaging', 'Pouches', 160.00, '{\"100g\": 81, \"200g\": 34, \"500g\": 44, \"750g\": 30, \"1kg\": 6}', '2026-07-05 12:05:18'),
(164, 'Dry Product Container', 'Packaging', 'Containers', 280.00, '{\"100g\": 88, \"200g\": 31, \"500g\": 50, \"750g\": 17, \"1kg\": 11}', '2026-07-05 12:05:18'),
(165, 'Fresh-Seal Container', 'Packaging', 'Containers', 300.00, '{\"100g\": 41, \"200g\": 69, \"500g\": 24, \"750g\": 17, \"1kg\": 9}', '2026-07-05 12:05:18'),
(166, 'Grains Storage Sack', 'Packaging', 'Containers', 240.00, '{\"100g\": 70, \"200g\": 37, \"500g\": 38, \"750g\": 16, \"1kg\": 19}', '2026-07-05 12:05:18'),
(167, 'Mixed Spice Pouch', 'Packaging', 'Pouches', 190.00, '{\"100g\": 84, \"200g\": 46, \"500g\": 44, \"750g\": 21, \"1kg\": 10}', '2026-07-05 12:05:18'),
(168, 'Mixed Dry Goods Pack', 'Packaging', 'Pouches', 200.00, '{\"100g\": 78, \"200g\": 68, \"500g\": 50, \"750g\": 13, \"1kg\": 10}', '2026-07-05 12:05:18'),
(169, 'Mixed Nuts Jar', 'Packaging', 'Containers', 260.00, '{\"100g\": 59, \"200g\": 36, \"500g\": 38, \"750g\": 10, \"1kg\": 14}', '2026-07-05 12:05:18'),
(170, 'Multi-Purpose Pack', 'Packaging', 'Pouches', 170.00, '{\"100g\": 76, \"200g\": 54, \"500g\": 32, \"750g\": 16, \"1kg\": 7}', '2026-07-05 12:05:18'),
(171, 'Nutipure Container', 'Packaging', 'Containers', 290.00, '{\"100g\": 77, \"200g\": 70, \"500g\": 27, \"750g\": 13, \"1kg\": 14}', '2026-07-05 12:05:18'),
(172, 'Nuts Pouch', 'Packaging', 'Pouches', 210.00, '{\"100g\": 83, \"200g\": 68, \"500g\": 45, \"750g\": 13, \"1kg\": 6}', '2026-07-05 12:05:18'),
(173, 'Spices Gift Box', 'Packaging', 'Pouches', 320.00, '{\"100g\": 62, \"200g\": 64, \"500g\": 33, \"750g\": 21, \"1kg\": 7}', '2026-07-05 12:05:18'),
(174, 'Sweets Container', 'Packaging', 'Containers', 230.00, '{\"100g\": 72, \"200g\": 51, \"500g\": 20, \"750g\": 23, \"1kg\": 20}', '2026-07-05 12:05:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grinding_orders`
--
ALTER TABLE `grinding_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `grinding_orders`
--
ALTER TABLE `grinding_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
