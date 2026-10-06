<?php

namespace App\Http\Controllers;

use App\Models\Consultas;
use App\Models\Medicos;
use App\Models\Pacientes;
use App\Models\User;
use Illuminate\Http\Request;

class ConsultaController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'medico_id' => ['sometimes', 'integer', 'min:1'],
            'paciente_id' => ['sometimes', 'integer', 'min:1'],
        ]);

        $query = Consultas::visibleTo($request->user())
            ->with(['paciente', 'medico'])
            ->orderBy('data_hora');

        if (isset($validated['medico_id'])) {
            $query->where('medico_id', $validated['medico_id']);
        }

        if (isset($validated['paciente_id'])) {
            $query->where('paciente_id', $validated['paciente_id']);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => ['required', 'integer', 'min:1'],
            'medico_id' => ['required', 'integer', 'min:1'],
            'data_hora' => ['required', 'date', 'after:now'],
            'observacao' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $medico = Medicos::visibleTo($user)->findOrFail($validated['medico_id']);
        $paciente = Pacientes::visibleTo($user)->findOrFail($validated['paciente_id']);

        if ((int) $paciente->medico_id !== (int) $medico->id) {
            return response()->json([
                'message' => 'O paciente não pertence ao médico selecionado.',
            ], 422);
        }

        if ($user->role === User::ROLE_MEDICO && (int) $medico->user_id !== (int) $user->id) {
            abort(403);
        }

        $consulta = Consultas::create($validated);

        return response()->json($consulta->load(['paciente', 'medico']), 201);
    }

    public function destroy(Request $request, int $id)
    {
        $consulta = Consultas::visibleTo($request->user())->findOrFail($id);
        $consulta->delete();

        return response()->json(['message' => 'Consulta removida com sucesso.']);
    }
}
