<?php

use App\Http\Controllers\AlertaController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\HistoricoPosturaController;
use App\Http\Controllers\MedicoController;
use App\Http\Controllers\PacienteController;
use App\Models\Clinicas;
use App\Models\Medicos;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'posturia.role:medico,clinica'])->group(function () {
    Route::get('/medico/{id}/dashboard', function (Request $request, int $id) {
        return Medicos::visibleTo($request->user())
            ->with(['pacientes.alertas' => fn ($query) => $query->where('verificado', true)])
            ->findOrFail($id);
    });

    Route::get('/clinica/{id}/dashboard', function (Request $request, int $id) {
        abort_unless(
            $request->user()->role === User::ROLE_CLINICA
                && (int) $request->user()->clinica_id === $id,
            404
        );

        return Clinicas::with('medicos.pacientes')->findOrFail($id);
    })->middleware('posturia.role:clinica');

    Route::get('/pacientes', [PacienteController::class, 'index']);
    Route::post('/pacientes', [PacienteController::class, 'store']);

    Route::get('/medicos', [MedicoController::class, 'index']);
    Route::get('/medicos/{id}', [MedicoController::class, 'show']);
    Route::post('/medicos', [MedicoController::class, 'store'])->middleware('posturia.role:clinica');
    Route::delete('/medicos/{id}', [MedicoController::class, 'destroy'])->middleware('posturia.role:clinica');

    Route::get('/consultas', [ConsultaController::class, 'index']);
    Route::post('/consultas', [ConsultaController::class, 'store']);
    Route::delete('/consultas/{id}', [ConsultaController::class, 'destroy']);

    Route::get('/historico-postura', [HistoricoPosturaController::class, 'index']);
    Route::get('/historico-postura/agregado', [HistoricoPosturaController::class, 'aggregate']);
    Route::post('/historico-postura', [HistoricoPosturaController::class, 'store']);

    Route::get('/alertas', [AlertaController::class, 'index']);
});
