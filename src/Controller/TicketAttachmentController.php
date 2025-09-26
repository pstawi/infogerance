<?php

namespace App\Controller;

use App\Entity\Ticket;
use App\Entity\TicketAttachment;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class TicketAttachmentController
{
    public function __construct(private EntityManagerInterface $em, private RequestStack $requestStack) {}

    #[Route('/api/tickets/{id}/attachments', name: 'api_ticket_attachments_upload', methods: ['POST'])]
    public function upload(int $id, Request $request, SerializerInterface $serializer): JsonResponse
    {
        $ticket = $this->em->getRepository(Ticket::class)->find($id);
        if (!$ticket) {
            return new JsonResponse(['message' => 'Ticket non trouvé'], 404);
        }

        /** @var UploadedFile|null $file */
        $file = $request->files->get('file');
        if (!$file) {
            return new JsonResponse(['message' => 'Fichier manquant'], 400);
        }

        $attachment = new TicketAttachment();
        $attachment->setTicketId($ticket);
        $attachment->setFile($file);
        $this->em->persist($attachment);
        $this->em->flush();

        return new JsonResponse($this->serializeAttachment($attachment), 201);
    }

    #[Route('/api/tickets/{id}/attachments', name: 'api_ticket_attachments_list', methods: ['GET'])]
    public function list(int $id): JsonResponse
    {
        $ticket = $this->em->getRepository(Ticket::class)->find($id);
        if (!$ticket) {
            return new JsonResponse(['message' => 'Ticket non trouvé'], 404);
        }
        $atts = $this->em->getRepository(TicketAttachment::class)->findBy(['ticketId' => $ticket]);
        $data = array_map(fn($a) => $this->serializeAttachment($a), $atts);
        return new JsonResponse($data);
    }

    private function serializeAttachment(TicketAttachment $attachment): array
    {
        $request = $this->requestStack->getCurrentRequest();
        $base = $request ? $request->getSchemeAndHttpHost() : '';
        $url = '/uploads/tickets/' . $attachment->getFileName();
        return [
            'id' => $attachment->getId(),
            'fileName' => $attachment->getFileName(),
            'originalName' => $attachment->getOriginalName(),
            'url' => $base . $url,
            'uploadedAt' => $attachment->getUploadedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
} 