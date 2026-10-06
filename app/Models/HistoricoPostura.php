<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricoPostura extends Model
{
    use HasFactory;

    protected $table = 'historico_postura';

    public $timestamps = false;

    protected $fillable = [
        'paciente_id',
        'percentual',
        'registrado_em',
        'verificado',
        'registrado_por',
    ];

    protected function casts(): array
    {
        return [
            'percentual' => 'decimal:2',
            'registrado_em' => 'datetime',
            'verificado' => 'boolean',
        ];
    }

    public function paciente()
    {
        return $this->belongsTo(Pacientes::class, 'paciente_id');
    }

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        return $query->whereHas('paciente', fn (Builder $patients) => $patients->visibleTo($user));
    }
}
