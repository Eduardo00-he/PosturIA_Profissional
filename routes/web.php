<?php

use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Welcome'))->name('home');

Route::get('/admin', function (Request $request) {
    $user = $request->user();

    return Inertia::render('Admin', [
        'role' => $user->role,
        'medicoId' => $user->medico?->id,
        'userName' => $user->name,
        'clinicName' => $user->clinica?->nome,
    ]);
})->middleware(['auth', 'posturia.role:medico,clinica'])->name('admin');

Route::get('/dashboard', fn () => redirect()->route('admin'))
    ->middleware(['auth', 'posturia.role:medico,clinica'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
