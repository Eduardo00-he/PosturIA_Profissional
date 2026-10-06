<?php

namespace Database\Seeders;

use App\Models\Clinicas;
use App\Models\Medicos;
use App\Models\Pacientes;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            $this->command?->warn('Seed de demonstração bloqueado fora de local/testing.');
            return;
        }

        $clinica = Clinicas::firstOrCreate(
            ['id' => 1],
            ['nome' => 'PosturIA — Clínica de Demonstração', 'cidade' => 'Belo Horizonte']
        );

        $medicosBase = [
            ['nome' => 'Dr. Henrique Silva', 'data_nascimento' => '1985-05-15', 'area' => 'ortopedista', 'registro_profissional' => 'DEMO-CRM-001'],
            ['nome' => 'Dra. Mariana Costa', 'data_nascimento' => '1991-08-22', 'area' => 'fisioterapeuta', 'registro_profissional' => 'DEMO-CREFITO-002'],
            ['nome' => 'Dr. Rafael Souza', 'data_nascimento' => '1987-11-03', 'area' => 'ortopedista', 'registro_profissional' => 'DEMO-CRM-003'],
        ];

        $medicos = [];
        foreach ($medicosBase as $dados) {
            $medicos[] = Medicos::firstOrCreate(
                ['registro_profissional' => $dados['registro_profissional']],
                [...$dados, 'clinica_id' => $clinica->id]
            );
        }

        Pacientes::firstOrCreate(
            ['nome' => 'Lucas Almeida (demo)', 'medico_id' => $medicos[0]->id],
            [
                'data_nascimento' => '1990-04-12',
                'patologia' => 'Lombalgia — dado fictício de demonstração',
                'status_conexao' => null,
                'colete_horario_uso' => null,
                'postura_media_percentual' => null,
            ]
        );

        Pacientes::firstOrCreate(
            ['nome' => 'Pedro Martins (demo)', 'medico_id' => $medicos[0]->id],
            [
                'data_nascimento' => '1988-09-30',
                'patologia' => 'Escoliose — dado fictício de demonstração',
                'status_conexao' => null,
                'colete_horario_uso' => null,
                'postura_media_percentual' => null,
            ]
        );

        $this->command?->info('Dados fictícios locais criados sem remover registros existentes.');
    }
}
