<?php

namespace App\Controller;

use App\Entity\Collaborateur;
use App\Entity\Contact;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

class MeController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function __invoke(#[CurrentUser] ?PasswordAuthenticatedUserInterface $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }

        $data = [
            'roles' => method_exists($user, 'getRoles') ? $user->getRoles() : [],
        ];

        if ($user instanceof Collaborateur) {
            $data = array_merge($data, [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'type' => 'collaborateur',
            ]);
        } elseif ($user instanceof Contact) {
            $data = array_merge($data, [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'type' => 'contact',
            ]);
        } else {
            $data['type'] = 'user';
        }

        return new JsonResponse($data);
    }
}