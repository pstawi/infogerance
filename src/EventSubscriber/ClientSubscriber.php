<?php

namespace App\EventSubscriber;

use App\Entity\Client;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::prePersist)]
class ClientSubscriber
{
    public function prePersist(PrePersistEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Client) {
            return;
        }

        if ($entity->getDateCreation() === null) {
            $entity->setDateCreation(new \DateTime());
        }
    }
} 