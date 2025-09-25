<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
#[ApiResource]
#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $contenu = null;

    #[ORM\Column]
    private ?\DateTime $dateEnvoi = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ticket $ticketId = null;

    #[ORM\ManyToOne]
    private ?Contact $contactId = null;

    #[ORM\ManyToOne]
    private ?Collaborateur $collaborateurId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): static
    {
        $this->contenu = $contenu;

        return $this;
    }

    public function getDateEnvoi(): ?\DateTime
    {
        return $this->dateEnvoi;
    }

    public function setDateEnvoi(\DateTime $dateEnvoi): static
    {
        $this->dateEnvoi = $dateEnvoi;

        return $this;
    }

    public function getTicketId(): ?Ticket
    {
        return $this->ticketId;
    }

    public function setTicketId(?Ticket $ticketId): static
    {
        $this->ticketId = $ticketId;

        return $this;
    }

    public function getContactId(): ?Contact
    {
        return $this->contactId;
    }

    public function setContactId(?Contact $contactId): static
    {
        $this->contactId = $contactId;

        return $this;
    }

    public function getCollaborateurId(): ?Collaborateur
    {
        return $this->collaborateurId;
    }

    public function setCollaborateurId(?Collaborateur $collaborateurId): static
    {
        $this->collaborateurId = $collaborateurId;

        return $this;
    }
}
