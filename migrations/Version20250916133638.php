<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250916133638 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE client (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, adresse VARCHAR(255) NOT NULL, telephone VARCHAR(20) NOT NULL, email VARCHAR(255) NOT NULL, date_creation DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE collaborateur (id INT AUTO_INCREMENT NOT NULL, role_id_id INT NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, date_creation DATETIME NOT NULL, INDEX IDX_770CBCD388987678 (role_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contact (id INT AUTO_INCREMENT NOT NULL, client_id_id INT NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, telephone VARCHAR(20) DEFAULT NULL, password VARCHAR(255) NOT NULL, INDEX IDX_4C62E638DC2902E0 (client_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, ticket_id_id INT NOT NULL, contact_id_id INT DEFAULT NULL, collaborateur_id_id INT DEFAULT NULL, contenu LONGTEXT NOT NULL, date_envoi DATETIME NOT NULL, INDEX IDX_B6BD307F5774FDDC (ticket_id_id), INDEX IDX_B6BD307F526E8E58 (contact_id_id), INDEX IDX_B6BD307FAF893832 (collaborateur_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE role (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE statut (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ticket (id INT AUTO_INCREMENT NOT NULL, client_id_id INT NOT NULL, contact_id_id INT DEFAULT NULL, collaborateur_id_id INT DEFAULT NULL, statut_id_id INT NOT NULL, numero_ticket VARCHAR(255) NOT NULL, titre VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, date_creation DATETIME NOT NULL, date_modif DATETIME DEFAULT NULL, tps_resolution INT DEFAULT NULL, INDEX IDX_97A0ADA3DC2902E0 (client_id_id), INDEX IDX_97A0ADA3526E8E58 (contact_id_id), INDEX IDX_97A0ADA3AF893832 (collaborateur_id_id), INDEX IDX_97A0ADA34DB9F129 (statut_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE collaborateur ADD CONSTRAINT FK_770CBCD388987678 FOREIGN KEY (role_id_id) REFERENCES role (id)');
        $this->addSql('ALTER TABLE contact ADD CONSTRAINT FK_4C62E638DC2902E0 FOREIGN KEY (client_id_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F5774FDDC FOREIGN KEY (ticket_id_id) REFERENCES ticket (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F526E8E58 FOREIGN KEY (contact_id_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FAF893832 FOREIGN KEY (collaborateur_id_id) REFERENCES collaborateur (id)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA3DC2902E0 FOREIGN KEY (client_id_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA3526E8E58 FOREIGN KEY (contact_id_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA3AF893832 FOREIGN KEY (collaborateur_id_id) REFERENCES collaborateur (id)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA34DB9F129 FOREIGN KEY (statut_id_id) REFERENCES statut (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE collaborateur DROP FOREIGN KEY FK_770CBCD388987678');
        $this->addSql('ALTER TABLE contact DROP FOREIGN KEY FK_4C62E638DC2902E0');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F5774FDDC');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F526E8E58');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307FAF893832');
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA3DC2902E0');
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA3526E8E58');
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA3AF893832');
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA34DB9F129');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE collaborateur');
        $this->addSql('DROP TABLE contact');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE statut');
        $this->addSql('DROP TABLE ticket');
    }
}
