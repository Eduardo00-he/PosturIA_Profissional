<?php

namespace App\Http\Controllers;

use App\Models\Medicos;
use App\Models\Pacientes;
use App\Models\User;
use Illuminate\Http\Request;

class PacienteController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'medico_id' => ['sometimes', 'integer', 'min:1'],
        ]);

        $query = Pacientes::visibleTo($request->user())
            ->with('medico')
            ->orderBy('id');

        if (isset($validated['medico_id'])) {
            $query->where('medico_id', $validated['medico_id']);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $rules = [
            'nome' => ['required', 'string', 'max:255'],
            'data_nascimento' => ['required', 'date', 'before_or_equal:today'],
            'patologia' => ['required', 'string', 'max:255'],
        ];

        if ($user->role === User::ROLE_CLINICA) {
            $rules['medico_id'] = ['required', 'integer', 'min:1'];
        } else {
            $rules['medico_id'] = ['sometimes', 'integer'];
        }

        $validated = $request->validate($rules);
        $medicosVisiveis = Medicos::visibleTo($user);
        $medicoId = $user->role === User::ROLE_MEDICO
            ? $user->medico->id
            : $validated['medico_id'];
        $medico = $medicosVisiveis->whereKey($medicoId)->firstOrFail();

        $paciente = Pacientes::create([
            'nome' => $validated['nome'],
            'data_nascimento' => $validated['data_nascimento'],
            'patologia' => $validated['patologia'],
            'medico_id' => $medico->id,
            'status_conexao' => null,
            'colete_horario_uso' => null,
            'postura_media_percentual' => null,
        ]);

        return response()->json($paciente->load('medico'), 201);
    }
}
