<?php

namespace App\Controller;

use App\Entity\Collaborateur;
use App\Entity\Contact;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class ProfileController
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('/api/me/profile', name: 'api_me_profile_update', methods: ['PATCH'])]
    public function update(Request $request, #[CurrentUser] ?PasswordAuthenticatedUserInterface $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent() ?? '{}', true);
        if (!is_array($data)) {
            return new JsonResponse(['message' => 'Invalid payload'], 400);
        }

        $allowed = ['nom', 'prenom', 'email', 'telephone'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $setter = 'set' . ucfirst($field);
                if (method_exists($user, $setter)) {
                    $user->$setter($data[$field]);
                }
            }
        }

        $this->em->persist($user);
        $this->em->flush();

        return new JsonResponse(['message' => 'Profil mis à jour']);
    }
} 