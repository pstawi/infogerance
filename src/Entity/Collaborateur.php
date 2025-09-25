<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CollaborateurRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ApiResource(
    normalizationContext: ['groups' => ['collaborateur:read']],
    denormalizationContext: ['groups' => ['collaborateur:write']]
)]
#[ORM\Entity(repositoryClass: CollaborateurRepository::class)]
class Collaborateur implements PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['collaborateur:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['collaborateur:read', 'collaborateur:write'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['collaborateur:read', 'collaborateur:write'])]
    private ?string $prenom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['collaborateur:read', 'collaborateur:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups(['collaborateur:write'])]
    private ?string $password = null;

    #[ORM\Column]
    #[Groups(['collaborateur:read', 'collaborateur:write'])]
    private ?\DateTime $dateCreation = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['collaborateur:read', 'collaborateur:write'])] 
    private ?Role $roleId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
{
    $this->password = $password;
    return $this;
}

    public function eraseCredentials()
    {
  
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

    public function getRoleId(): ?Role
    {
        return $this->roleId;
    }

    public function setRoleId(?Role $roleId): static
    {
        $this->roleId = $roleId;

        return $this;
    }
}
