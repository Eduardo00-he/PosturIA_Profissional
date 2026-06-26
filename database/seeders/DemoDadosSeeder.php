<?php

namespace Database\Seeders;

use App\Models\Pacientes;
use App\Models\Consultas;
use App\Models\Alertas;
use App\Models\HistoricoPostura;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DemoDadosSeeder extends Seeder
{
    public function run(): void
    {
        $pacientes = Pacientes::all();

        if ($pacientes->isEmpty()) {
            $this->command->warn('Nenhum paciente encontrado. Cadastre pacientes antes de rodar este seeder.');
            return;
        }

        foreach ($pacientes as $paciente) {
            if (!$paciente->medico_id) {
                continue;
            }

            // Histórico de postura: últimos 14 dias
            for ($i = 13; $i >= 0; $i--) {
                HistoricoPostura::create([
                    'paciente_id' => $paciente->id,
                    'percentual' => rand(55, 95),
                    'registrado_em' => Carbon::now()->subDays($i),
                ]);
            }

            // Consultas: 2 futuras
            Consultas::create([
                'paciente_id' => $paciente->id,
                'medico_id' => $paciente->medico_id,
                'data_hora' => Carbon::now()->addDays(rand(1, 10))->setTime(rand(8, 17), 0),
                'observacao' => 'Consulta de acompanhamento',
            ]);

            // Alertas: 1 ou 2 recentes
            Alertas::create([
                'paciente_id' => $paciente->id,
                'descricao_alerta' => 'Postura inadequada detectada por tempo prolongado',
            ]);
        }

        $this->command->info('Dados de demonstração criados com sucesso.');
    }
}