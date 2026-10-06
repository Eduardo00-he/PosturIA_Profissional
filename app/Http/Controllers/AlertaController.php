<?php

namespace App\Http\Controllers;

use App\Models\Alertas;
use Illuminate\Http\Request;

class AlertaController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'medico_id' => ['sometimes', 'integer', 'min:1'],
            'paciente_id' => ['sometimes', 'integer', 'min:1'],
        ]);

        $query = Alertas::visibleTo($request->user())
            ->where('verificado', true)
            ->with('pacientes')
            ->orderByDesc('criado_em');

        if (isset($validated['medico_id'])) {
            $query->whereHas('pacientes', fn ($patients) => $patients->where('medico_id', $validated['medico_id']));
        }

        if (isset($validated['paciente_id'])) {
            $query->where('paciente_id', $validated['paciente_id']);
        }

        return response()->json($query->get());
    }

}
