<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;

#[ApiResource]
#[ApiFilter(SearchFilter::class, properties: ['ticketId' => 'exact'])]
#[ORM\Entity]
#[Vich\Uploadable]
class TicketAttachment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ticket $ticketId = null;

    #[Vich\UploadableField(mapping: 'ticket_attachments', fileNameProperty: 'fileName', originalName: 'originalName')]
    private ?File $file = null;

    #[ORM\Column(length: 255)]
    private ?string $fileName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $originalName = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $uploadedAt = null;

    public function getId(): ?int { return $this->id; }

    public function setTicketId(?Ticket $ticket): self { $this->ticketId = $ticket; return $this; }
    public function getTicketId(): ?Ticket { return $this->ticketId; }

    public function setFile(?File $file = null): void { $this->file = $file; if ($file !== null) { $this->uploadedAt = new \DateTimeImmutable(); } }
    public function getFile(): ?File { return $this->file; }

    public function getFileName(): ?string { return $this->fileName; }
    public function setFileName(?string $fileName): self { $this->fileName = $fileName; return $this; }

    public function getOriginalName(): ?string { return $this->originalName; }
    public function setOriginalName(?string $originalName): self { $this->originalName = $originalName; return $this; }

    public function getUploadedAt(): ?\DateTimeImmutable { return $this->uploadedAt; }
    public function setUploadedAt(\DateTimeImmutable $uploadedAt): self { $this->uploadedAt = $uploadedAt; return $this; }
} 