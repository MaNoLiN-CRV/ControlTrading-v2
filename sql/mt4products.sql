CREATE TABLE `mt4products` (
  `idProduct` int NOT NULL AUTO_INCREMENT,
  `Product` varchar(100) NOT NULL,
  `Code` varchar(25) NOT NULL,
  `version` int NOT NULL DEFAULT '0',
  `idShop` int NOT NULL DEFAULT '1',
  `DemoDays` int NOT NULL DEFAULT '0',
  `link` varchar(256) NOT NULL,
  `comentario` varchar(100) NOT NULL,
  PRIMARY KEY (`idProduct`),
  UNIQUE KEY `Code` (`Code`)
)
