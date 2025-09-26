<?php

namespace App\Controller;

use App\Entity\Collaborateur;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;

class ChangePasswordController
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $em,
    ) {}

    #[Route('/api/change_password', name: 'api_change_password', methods: ['POST'])]
    public function __invoke(Request $request, #[CurrentUser] ?Collaborateur $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent() ?? '{}', true);
        $currentPassword = (string)($data['currentPassword'] ?? '');
        $newPassword = (string)($data['newPassword'] ?? '');

        if ($currentPassword === '' || $newPassword === '') {
            return new JsonResponse(['message' => 'Champs requis manquants'], 400);
        }
        if (strlen($newPassword) < 8) {
            return new JsonResponse(['message' => 'Le nouveau mot de passe doit contenir au moins 8 caractères'], 400);
        }
        if (!$this->passwordHasher->isPasswordValid($user, $currentPassword)) {
            return new JsonResponse(['message' => 'Mot de passe actuel invalide'], 400);
        }

        // Hash du nouveau mot de passe et sauvegarde
        $hashed = $this->passwordHasher->hashPassword($user, $newPassword);
        $user->setPassword($hashed);
        $this->em->persist($user);
        $this->em->flush();

        return new JsonResponse(['message' => 'Mot de passe mis à jour']);
    }
} 