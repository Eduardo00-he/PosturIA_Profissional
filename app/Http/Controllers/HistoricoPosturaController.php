<?php

namespace App\Http\Controllers;

use App\Models\HistoricoPostura;
use Illuminate\Http\Request;

class HistoricoPosturaController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate(['paciente_id' => ['required', 'integer']]);
        $this->accessiblePacientes()->findOrFail($validated['paciente_id']);

        return response()->json(
            HistoricoPostura::where('paciente_id', $validated['paciente_id'])
                ->orderBy('registrado_em')->limit(500)->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => ['required', 'integer'],
            'percentual' => ['required', 'numeric', 'min:0', 'max:100'],
            'registrado_em' => ['nullable', 'date'],
        ]);
        $this->accessiblePacientes()->findOrFail($validated['paciente_id']);

        $registro = HistoricoPostura::create([
            ...$validated,
            'registrado_em' => $validated['registrado_em'] ?? now(),
        ]);

        return response()->json($registro, 201);
    }
}
