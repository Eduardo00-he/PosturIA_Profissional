<?php
namespace App\Http\Controllers;

use App\Models\Pacientes;
use Illuminate\Http\Request;

class PacienteController extends Controller
{
    public function index()
    {
        return response()->json(Pacientes::with('medico')->get());
    }

    public function store(Request $request)
{
    $request->validate([
        'nome' => 'required|string|max:255',
        'patologia' => 'required|string|max:255',
    ]);

    $paciente = Pacientes::create([
        'nome' => $request->nome,
        'patologia' => $request->patologia,
        'medico_id' => null, 
        'status_conexao' => 0, // Alinhado com o HeidiSQL
        'colete_horario_uso' => null, // Alinhado com o HeidiSQL
        'postura_media_percentual' => 0.00 // Alinhado com o HeidiSQL
    ]);

    return response()->json($paciente, 201);
}
}