<?php

namespace App\Command;

use App\Entity\Statut;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:init-statuts', description: 'Initialise les statuts de ticket par défaut')]
class InitStatutsCommand extends Command
{
    public function __construct(private EntityManagerInterface $em)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $defaults = [
            'Demande reçue',
            'Affectée',
            'En cours d’intervention',
            'En attente d’information',
            'Terminée',
            'Réouverte',
        ];

        $repo = $this->em->getRepository(Statut::class);
        $created = 0;
        foreach ($defaults as $label) {
            $existing = $repo->findOneBy(['libelle' => $label]);
            if ($existing) {
                continue;
            }
            $s = new Statut();
            $s->setLibelle($label);
            $this->em->persist($s);
            $created++;
        }
        if ($created > 0) {
            $this->em->flush();
        }
        $output->writeln(sprintf('Statuts créés: %d', $created));

        return Command::SUCCESS;
    }
} 