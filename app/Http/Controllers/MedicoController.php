<?php

namespace App\Http\Controllers;

use App\Models\Medicos;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MedicoController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'clinica_id' => ['sometimes', 'integer', 'min:1'],
            'medico_id' => ['sometimes', 'integer', 'min:1'],
        ]);

        $query = Medicos::visibleTo($request->user())
            ->with('pacientes')
            ->orderBy('nome');

        if (isset($validated['clinica_id'])) {
            $query->where('clinica_id', $validated['clinica_id']);
        }

        if (isset($validated['medico_id'])) {
            $query->whereKey($validated['medico_id']);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->role === User::ROLE_CLINICA, 403);

        $validated = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
            'registro_profissional' => ['required', 'string', 'max:30', 'unique:medicos,registro_profissional'],
            'data_nascimento' => ['required', 'date', 'before:today'],
            'area' => ['required', Rule::in(['fisioterapeuta', 'ortopedista'])],
        ]);

        $medico = Medicos::create([
            ...$validated,
            'clinica_id' => $request->user()->clinica_id,
        ]);

        return response()->json($medico, 201);
    }

    public function show(Request $request, int $id)
    {
        $medico = Medicos::visibleTo($request->user())
            ->with('pacientes')
            ->findOrFail($id);

        return response()->json($medico);
    }

    public function destroy(Request $request, int $id)
    {
        abort_unless($request->user()->role === User::ROLE_CLINICA, 403);

        $medico = Medicos::visibleTo($request->user())->findOrFail($id);

        if ($medico->pacientes()->exists() || $medico->consultas()->exists() || $medico->user_id !== null) {
            return response()->json([
                'message' => 'Não é possível excluir este médico enquanto houver pacientes, consultas ou conta vinculada.',
            ], 422);
        }

        $medico->delete();

        return response()->json(['message' => 'Médico removido com sucesso.']);
    }
}
