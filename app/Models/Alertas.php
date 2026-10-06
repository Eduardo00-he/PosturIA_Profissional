<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alertas extends Model
{
    use HasFactory;

    protected $table = 'alertas';

    public const CREATED_AT = 'criado_em';
    public const UPDATED_AT = null;

    protected $fillable = [
        'paciente_id',
        'descricao_alerta',
        'angulo_medido',
        'horas_uso_sessao',
        'status_ia',
    ];

    protected function casts(): array
    {
        return [
            'angulo_medido' => 'decimal:2',
            'horas_uso_sessao' => 'integer',
            'verificado' => 'boolean',
            'registrado_por' => 'integer',
            'criado_em' => 'datetime',
        ];
    }

    public function pacientes()
    {
        return $this->belongsTo(Pacientes::class, 'paciente_id');
    }

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        return $query->whereHas('pacientes', fn (Builder $patients) => $patients->visibleTo($user));
    }
}
