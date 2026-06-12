<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Clinicas; // Alterado para o plural correto
use App\Models\Medicos;  // Alterado para o plural correto
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\MedicoController;

// 1. ÁREA DO MÉDICO: Busca o médico (ID 1) trazendo todos os seus pacientes e os alertas de cada um
Route::get('/medico/{id}/dashboard', function ($id) {
    return Medicos::with('pacientes.alertas')->findOrFail($id); // Alterado para Medicos
});

// 2. ÁREA DA CLÍNICA: Busca a clínica (ID 1) trazendo todos os médicos vinculados a ela e a lista de pacientes correspondente
Route::get('/clinica/{id}/dashboard', function ($id) {
    return Clinicas::with('medicos.pacientes')->findOrFail($id); // Alterado para Clinicas
});

Route::get('/pacientes', [PacienteController::class, 'index']);
Route::post('/pacientes', [PacienteController::class, 'store']);

Route::get('/medicos', [MedicoController::class, 'index']);
Route::post('/medicos', [MedicoController::class, 'store']);