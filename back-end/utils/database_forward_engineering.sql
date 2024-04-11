-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Ntuaflix
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Ntuaflix
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Ntuaflix` ;
USE `Ntuaflix` ;

-- -----------------------------------------------------
-- Table `Ntuaflix`.`name_basics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`name_basics` (
  `name_id` VARCHAR(10) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `birth_year` CHAR(4) NULL,
  `death_year` CHAR(4) NULL,
  `img_url` VARCHAR(100) NULL,
  PRIMARY KEY (`name_id`),
  UNIQUE INDEX `name_id_UNIQUE` (`name_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`primaryProfession`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`primaryProfession` (
  `name_basics_name_id` VARCHAR(10) NOT NULL,
  `profession` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`name_basics_name_id`, `profession`),
  CONSTRAINT `fk_primaryProfession_name_basics`
    FOREIGN KEY (`name_basics_name_id`)
    REFERENCES `Ntuaflix`.`name_basics` (`name_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`knownFor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`knownFor` (
  `name_basics_name_id` VARCHAR(10) NOT NULL,
  `title_id` VARCHAR(10) NOT NULL,
  INDEX `fk_knownFor_name_basics1_idx` (`name_basics_name_id` ASC) VISIBLE,
  PRIMARY KEY (`name_basics_name_id`, `title_id`),
  CONSTRAINT `fk_knownFor_name_basics1`
    FOREIGN KEY (`name_basics_name_id`)
    REFERENCES `Ntuaflix`.`name_basics` (`name_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`title_basics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`title_basics` (
  `title_id` VARCHAR(10) NOT NULL,
  `type` VARCHAR(10) NOT NULL,
  `primaryTitle` VARCHAR(100) NOT NULL,
  `originalTitle` VARCHAR(100) NOT NULL,
  `isAdult` TINYINT NOT NULL,
  `start_year` CHAR(4) NULL,
  `end_year` CHAR(4) NULL,
  `runtimeMinutes` INT NULL,
  `img_url` VARCHAR(100) NULL,
  PRIMARY KEY (`title_id`),
  UNIQUE INDEX `title_id_UNIQUE` (`title_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`genres` (
  `title_basics_title_id` VARCHAR(10) NOT NULL,
  `genre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`title_basics_title_id`, `genre`),
  CONSTRAINT `fk_genres_title_basics1`
    FOREIGN KEY (`title_basics_title_id`)
    REFERENCES `Ntuaflix`.`title_basics` (`title_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`title_akas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`title_akas` (
  `title_basics_title_id` VARCHAR(10) NOT NULL,
  `ordering` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `region` VARCHAR(45) NULL,
  `language` VARCHAR(45) NULL,
  `type` VARCHAR(20) NULL,
  `attributes` VARCHAR(100) NULL,
  `isOriginal` TINYINT NOT NULL,
  PRIMARY KEY (`title_basics_title_id`, `ordering`),
  CONSTRAINT `fk_title_akas_title_basics1`
    FOREIGN KEY (`title_basics_title_id`)
    REFERENCES `Ntuaflix`.`title_basics` (`title_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`directors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`directors` (
  `title_basics_title_id` VARCHAR(10) NOT NULL,
  `name_id` VARCHAR(10) NOT NULL,
  INDEX `fk_directors_title_basics1_idx` (`title_basics_title_id` ASC) VISIBLE,
  PRIMARY KEY (`title_basics_title_id`, `name_id`),
  CONSTRAINT `fk_directors_title_basics1`
    FOREIGN KEY (`title_basics_title_id`)
    REFERENCES `Ntuaflix`.`title_basics` (`title_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`writers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`writers` (
  `title_basics_title_id` VARCHAR(10) NOT NULL,
  `name_id` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`title_basics_title_id`, `name_id`),
  CONSTRAINT `fk_writers_title_basics1`
    FOREIGN KEY (`title_basics_title_id`)
    REFERENCES `Ntuaflix`.`title_basics` (`title_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`ratings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`ratings` (
  `title_basics_title_id` VARCHAR(10) NOT NULL,
  `avg_rating` FLOAT NOT NULL,
  `num_votes` INT NOT NULL,
  PRIMARY KEY (`title_basics_title_id`, `avg_rating`),
  CONSTRAINT `fk_ratings_title_basics1`
    FOREIGN KEY (`title_basics_title_id`)
    REFERENCES `Ntuaflix`.`title_basics` (`title_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`title_principals`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`title_principals` (
  `title_basics_title_id` VARCHAR(10) NOT NULL,
  `name_id` VARCHAR(10) NOT NULL,
  `ordering` INT NOT NULL,
  `category` VARCHAR(45) NULL,
  `job` VARCHAR(70) NULL,
  `characters` VARCHAR(70) NULL,
  `img_url` VARCHAR(100) NULL,
  PRIMARY KEY (`title_basics_title_id`, `name_id`),
  CONSTRAINT `fk_tilte_principals_title_basics1`
    FOREIGN KEY (`title_basics_title_id`)
    REFERENCES `Ntuaflix`.`title_basics` (`title_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`episodes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`episodes` (
  `title_basics_title_id` VARCHAR(10) NOT NULL,
  `parent_id` VARCHAR(10) NOT NULL,
  `season` INT NULL,
  `episode_num` INT NULL,
  INDEX `fk_episodes_title_basics1_idx` (`title_basics_title_id` ASC) VISIBLE,
  PRIMARY KEY (`title_basics_title_id`),
  CONSTRAINT `fk_episodes_title_basics1`
    FOREIGN KEY (`title_basics_title_id`)
    REFERENCES `Ntuaflix`.`title_basics` (`title_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `isAdmin` INT NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Ntuaflix`.`users_likes_title`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Ntuaflix`.`users_likes_title` (
  `users_user_id` INT NOT NULL,
  `title_basics_title_id` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`users_user_id`, `title_basics_title_id`),
  INDEX `fk_users_has_title_basics_title_basics1_idx` (`title_basics_title_id` ASC) VISIBLE,
  INDEX `fk_users_has_title_basics_users1_idx` (`users_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_has_title_basics_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `Ntuaflix`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_title_basics_title_basics1`
    FOREIGN KEY (`title_basics_title_id`)
    REFERENCES `Ntuaflix`.`title_basics` (`title_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
