<?php

namespace App\Http\Controllers;

use App\Models\HistoricoPostura;
use App\Models\Pacientes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HistoricoPosturaController extends Controller
{
    public function aggregate(Request $request)
    {
        $dados = HistoricoPostura::visibleTo($request->user())
            ->where('verificado', true)
            ->where('registrado_em', '>=', now()->subYear())
            ->selectRaw('DATE(registrado_em) as dia, AVG(percentual) as percentual')
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        return response()->json($dados);
    }

    public function index(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => ['required', 'integer', 'min:1'],
        ]);

        Pacientes::visibleTo($request->user())->findOrFail($validated['paciente_id']);

        $historico = HistoricoPostura::visibleTo($request->user())
            ->where('paciente_id', $validated['paciente_id'])
            ->where('verificado', true)
            ->orderBy('registrado_em')
            ->get();

        return response()->json($historico);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => ['required', 'integer', 'min:1'],
            'percentual' => ['required', 'numeric', 'min:0', 'max:100'],
            'registrado_em' => ['nullable', 'date', 'before_or_equal:now'],
        ]);

        $paciente = Pacientes::visibleTo($request->user())->findOrFail($validated['paciente_id']);

        $registro = DB::transaction(function () use ($validated, $request, $paciente) {
            $registro = HistoricoPostura::create([
                ...$validated,
                'registrado_em' => $validated['registrado_em'] ?? now(),
                'verificado' => true,
                'registrado_por' => $request->user()->id,
            ]);

            $mediaVerificada = HistoricoPostura::query()
                ->where('paciente_id', $paciente->id)
                ->where('verificado', true)
                ->avg('percentual');

            $paciente->forceFill([
                'postura_media_percentual' => $mediaVerificada,
                'medicao_postural_verificada' => true,
            ])->save();

            return $registro;
        });

        return response()->json($registro, 201);
    }
}
