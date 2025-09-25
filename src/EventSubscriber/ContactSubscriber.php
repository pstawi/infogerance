<?php

namespace App\EventSubscriber;

use App\Entity\Contact;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
class ContactSubscriber
{
    public function __construct(private PasswordHasherFactoryInterface $hasherFactory)
    {
    }

    public function prePersist(PrePersistEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Contact) {
            return;
        }

        $this->hashPasswordIfNeeded($entity);
    }

    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Contact) {
            return;
        }

        $this->hashPasswordIfNeeded($entity);

        $em = $args->getObjectManager();
        $meta = $em->getClassMetadata(Contact::class);
        $em->getUnitOfWork()->recomputeSingleEntityChangeSet($meta, $entity);
    }

    private function hashPasswordIfNeeded(Contact $contact): void
    {
        $plain = $contact->getPassword();
        if (!$plain) {
            return;
        }
        if (str_starts_with($plain, '$')) {
            return;
        }
        $hasher = $this->hasherFactory->getPasswordHasher(Contact::class);
        $hashed = $hasher->hash($plain);
        $contact->setPassword($hashed);
    }
} 