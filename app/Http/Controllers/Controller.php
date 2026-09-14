<?php

namespace App\Http\Controllers;

use App\Models\Medicos;
use App\Models\Pacientes;
use Illuminate\Database\Eloquent\Builder;

abstract class Controller
{
    protected function clinicId(): int
    {
        $user = request()->user();

        abort_unless($user?->clinica_id, 403, 'Usuário sem clínica associada.');

        return (int) $user->clinica_id;
    }

    protected function accessibleMedicos(): Builder
    {
        $user = request()->user();
        $query = Medicos::query()->where('clinica_id', $this->clinicId());

        if ($user->isDoctor()) {
            $query->where('user_id', $user->id);
        }

        return $query;
    }

    protected function accessiblePacientes(): Builder
    {
        $query = Pacientes::query()->whereHas('medico', function (Builder $medicos): void {
            $medicos->where('clinica_id', $this->clinicId());
        });

        if (request()->user()->isDoctor()) {
            $query->whereHas('medico', function (Builder $medicos): void {
                $medicos->where('user_id', request()->user()->id);
            });
        }

        return $query;
    }
}
