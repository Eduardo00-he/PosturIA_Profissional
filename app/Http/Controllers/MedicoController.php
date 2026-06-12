<?php
namespace App\Http\Controllers;

use App\Models\Medico;
use Illuminate\Http\Request;

class MedicoController extends Controller
{
    public function index()
    {
        return response()->json(Medico::with('pacientes')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'crm' => 'required|string|unique:medicos',
            'clinica_id' => 'required|exists:clinicas,id',
        ]);

        $medico = Medico::create($request->only('nome', 'crm', 'clinica_id'));

        return response()->json($medico, 201);
    }
}