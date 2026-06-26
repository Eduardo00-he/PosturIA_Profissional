<?php

namespace App\Http\Controllers;

use App\Models\Consultas;
use Illuminate\Http\Request;

class ConsultaController extends Controller
{
    public function index(Request $request)
    {
        $query = Consultas::with(['paciente', 'medico']);

        if ($request->has('medico_id')) {
            $query->where('medico_id', $request->query('medico_id'));
        }

        if ($request->has('paciente_id')) {
            $query->where('paciente_id', $request->query('paciente_id'));
        }

        return response()->json($query->orderBy('data_hora')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_id' => 'required|exists:medicos,id',
            'data_hora' => 'required|date',
            'observacao' => 'nullable|string|max:255',
        ]);

        $consulta = Consultas::create($request->only(
            'paciente_id',
            'medico_id',
            'data_hora',
            'observacao'
        ));

        return response()->json($consulta->load(['paciente', 'medico']), 201);
    }

    public function destroy($id)
    {
        $consulta = Consultas::findOrFail($id);
        $consulta->delete();

        return response()->json(['message' => 'Consulta removida com sucesso.']);
    }
}