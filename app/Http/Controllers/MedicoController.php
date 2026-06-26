<?php

namespace App\Http\Controllers;

use App\Models\Medicos;
use Illuminate\Http\Request;

class MedicoController extends Controller
{
    public function index(Request $request)
    {
        $query = Medicos::with('pacientes');

        if ($request->has('clinica_id')) {
            $query->where('clinica_id', $request->query('clinica_id'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'nome'            => 'required|string|max:255',
        'crm'             => 'required|string|max:20|unique:medicos,crm',
        'data_nascimento' => 'required|date',
        'area'            => 'required|string',
    ]);

    $clinicaId = auth()->id() ?? 1; 

    $medico = Medicos::create([
        'nome'            => $validated['nome'],
        'crm'             => $validated['crm'],
        'data_nascimento' => $validated['data_nascimento'],
        'area'            => $validated['area'],
        'clinica_id'      => $clinicaId, 
    ]);
 
    return response()->json($medico, 201);
}

        public function show($id)
{
   $medico = Medicos::with(['pacientes'])->find($id);

   if (!$medico) {
           return response()->json(['message' => 'Médico não encontrado.'], 404);
        }

    return response()->json($medico);
}


    public function destroy($id)
    {
        $medico = Medicos::findOrFail($id);

        if ($medico->pacientes()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir: este médico possui pacientes vinculados.',
            ], 422);
        }

        $medico->delete();

        return response()->json(['message' => 'Médico removido com sucesso.']);
    }
}