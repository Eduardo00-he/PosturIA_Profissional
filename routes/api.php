<?php

use App\Http\Controllers\AlertaController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\HistoricoPosturaController;
use App\Http\Controllers\MedicoController;
use App\Http\Controllers\PacienteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'verified', 'throttle:60,1'])->group(function (): void {
    Route::get('/medico/{id}/dashboard', function (int $id) {
        $medico = app(MedicoController::class)->show($id);

        return $medico;
    });

    Route::get('/clinica/{id}/dashboard', function (int $id) {
        abort_unless(request()->user()->isClinicAdmin(), 403);
        abort_unless((int) request()->user()->clinica_id === $id, 403);

        return response()->json(
            request()->user()->clinica->load('medicos.pacientes')
        );
    });

    Route::get('/pacientes', [PacienteController::class, 'index']);
    Route::post('/pacientes', [PacienteController::class, 'store']);

    Route::get('/medicos', [MedicoController::class, 'index']);
    Route::get('/medicos/{id}', [MedicoController::class, 'show']);
    Route::post('/medicos', [MedicoController::class, 'store']);
    Route::delete('/medicos/{id}', [MedicoController::class, 'destroy']);

    Route::get('/consultas', [ConsultaController::class, 'index']);
    Route::post('/consultas', [ConsultaController::class, 'store']);
    Route::delete('/consultas/{id}', [ConsultaController::class, 'destroy']);

    Route::get('/historico-postura', [HistoricoPosturaController::class, 'index']);
    Route::post('/historico-postura', [HistoricoPosturaController::class, 'store']);

    Route::get('/alertas', [AlertaController::class, 'index']);
    Route::post('/alertas', [AlertaController::class, 'store']);
});
