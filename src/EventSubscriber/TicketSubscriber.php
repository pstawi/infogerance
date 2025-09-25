<?php

namespace App\EventSubscriber;

use App\Entity\Ticket;
use App\Entity\Collaborateur;
use App\Entity\Statut;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
class TicketSubscriber
{
    public function __construct(
        private TokenStorageInterface $tokenStorage,
        private EntityManagerInterface $em,
    ) {
    }

    public function prePersist(PrePersistEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Ticket) {
            return;
        }

        // Horodatage automatique
        if ($entity->getDateCreation() === null) {
            $entity->setDateCreation(new \DateTime());
        }

        // Numérotation automatique DIYYYYMMDD-NNN
        if (!$entity->getNumeroTicket()) {
            $today = new \DateTime();
            $prefix = 'DI' . $today->format('Ymd') . '-';

            $qb = $this->em->createQueryBuilder()
                ->select('COUNT(t.id)')
                ->from(Ticket::class, 't')
                ->where('t.numeroTicket LIKE :prefix')
                ->setParameter('prefix', $prefix . '%');

            $count = (int) $qb->getQuery()->getSingleScalarResult();
            $sequence = str_pad((string) ($count + 1), 3, '0', STR_PAD_LEFT);
            $entity->setNumeroTicket($prefix . $sequence);
        }
    }

    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Ticket) {
            return;
        }

        // Autoriser uniquement un Collaborateur à changer le statut
        if ($args->hasChangedField('statutId')) {
            $token = $this->tokenStorage->getToken();
            $user = $token ? $token->getUser() : null;
            if (!$user instanceof Collaborateur) {
                throw new AccessDeniedException('Seul un collaborateur peut changer le statut du ticket.');
            }
        }

        // Si passage à "Terminée", exiger tpsResolution
        if ($args->hasChangedField('statutId')) {
            $newStatut = $entity->getStatutId();
            if ($newStatut instanceof Statut) {
                $libelle = method_exists($newStatut, 'getLibelle') ? $newStatut->getLibelle() : null;
                if ($libelle && mb_strtolower($libelle) === 'terminée' && $entity->getTpsResolution() === null) {
                    throw new AccessDeniedException('Le temps de résolution est requis pour terminer le ticket.');
                }
            }
        }

        // Mettre à jour dateModif
        $entity->setDateModif(new \DateTime());

        // Recompute changeset
        $em = $args->getObjectManager();
        $meta = $em->getClassMetadata(Ticket::class);
        $em->getUnitOfWork()->recomputeSingleEntityChangeSet($meta, $entity);
    }
} 