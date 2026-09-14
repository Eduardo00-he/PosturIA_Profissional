<?php

namespace App\Http\Controllers;

use App\Models\Pacientes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PacienteController extends Controller
{
    public function index(Request $request)
    {
        $query = $this->accessiblePacientes()->with('medico');

        if ($request->filled('medico_id')) {
            $query->where('medico_id', $request->integer('medico_id'));
        }

        return response()->json($query->limit(100)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
            'data_nascimento' => ['required', 'date', 'before_or_equal:today'],
            'patologia' => ['required', 'string', 'max:255'],
            'medico_id' => ['required', 'integer'],
        ]);

        $medico = $this->accessibleMedicos()->findOrFail($validated['medico_id']);

        if ($request->user()->isDoctor() && $medico->user_id !== $request->user()->id) {
            abort(403);
        }

        $paciente = DB::transaction(fn () => Pacientes::create([
            'nome' => $validated['nome'],
            'data_nascimento' => $validated['data_nascimento'],
            'patologia' => $validated['patologia'],
            'medico_id' => $medico->id,
            'status_conexao' => random_int(0, 1),
            'colete_horario_uso' => now(),
            'postura_media_percentual' => round(random_int(4000, 9500) / 100, 2),
        ]));

        return response()->json($paciente->load('medico'), 201);
    }
}
