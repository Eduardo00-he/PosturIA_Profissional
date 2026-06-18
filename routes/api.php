<?php
 
use Illuminate\Support\Facades\Route;
use App\Models\Clinicas;
use App\Models\Medicos;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\MedicoController;
use App\Http\Controllers\AuthController;
 
// ─── AUTENTICAÇÃO ───────────────────────────────────────────────
// Valida o login único da clínica (eduardo0 / posturia0) no servidor.
Route::post('/login', [AuthController::class, 'login']);
 
// ─── ÁREA DO MÉDICO ─────────────────────────────────────────────
// Busca o médico trazendo todos os seus pacientes e os alertas de cada um.
Route::get('/medico/{id}/dashboard', function ($id) {
    return Medicos::with('pacientes.alertas')->findOrFail($id);
});
 
// ─── ÁREA DA CLÍNICA ────────────────────────────────────────────
// Busca a clínica trazendo todos os médicos vinculados a ela e os
// pacientes correspondentes a cada médico.
Route::get('/clinica/{id}/dashboard', function ($id) {
    return Clinicas::with('medicos.pacientes')->findOrFail($id);
});
 
// ─── PACIENTES ──────────────────────────────────────────────────
// GET /pacientes?medico_id=4 -> filtra apenas os pacientes daquele médico.
Route::get('/pacientes', [PacienteController::class, 'index']);
Route::post('/pacientes', [PacienteController::class, 'store']);
 
// ─── MÉDICOS ────────────────────────────────────────────────────
// Lista os médicos da clínica única, usada tanto no painel da Clínica
// quanto para popular as opções de login dinâmicas na Área do Médico.
Route::get('/medicos', [MedicoController::class, 'index']);
Route::get('/medicos/{id}', [MedicoController::class, 'show']);
Route::post('/medicos', [MedicoController::class, 'store']);
Route::delete('/medicos/{id}', [MedicoController::class, 'destroy']);
 