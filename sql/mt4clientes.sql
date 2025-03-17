CREATE TABLE `mt4clients` (
  `idClient` int NOT NULL AUTO_INCREMENT,
  `MT4ID` varchar(100) NOT NULL,
  `Nombre` varchar(200) NOT NULL,
  `Broker` varchar(200) NOT NULL,
  `Tests` varchar(100) NOT NULL,
  `idShop` int NOT NULL DEFAULT '1',
  UNIQUE KEY `idClient` (`idClient`),
  UNIQUE KEY `MT4ID` (`MT4ID`)
)
