<?php

namespace App\Http\Controllers;

use App\Models\Consultas;
use Illuminate\Http\Request;

class ConsultaController extends Controller
{
    public function index(Request $request)
    {
        $query = Consultas::query()
            ->with(['paciente', 'medico'])
            ->whereIn('paciente_id', $this->accessiblePacientes()->select('id'));

        if ($request->filled('medico_id')) {
            $query->where('medico_id', $request->integer('medico_id'));
        }
        if ($request->filled('paciente_id')) {
            $query->where('paciente_id', $request->integer('paciente_id'));
        }

        return response()->json($query->orderBy('data_hora')->limit(100)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => ['required', 'integer'],
            'medico_id' => ['required', 'integer'],
            'data_hora' => ['required', 'date'],
            'observacao' => ['nullable', 'string', 'max:255'],
        ]);

        $paciente = $this->accessiblePacientes()->findOrFail($validated['paciente_id']);
        $medico = $this->accessibleMedicos()->findOrFail($validated['medico_id']);

        abort_unless((int) $paciente->medico_id === (int) $medico->id, 422, 'Paciente e médico não pertencem à mesma relação.');

        $consulta = Consultas::create($validated);

        return response()->json($consulta->load(['paciente', 'medico']), 201);
    }

    public function destroy(int $id)
    {
        $consulta = Consultas::whereIn('paciente_id', $this->accessiblePacientes()->select('id'))->findOrFail($id);
        $consulta->delete();

        return response()->json(['message' => 'Consulta removida com sucesso.']);
    }
}
