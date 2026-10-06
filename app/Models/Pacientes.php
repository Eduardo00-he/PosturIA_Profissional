<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pacientes extends Model
{
    use HasFactory;

    protected $table = 'pacientes';

    protected $fillable = [
        'nome',
        'data_nascimento',
        'patologia',
        'medico_id',
        'status_conexao',
        'colete_horario_uso',
        'postura_media_percentual',
    ];

    protected function casts(): array
    {
        return [
            'data_nascimento' => 'date',
            'status_conexao' => 'integer',
            'telemetria_verificada' => 'boolean',
            'medicao_postural_verificada' => 'boolean',
            'colete_horario_uso' => 'datetime',
            'postura_media_percentual' => 'decimal:2',
        ];
    }

    public function medico()
    {
        return $this->belongsTo(Medicos::class, 'medico_id');
    }

    public function alertas()
    {
        return $this->hasMany(Alertas::class, 'paciente_id');
    }

    public function consultas()
    {
        return $this->hasMany(Consultas::class, 'paciente_id');
    }

    public function historicoPostura()
    {
        return $this->hasMany(HistoricoPostura::class, 'paciente_id')->orderBy('registrado_em');
    }

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        return $query->whereHas('medico', fn (Builder $medicos) => $medicos->visibleTo($user));
    }

    public function getStatusConexaoAttribute($value): ?int
    {
        return $this->telemetria_verificada ? $value : null;
    }

    public function getPosturaMediaPercentualAttribute($value): ?string
    {
        return $this->medicao_postural_verificada ? $value : null;
    }
}
