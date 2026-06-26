<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Clinicas;
use App\Models\Medicos;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\MedicoController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\HistoricoPosturaController;
use App\Http\Controllers\AlertaController;

// ÁREA DO MÉDICO / CLÍNICA (resumo com relações)
Route::get('/medico/{id}/dashboard', function ($id) {
    return Medicos::with('pacientes.alertas')->findOrFail($id);
});

Route::get('/clinica/{id}/dashboard', function ($id) {
    return Clinicas::with('medicos.pacientes')->findOrFail($id);
});

// PACIENTES
Route::get('/pacientes', [PacienteController::class, 'index']);
Route::post('/pacientes', [PacienteController::class, 'store']);

// MÉDICOS
Route::get('/medicos', [MedicoController::class, 'index']);
Route::get('/medicos/{id}', [MedicoController::class, 'show']);
Route::post('/medicos', [MedicoController::class, 'store']);
Route::delete('/medicos/{id}', [MedicoController::class, 'destroy']);

// CONSULTAS (agenda do médico)
Route::get('/consultas', [ConsultaController::class, 'index']);
Route::post('/consultas', [ConsultaController::class, 'store']);
Route::delete('/consultas/{id}', [ConsultaController::class, 'destroy']);

// HISTÓRICO DE POSTURA (relatórios e métricas)
Route::get('/historico-postura', [HistoricoPosturaController::class, 'index']);
Route::post('/historico-postura', [HistoricoPosturaController::class, 'store']);

// ALERTAS
Route::get('/alertas', [AlertaController::class, 'index']);
Route::post('/alertas', [AlertaController::class, 'store']);