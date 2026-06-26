<?php

namespace App\Http\Controllers;

use App\Models\Alertas;
use Illuminate\Http\Request;

class AlertaController extends Controller
{
    public function index(Request $request)
    {
        $query = Alertas::with('pacientes');

        if ($request->has('medico_id')) {
            $query->whereHas('pacientes', function ($q) use ($request) {
                $q->where('medico_id', $request->query('medico_id'));
            });
        }

        if ($request->has('paciente_id')) {
            $query->where('paciente_id', $request->query('paciente_id'));
        }

        return response()->json($query->orderByDesc('criado_em')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'descricao_alerta' => 'required|string|max:255',
        ]);

        $alerta = Alertas::create($request->only('paciente_id', 'descricao_alerta'));

        return response()->json($alerta, 201);
    }
}