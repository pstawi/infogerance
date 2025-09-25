<?php

namespace App\Entity;

use App\Repository\TicketRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
#[ApiResource]
#[ORM\Entity(repositoryClass: TicketRepository::class)]
class Ticket
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $numeroTicket = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column]
    private ?\DateTime $dateCreation = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $dateModif = null;

    #[ORM\Column(nullable: true)]
    private ?int $tpsResolution = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Client $clientId = null;

    #[ORM\ManyToOne]
    private ?Contact $contactId = null;

    #[ORM\ManyToOne]
    private ?Collaborateur $collaborateurId = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Statut $statutId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumeroTicket(): ?string
    {
        return $this->numeroTicket;
    }

    public function setNumeroTicket(string $numeroTicket): static
    {
        $this->numeroTicket = $numeroTicket;

        return $this;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDateCreation(): ?\DateTime
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTime $dateCreation): static
    {
        $this->dateCreation = $dateCreation;

        return $this;
    }

    public function getDateModif(): ?\DateTime
    {
        return $this->dateModif;
    }

    public function setDateModif(?\DateTime $dateModif): static
    {
        $this->dateModif = $dateModif;

        return $this;
    }

    public function getTpsResolution(): ?int
    {
        return $this->tpsResolution;
    }

    public function setTpsResolution(?int $tpsResolution): static
    {
        $this->tpsResolution = $tpsResolution;

        return $this;
    }

    public function getClientId(): ?Client
    {
        return $this->clientId;
    }

    public function setClientId(?Client $clientId): static
    {
        $this->clientId = $clientId;

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

    public function getStatutId(): ?Statut
    {
        return $this->statutId;
    }

    public function setStatutId(?Statut $statutId): static
    {
        $this->statutId = $statutId;

        return $this;
    }
}
