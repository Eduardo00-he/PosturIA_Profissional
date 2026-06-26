<?php

namespace App\Models;

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
    ];

    public function paciente()
    {
        return $this->belongsTo(Pacientes::class, 'paciente_id');
    }
}