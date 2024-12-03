-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema luthindb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema luthindb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `luthindb` DEFAULT CHARACTER SET utf8 ;
USE `luthindb` ;

-- -----------------------------------------------------
-- Table `luthindb`.`CLIENTE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`CLIENTE` (
  `idCLIENTE` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `cpf` VARCHAR(20) NULL,
  `data_nascimento` DATE NULL,
  `rg` VARCHAR(20) NULL,
  `sexo` VARCHAR(20) NULL,
  `profissao` VARCHAR(200) NULL,
  `email` VARCHAR(200) NULL,
  `rua` VARCHAR(200) NULL,
  `numero` INT NULL,
  `bairro` VARCHAR(200) NULL,
  `cidade` VARCHAR(200) NULL,
  `estado` VARCHAR(20) NULL,
  `cep` VARCHAR(20) NULL,
  `cadastrado` DATETIME NOT NULL,
  UNIQUE INDEX `idCLIENTE_UNIQUE` (`idCLIENTE` ASC),
  PRIMARY KEY (`idCLIENTE`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`MARCA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`MARCA` (
  `idMARCA` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `referencias` LONGTEXT NULL,
  PRIMARY KEY (`idMARCA`),
  UNIQUE INDEX `idMARCA_UNIQUE` (`idMARCA` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`INSTRUMENTO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`INSTRUMENTO` (
  `idINSTRUMENTO` INT NOT NULL AUTO_INCREMENT,
  `modelo` VARCHAR(45) NOT NULL,
  `serial` VARCHAR(45) NULL,
  `cordas` VARCHAR(45) NULL,
  `condição` LONGTEXT NULL,
  `descritivo` LONGTEXT NULL,
  `origem` VARCHAR(45) NULL,
  `idCLIENTE` INT NOT NULL,
  `idMARCA` INT NOT NULL,
  UNIQUE INDEX `idINSTRUMENTO_UNIQUE` (`idINSTRUMENTO` ASC),
  PRIMARY KEY (`idINSTRUMENTO`),
  INDEX `fk_INSTRUMENTO_CLIENTE1_idx` (`idCLIENTE` ASC),
  INDEX `fk_INSTRUMENTO_MARCA1_idx` (`idMARCA` ASC),
  CONSTRAINT `fk_INSTRUMENTO_CLIENTE1`
    FOREIGN KEY (`idCLIENTE`)
    REFERENCES `luthindb`.`CLIENTE` (`idCLIENTE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_INSTRUMENTO_MARCA1`
    FOREIGN KEY (`idMARCA`)
    REFERENCES `luthindb`.`MARCA` (`idMARCA`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`LUTHIER`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`LUTHIER` (
  `idLUTHIER` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `especialidade` VARCHAR(45) NULL,
  `email` VARCHAR(200) NOT NULL,
  `telefone` VARCHAR(45) NULL,
  `passwd` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idLUTHIER`),
  UNIQUE INDEX `idLUTHIER_UNIQUE` (`idLUTHIER` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`ORDEM_SERVICO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`ORDEM_SERVICO` (
  `idORDEM_SERVICO` INT NOT NULL AUTO_INCREMENT,
  `relato_cliente` LONGTEXT NULL,
  `relato_luthier` LONGTEXT NULL,
  `data_entrada` DATETIME NULL,
  `data_previsao` DATETIME NULL,
  `data_saida` DATETIME NULL,
  `valor_inteiro` DECIMAL(7,2) NULL,
  `desconto` DECIMAL(7,2) NULL,
  `valor_total` DECIMAL(7,2) NULL,
  `status` INT NULL,
  `idCLIENTE` INT NOT NULL,
  `idINSTRUMENTO` INT NOT NULL,
  `idLUTHIER` INT NOT NULL,
  PRIMARY KEY (`idORDEM_SERVICO`),
  UNIQUE INDEX `idORDEM_SERVICO_UNIQUE` (`idORDEM_SERVICO` ASC),
  INDEX `fk_ORDEM_SERVICO_CLIENTE1_idx` (`idCLIENTE` ASC),
  INDEX `fk_ORDEM_SERVICO_INSTRUMENTO1_idx` (`idINSTRUMENTO` ASC),
  INDEX `fk_ORDEM_SERVICO_LUTHIER1_idx` (`idLUTHIER` ASC),
  CONSTRAINT `fk_ORDEM_SERVICO_CLIENTE1`
    FOREIGN KEY (`idCLIENTE`)
    REFERENCES `luthindb`.`CLIENTE` (`idCLIENTE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ORDEM_SERVICO_INSTRUMENTO1`
    FOREIGN KEY (`idINSTRUMENTO`)
    REFERENCES `luthindb`.`INSTRUMENTO` (`idINSTRUMENTO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ORDEM_SERVICO_LUTHIER1`
    FOREIGN KEY (`idLUTHIER`)
    REFERENCES `luthindb`.`LUTHIER` (`idLUTHIER`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`PRODUTO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`PRODUTO` (
  `idPRODUTO` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `valor_entrada` DECIMAL(7,2) NOT NULL,
  `valor_saida` DECIMAL(7,2) NOT NULL,
  `estoque` INT NOT NULL,
  PRIMARY KEY (`idPRODUTO`),
  UNIQUE INDEX `idPRODUTO_UNIQUE` (`idPRODUTO` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`ORDEM_SERVICO_has_PRODUTO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`ORDEM_SERVICO_has_PRODUTO` (
  `idORDEM_SERVICO` INT NOT NULL,
  `idPRODUTO` INT NOT NULL,
  `quantidade` INT NOT NULL,
  PRIMARY KEY (`idORDEM_SERVICO`, `idPRODUTO`),
  INDEX `fk_ORDEM_SERVICO_has_PRODUTO_PRODUTO1_idx` (`idPRODUTO` ASC),
  INDEX `fk_ORDEM_SERVICO_has_PRODUTO_ORDEM_SERVICO1_idx` (`idORDEM_SERVICO` ASC),
  CONSTRAINT `fk_ORDEM_SERVICO_has_PRODUTO_ORDEM_SERVICO1`
    FOREIGN KEY (`idORDEM_SERVICO`)
    REFERENCES `luthindb`.`ORDEM_SERVICO` (`idORDEM_SERVICO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ORDEM_SERVICO_has_PRODUTO_PRODUTO1`
    FOREIGN KEY (`idPRODUTO`)
    REFERENCES `luthindb`.`PRODUTO` (`idPRODUTO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`SERVICO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`SERVICO` (
  `idSERVICOS` INT NOT NULL AUTO_INCREMENT,
  `descricao` LONGTEXT NOT NULL,
  `valor` DECIMAL(7,2) NOT NULL,
  `idORDEM_SERVICO` INT NOT NULL,
  PRIMARY KEY (`idSERVICOS`),
  UNIQUE INDEX `idSERVICOS_UNIQUE` (`idSERVICOS` ASC),
  INDEX `fk_SERVICO_ORDEM_SERVICO1_idx` (`idORDEM_SERVICO` ASC),
  CONSTRAINT `fk_SERVICO_ORDEM_SERVICO1`
    FOREIGN KEY (`idORDEM_SERVICO`)
    REFERENCES `luthindb`.`ORDEM_SERVICO` (`idORDEM_SERVICO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`TELEFONE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`TELEFONE` (
  `idTELEFONE` INT NOT NULL AUTO_INCREMENT,
  `telefone` VARCHAR(45) NOT NULL,
  `idCLIENTE` INT NOT NULL,
  PRIMARY KEY (`idTELEFONE`),
  UNIQUE INDEX `idTELEFONE_UNIQUE` (`idTELEFONE` ASC),
  INDEX `fk_TELEFONE_CLIENTE1_idx` (`idCLIENTE` ASC),
  CONSTRAINT `fk_TELEFONE_CLIENTE1`
    FOREIGN KEY (`idCLIENTE`)
    REFERENCES `luthindb`.`CLIENTE` (`idCLIENTE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`MARCADOR`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`MARCADOR` (
  `idMARCADOR` INT NOT NULL AUTO_INCREMENT,
  `descritivo` VARCHAR(45) NOT NULL,
  `cor_fundo` VARCHAR(45) NOT NULL,
  `cor_texto` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idMARCADOR`),
  UNIQUE INDEX `idMARCADOR_UNIQUE` (`idMARCADOR` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`AGENDA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`AGENDA` (
  `idAGENDA` INT NOT NULL AUTO_INCREMENT,
  `data` DATETIME NOT NULL,
  `presenca` INT NOT NULL,
  `informacoes` LONGTEXT NULL,
  `excluir` INT NOT NULL,
  `last_mod` DATETIME NOT NULL,
  `idCLIENTE` INT NOT NULL,
  `idINSTRUMENTO` INT NOT NULL,
  `idLUTHIER` INT NOT NULL,
  `idMARCADOR` INT NOT NULL,
  PRIMARY KEY (`idAGENDA`),
  UNIQUE INDEX `idAGENDA_UNIQUE` (`idAGENDA` ASC),
  INDEX `fk_AGENDA_CLIENTE1_idx` (`idCLIENTE` ASC),
  INDEX `fk_AGENDA_INSTRUMENTO1_idx` (`idINSTRUMENTO` ASC),
  INDEX `fk_AGENDA_LUTHIER1_idx` (`idLUTHIER` ASC),
  INDEX `fk_AGENDA_MARCADOR1_idx` (`idMARCADOR` ASC),
  CONSTRAINT `fk_AGENDA_CLIENTE1`
    FOREIGN KEY (`idCLIENTE`)
    REFERENCES `luthindb`.`CLIENTE` (`idCLIENTE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AGENDA_INSTRUMENTO1`
    FOREIGN KEY (`idINSTRUMENTO`)
    REFERENCES `luthindb`.`INSTRUMENTO` (`idINSTRUMENTO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AGENDA_LUTHIER1`
    FOREIGN KEY (`idLUTHIER`)
    REFERENCES `luthindb`.`LUTHIER` (`idLUTHIER`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AGENDA_MARCADOR1`
    FOREIGN KEY (`idMARCADOR`)
    REFERENCES `luthindb`.`MARCADOR` (`idMARCADOR`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`LUTHIERIA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`LUTHIERIA` (
  `idLUTHIERIA` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `cnpj` VARCHAR(45) NULL,
  `rua` VARCHAR(100) NULL,
  `numero` INT NULL,
  `bairro` VARCHAR(100) NULL,
  `cidade` VARCHAR(45) NULL,
  `estado` VARCHAR(10) NULL,
  `cep` VARCHAR(20) NULL,
  `data_cadastro` DATETIME NOT NULL,
  `email` VARCHAR(100) NULL,
  PRIMARY KEY (`idLUTHIERIA`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`CONFIGURACAO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`CONFIGURACAO` (
  `idCONFIGURACAO` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `margem_produtos` DECIMAL(4,1) NULL,
  `email` VARCHAR(45) NULL,
  `senha_email` VARCHAR(45) NULL,
  `assunto_padrao` VARCHAR(200) NULL,
  `mensagem_padrao` LONGTEXT NULL,
  `intervalo_agenda` INT NULL,
  `hora_inicial_agenda` TIME NULL,
  `hora_final_agenda` TIME NULL,
  `cor` VARCHAR(45) NULL,
  `alteracao` DATETIME NULL,
  `idLUTHIER` INT NOT NULL,
  PRIMARY KEY (`idCONFIGURACAO`),
  INDEX `fk_CONFIGURACAO_LUTHIER1_idx` (`idLUTHIER` ASC),
  CONSTRAINT `fk_CONFIGURACAO_LUTHIER1`
    FOREIGN KEY (`idLUTHIER`)
    REFERENCES `luthindb`.`LUTHIER` (`idLUTHIER`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`AVALIACAO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`AVALIACAO` (
  `idAVALIACAO` INT NOT NULL AUTO_INCREMENT,
  `data_avaliacao` DATETIME NULL,
  `nota` INT NULL,
  `idORDEM_SERVICO` INT NOT NULL,
  PRIMARY KEY (`idAVALIACAO`),
  UNIQUE INDEX `idAVALIACAO_UNIQUE` (`idAVALIACAO` ASC),
  INDEX `fk_AVALIACAO_ORDEM_SERVICO1_idx` (`idORDEM_SERVICO` ASC),
  CONSTRAINT `fk_AVALIACAO_ORDEM_SERVICO1`
    FOREIGN KEY (`idORDEM_SERVICO`)
    REFERENCES `luthindb`.`ORDEM_SERVICO` (`idORDEM_SERVICO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`RECEITA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`RECEITA` (
  `idRECEITA` INT NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(200) NOT NULL,
  `valor` DECIMAL(7,2) NOT NULL,
  `data_insercao` DATETIME NOT NULL,
  `data_recebimento` DATETIME NULL,
  `tipo` INT NULL,
  `idLUTHIER` INT NOT NULL,
  PRIMARY KEY (`idRECEITA`),
  UNIQUE INDEX `idRECEITA_UNIQUE` (`idRECEITA` ASC),
  INDEX `fk_RECEITA_LUTHIER1_idx` (`idLUTHIER` ASC),
  CONSTRAINT `fk_RECEITA_LUTHIER1`
    FOREIGN KEY (`idLUTHIER`)
    REFERENCES `luthindb`.`LUTHIER` (`idLUTHIER`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`ORDEM_SERVICO_has_RECEITA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`ORDEM_SERVICO_has_RECEITA` (
  `idORDEM_SERVICO` INT NOT NULL,
  `idRECEITA` INT NOT NULL,
  PRIMARY KEY (`idORDEM_SERVICO`, `idRECEITA`),
  INDEX `fk_ORDEM_SERVICO_has_RECEITA_RECEITA1_idx` (`idRECEITA` ASC),
  INDEX `fk_ORDEM_SERVICO_has_RECEITA_ORDEM_SERVICO1_idx` (`idORDEM_SERVICO` ASC),
  CONSTRAINT `fk_ORDEM_SERVICO_has_RECEITA_ORDEM_SERVICO1`
    FOREIGN KEY (`idORDEM_SERVICO`)
    REFERENCES `luthindb`.`ORDEM_SERVICO` (`idORDEM_SERVICO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ORDEM_SERVICO_has_RECEITA_RECEITA1`
    FOREIGN KEY (`idRECEITA`)
    REFERENCES `luthindb`.`RECEITA` (`idRECEITA`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`DESPESA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`DESPESA` (
  `idDESPESA` INT NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(200) NOT NULL,
  `valor` DECIMAL(7,2) NOT NULL,
  `data_insercao` DATETIME NOT NULL,
  `data_pagamento` DATETIME NULL,
  `tipo` INT NULL,
  `idLUTHIER` INT NOT NULL,
  PRIMARY KEY (`idDESPESA`),
  UNIQUE INDEX `idDESPESA_UNIQUE` (`idDESPESA` ASC),
  INDEX `fk_DESPESA_LUTHIER1_idx` (`idLUTHIER` ASC),
  CONSTRAINT `fk_DESPESA_LUTHIER1`
    FOREIGN KEY (`idLUTHIER`)
    REFERENCES `luthindb`.`LUTHIER` (`idLUTHIER`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`ORDEM_SERVICO_has_DESPESA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`ORDEM_SERVICO_has_DESPESA` (
  `idORDEM_SERVICO` INT NOT NULL,
  `idDESPESA` INT NOT NULL,
  PRIMARY KEY (`idORDEM_SERVICO`, `idDESPESA`),
  INDEX `fk_ORDEM_SERVICO_has_DESPESA_DESPESA1_idx` (`idDESPESA` ASC),
  INDEX `fk_ORDEM_SERVICO_has_DESPESA_ORDEM_SERVICO1_idx` (`idORDEM_SERVICO` ASC),
  CONSTRAINT `fk_ORDEM_SERVICO_has_DESPESA_ORDEM_SERVICO1`
    FOREIGN KEY (`idORDEM_SERVICO`)
    REFERENCES `luthindb`.`ORDEM_SERVICO` (`idORDEM_SERVICO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ORDEM_SERVICO_has_DESPESA_DESPESA1`
    FOREIGN KEY (`idDESPESA`)
    REFERENCES `luthindb`.`DESPESA` (`idDESPESA`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`IMAGEM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`IMAGEM` (
  `idIMAGEM` INT NOT NULL AUTO_INCREMENT,
  `caminho` LONGTEXT NOT NULL,
  `nome` VARCHAR(100) NULL,
  `referencias` LONGTEXT NULL,
  PRIMARY KEY (`idIMAGEM`),
  UNIQUE INDEX `idIMAGEM_UNIQUE` (`idIMAGEM` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`ORDEM_SERVICO_has_IMAGEM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`ORDEM_SERVICO_has_IMAGEM` (
  `idORDEM_SERVICO` INT NOT NULL,
  `idIMAGEM` INT NOT NULL,
  PRIMARY KEY (`idORDEM_SERVICO`, `idIMAGEM`),
  INDEX `fk_ORDEM_SERVICO_has_IMAGEM_IMAGEM1_idx` (`idIMAGEM` ASC),
  INDEX `fk_ORDEM_SERVICO_has_IMAGEM_ORDEM_SERVICO1_idx` (`idORDEM_SERVICO` ASC),
  CONSTRAINT `fk_ORDEM_SERVICO_has_IMAGEM_ORDEM_SERVICO1`
    FOREIGN KEY (`idORDEM_SERVICO`)
    REFERENCES `luthindb`.`ORDEM_SERVICO` (`idORDEM_SERVICO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ORDEM_SERVICO_has_IMAGEM_IMAGEM1`
    FOREIGN KEY (`idIMAGEM`)
    REFERENCES `luthindb`.`IMAGEM` (`idIMAGEM`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`DOCUMENTO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`DOCUMENTO` (
  `idDOCUMENTO` INT NOT NULL AUTO_INCREMENT,
  `caminho` LONGTEXT NOT NULL,
  `nome` VARCHAR(100) NULL,
  `referencias` LONGTEXT NULL,
  PRIMARY KEY (`idDOCUMENTO`),
  UNIQUE INDEX `idDOCUMENTO_UNIQUE` (`idDOCUMENTO` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `luthindb`.`ORDEM_SERVICO_has_DOCUMENTO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `luthindb`.`ORDEM_SERVICO_has_DOCUMENTO` (
  `idORDEM_SERVICO` INT NOT NULL,
  `idDOCUMENTO` INT NOT NULL,
  PRIMARY KEY (`idORDEM_SERVICO`, `idDOCUMENTO`),
  INDEX `fk_ORDEM_SERVICO_has_DOCUMENTO_DOCUMENTO1_idx` (`idDOCUMENTO` ASC),
  INDEX `fk_ORDEM_SERVICO_has_DOCUMENTO_ORDEM_SERVICO1_idx` (`idORDEM_SERVICO` ASC),
  CONSTRAINT `fk_ORDEM_SERVICO_has_DOCUMENTO_ORDEM_SERVICO1`
    FOREIGN KEY (`idORDEM_SERVICO`)
    REFERENCES `luthindb`.`ORDEM_SERVICO` (`idORDEM_SERVICO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ORDEM_SERVICO_has_DOCUMENTO_DOCUMENTO1`
    FOREIGN KEY (`idDOCUMENTO`)
    REFERENCES `luthindb`.`DOCUMENTO` (`idDOCUMENTO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
