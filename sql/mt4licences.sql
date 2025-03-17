CREATE TABLE `mt4licences` (
  `idLicence` int NOT NULL AUTO_INCREMENT,
  `idClient` int NOT NULL,
  `idProduct` int NOT NULL,
  `expiration` date NOT NULL,
  `idShop` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`idLicence`),
  UNIQUE KEY `idClient` (`idClient`,`idProduct`)
) 
