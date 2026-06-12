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

        // 2. Faz o mesmo com o médico para evitar o mesmo erro na linha dele
        $medico = Medicos::firstOrCreate(
            ['id' => 1],
            [
                'nome' => 'Dr. Henrique Silva',
                'crm' => '123456-SP',
                'clinica_id' => 1 
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