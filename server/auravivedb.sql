-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2026 at 04:51 AM
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
-- Database: `auravivedb`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `loginUser` (`username` VARCHAR(200), `pass` VARCHAR(200)) RETURNS INT(11) DETERMINISTIC BEGIN
	DECLARE id INT;
    SELECT userID INTO id FROM users
    WHERE userUserN = username
    AND userPass = pass;
    
    RETURN (id);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cartID` int(11) NOT NULL,
  `productID` int(11) DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `productID` int(11) DEFAULT NULL,
  `orderCount` int(11) DEFAULT NULL,
  `orderDate` datetime DEFAULT current_timestamp(),
  `orderTotalAmount` decimal(10,2) DEFAULT NULL,
  `orderStatus` varchar(50) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productID` int(11) NOT NULL,
  `productName` varchar(100) DEFAULT NULL,
  `productDescrip` text DEFAULT NULL,
  `productCateg` varchar(100) DEFAULT NULL,
  `productPrice` decimal(10,2) DEFAULT NULL,
  `productStock` int(11) DEFAULT 0,
  `productImg` varchar(300) DEFAULT NULL,
  `productCreated` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `userFname` varchar(100) DEFAULT NULL,
  `userLname` varchar(100) DEFAULT NULL,
  `userEmail` varchar(100) DEFAULT NULL,
  `userPhone` varchar(20) DEFAULT NULL,
  `userUserN` varchar(100) DEFAULT NULL,
  `userPass` varchar(200) DEFAULT NULL,
  `userRole` enum('owner','customer') DEFAULT NULL,
  `userAccCreated` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `userFname`, `userLname`, `userEmail`, `userPhone`, `userUserN`, `userPass`, `userRole`, `userAccCreated`) VALUES
(1, 'Admin', 'User', 'admin@example.com', '09170000001', 'adminuser', '$2b$10$rTCXno.b82zMzTQMsbhaf.cihwOzivNnOhzaIeGD.UU83fLoFKNzW', 'owner', '2026-02-13 05:10:09'),
(2, 'John', 'Doe', 'john.doe@example.com', '09171234567', 'johndoe', '$2b$10$DtxxVGQd56hobAQ4P12Wo.zdfhx5WTR4c3fWnQhFAD13d.qjhsvqi', 'customer', '2026-02-13 05:10:09'),
(3, 'Jane', 'Smith', 'jane.smith@example.com', '09179876543', 'janesmith', '$2b$10$8DdXf3EbvQhjA2o/CnElRu7RMLqxoX3zJ1yc4nS9Dg3wOkEfO3t02', 'customer', '2026-02-13 05:10:09'),
(4, 'ht', 'R5yyh', 'edddj@gmail.com', '8633657', 'ashfth', '$2b$10$h0XeUMFCPiI0QkWf6WV0pu1Qmhy4BSZwv8xdxbXBWMtzKJl8Welne', 'customer', '2026-02-14 11:15:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cartID`),
  ADD KEY `productID` (`productID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `userID` (`userID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `userUserN` (`userUserN`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cartID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `products` (`productID`),
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `products` (`productID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
