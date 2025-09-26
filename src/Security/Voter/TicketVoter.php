<?php

namespace App\Security\Voter;

use App\Entity\Collaborateur;
use App\Entity\Contact;
use App\Entity\Ticket;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class TicketVoter extends Voter
{
    public const VIEW = 'TICKET_VIEW';
    public const EDIT = 'TICKET_EDIT';
    public const DELETE = 'TICKET_DELETE';
    public const STATUS_CHANGE = 'TICKET_STATUS_CHANGE';

    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT, self::DELETE, self::STATUS_CHANGE], true)
            && $subject instanceof Ticket;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user) {
            return false;
        }

        // Collaborateur: accès complet
        if ($user instanceof Collaborateur) {
            return true;
        }

        // Contact: accès restreint
        if ($user instanceof Contact) {
            if ($attribute === self::VIEW) {
                return $subject->getClientId() === $user->getClientId();
            }
            // Pas d'édition/suppression/changement de statut pour un contact
            return false;
        }

        return false;
    }
} 