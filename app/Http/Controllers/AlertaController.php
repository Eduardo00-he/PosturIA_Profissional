<?php

namespace App\Http\Controllers;

use App\Models\Alertas;
use Illuminate\Http\Request;

class AlertaController extends Controller
{
    public function index(Request $request)
    {
        $query = Alertas::query()
            ->with('pacientes')
            ->whereIn('paciente_id', $this->accessiblePacientes()->select('id'));

        if ($request->filled('medico_id')) {
            $query->whereHas('pacientes', fn ($patient) => $patient->where('medico_id', $request->integer('medico_id')));
        }
        if ($request->filled('paciente_id')) {
            $query->where('paciente_id', $request->integer('paciente_id'));
        }

        return response()->json($query->orderByDesc('criado_em')->limit(100)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => ['required', 'integer'],
            'descricao_alerta' => ['required', 'string', 'max:255'],
        ]);
        $this->accessiblePacientes()->findOrFail($validated['paciente_id']);

        return response()->json(Alertas::create($validated), 201);
    }
}
