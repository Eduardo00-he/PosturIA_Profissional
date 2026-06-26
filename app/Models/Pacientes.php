<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pacientes extends Model
{
    use HasFactory;

    protected $table = 'pacientes';

    protected $fillable = [
        'nome',
        'patologia',
        'medico_id',
        'status_conexao',
        'colete_horario_uso',
        'postura_media_percentual',
    ];

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
}