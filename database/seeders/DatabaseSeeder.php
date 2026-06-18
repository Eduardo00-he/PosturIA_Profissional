<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pacientes;
use App\Models\Medicos;
use App\Models\Clinicas;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. firstOrCreate tenta buscar a clínica 1. Se achar, usa ela. Se não achar, cria!
        $clinica = Clinicas::firstOrCreate(
            ['id' => 1],
            [
                'nome' => 'PosturIA Ortopedic Clinic',
                'cidade' => 'Belo Horizonte'
            ]
        );

         $medicosBase = [
            ['id' => 1, 'nome' => 'Dr. Henrique Silva', 'idade' => 41, 'area' => 'ortopedista',    'crm' => 'CRM-ORTO-58432'],
            ['id' => 2, 'nome' => 'Dra. Mariana Costa',  'idade' => 35, 'area' => 'fisioterapeuta', 'crm' => 'CRM-FISIO-71204'],
            ['id' => 3, 'nome' => 'Dr. Rafael Souza',    'idade' => 39, 'area' => 'ortopedista',    'crm' => 'CRM-ORTO-39876'],
        ];
 
        foreach ($medicosBase as $dados) {
            Medicos::firstOrCreate(
                ['id' => $dados['id']],
                [
                    'nome' => $dados['nome'],
                    'idade' => $dados['idade'],
                    'area' => $dados['area'],
                    'crm' => $dados['crm'],
                    'clinica_id' => $clinica->id,
                ]
            );

        // 3. Para os pacientes, como eles não têm ID fixo no código, vamos limpar a tabela antes de reinserir
        // Assim evita acumular nomes repetidos toda vez que rodar o comando
        Pacientes::query()->delete();

        Pacientes::create([
            'medico_id' => 1,
            'nome' => 'Lucas Almeida',
            'patologia' => 'Lombalgia Crônica',
            'status_conexao' => 1,
            'colete_horario_uso' => '2026-06-12 08:15:00',
            'postura_media_percentual' => 78.00
        ]);

        Pacientes::create([
            'medico_id' => 1,
            'nome' => 'Pedro Martins',
            'patologia' => 'Escoliose Leve',
            'status_conexao' => 1,
            'colete_horario_uso' => '2026-06-12 09:02:00',
            'postura_media_percentual' => 62.00
        ]);
    }
}