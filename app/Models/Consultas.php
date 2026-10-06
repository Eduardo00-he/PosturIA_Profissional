<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultas extends Model
{
    use HasFactory;

    protected $table = 'consultas';

    protected $fillable = [
        'paciente_id',
        'medico_id',
        'data_hora',
        'observacao',
    ];

    protected function casts(): array
    {
        return ['data_hora' => 'datetime'];
    }

    public function paciente()
    {
        return $this->belongsTo(Pacientes::class, 'paciente_id');
    }

    public function medico()
    {
        return $this->belongsTo(Medicos::class, 'medico_id');
    }

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        return $query
            ->whereHas('paciente', fn (Builder $patients) => $patients->visibleTo($user))
            ->whereHas('medico', fn (Builder $medicos) => $medicos->visibleTo($user));
    }
}
