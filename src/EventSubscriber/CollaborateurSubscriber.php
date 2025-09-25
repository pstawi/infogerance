<?php

namespace App\EventSubscriber;

use App\Entity\Collaborateur;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
class CollaborateurSubscriber
{
    public function __construct(private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function prePersist(PrePersistEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Collaborateur) {
            return;
        }

        // dateCreation automatique si non défini
        if ($entity->getDateCreation() === null) {
            $entity->setDateCreation(new \DateTime());
        }

        $this->hashPasswordIfNeeded($entity);
    }

    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Collaborateur) {
            return;
        }

        // Si le password a été fourni en clair lors d'une mise à jour, on le hash
        $this->hashPasswordIfNeeded($entity);

        // Indiquer au UnitOfWork que le champ a changé éventuellement
        $em = $args->getObjectManager();
        $meta = $em->getClassMetadata(Collaborateur::class);
        $em->getUnitOfWork()->recomputeSingleEntityChangeSet($meta, $entity);
    }

    private function hashPasswordIfNeeded(Collaborateur $user): void
    {
        $plain = $user->getPassword();
        if (!$plain) {
            return;
        }
        // Heuristique simple: si ça commence par '$', on suppose déjà hashé
        if (str_starts_with($plain, '$')) {
            return;
        }
        $hashed = $this->passwordHasher->hashPassword($user, $plain);
        $user->setPassword($hashed);
    }
} 