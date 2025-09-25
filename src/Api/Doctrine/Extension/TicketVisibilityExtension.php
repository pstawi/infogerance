<?php

namespace App\Api\Doctrine\Extension;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Ticket;
use App\Entity\Collaborateur;
use App\Entity\Contact;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class TicketVisibilityExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    public function __construct(private TokenStorageInterface $tokenStorage)
    {
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null): void
    {
        if ($resourceClass !== Ticket::class) {
            return;
        }
        $this->addWhere($queryBuilder);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = []): void
    {
        if ($resourceClass !== Ticket::class) {
            return;
        }
        $this->addWhere($queryBuilder);
    }

    private function addWhere(QueryBuilder $qb): void
    {
        $token = $this->tokenStorage->getToken();
        $user = $token ? $token->getUser() : null;

        $rootAliases = $qb->getRootAliases();
        $alias = $rootAliases[0] ?? 'o';

        if ($user instanceof Collaborateur) {
            // Collaborateur: voit tous les tickets (pas de filtre supplémentaire)
            return;
        }

        if ($user instanceof Contact) {
            // Contact: voit seulement les tickets de son client
            $clientParam = ':clientId';
            $qb->andWhere(sprintf('%s.clientId = %s', $alias, $clientParam))
               ->setParameter($clientParam, $user->getClientId());
            return;
        }

        // Non authentifié: ne rien retourner
        $qb->andWhere('1 = 0');
    }
} 