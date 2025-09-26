<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250926125143 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE ticket_attachment (id INT AUTO_INCREMENT NOT NULL, ticket_id_id INT NOT NULL, file_name VARCHAR(255) NOT NULL, original_name VARCHAR(255) DEFAULT NULL, uploaded_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_EFCC4BEF5774FDDC (ticket_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE ticket_attachment ADD CONSTRAINT FK_EFCC4BEF5774FDDC FOREIGN KEY (ticket_id_id) REFERENCES ticket (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ticket_attachment DROP FOREIGN KEY FK_EFCC4BEF5774FDDC');
        $this->addSql('DROP TABLE ticket_attachment');
    }
}
