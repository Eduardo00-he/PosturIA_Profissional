<?php

namespace App\Http\Controllers;

use App\Models\Medicos;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MedicoController extends Controller
{
    public function index()
    {
        return response()->json(
            $this->accessibleMedicos()->with('pacientes')->limit(100)->get()
        );
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->isClinicAdmin(), 403);

        $validated = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
            'crm' => ['required', 'string', 'max:20', Rule::unique('medicos', 'crm')],
            'data_nascimento' => ['required', 'date', 'before_or_equal:today'],
            'area' => ['required', 'string', 'max:100'],
        ]);

        $medico = Medicos::create([...$validated, 'clinica_id' => $this->clinicId()]);

        return response()->json($medico, 201);
    }

    public function show(int $id)
    {
        return response()->json(
            $this->accessibleMedicos()->with('pacientes')->findOrFail($id)
        );
    }

    public function destroy(int $id)
    {
        abort_unless(request()->user()->isClinicAdmin(), 403);

        $medico = $this->accessibleMedicos()->findOrFail($id);

        if ($medico->pacientes()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir: este médico possui pacientes vinculados.',
            ], 422);
        }

        $medico->delete();

        return response()->json(['message' => 'Médico removido com sucesso.']);
    }
}
