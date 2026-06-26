<?php

namespace App\Http\Controllers;

use App\Models\HistoricoPostura;
use Illuminate\Http\Request;

class HistoricoPosturaController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
        ]);

        $historico = HistoricoPostura::where('paciente_id', $request->query('paciente_id'))
            ->orderBy('registrado_em')
            ->get();

        return response()->json($historico);
    }

    public function store(Request $request)
    {
        $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'percentual' => 'required|numeric|min:0|max:100',
            'registrado_em' => 'nullable|date',
        ]);

        $registro = HistoricoPostura::create([
            'paciente_id' => $request->paciente_id,
            'percentual' => $request->percentual,
            'registrado_em' => $request->registrado_em ?? now(),
        ]);

        return response()->json($registro, 201);
    }
}