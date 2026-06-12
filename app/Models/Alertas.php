<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alertas extends Model
{
    use HasFactory;

    public const CREATED_AT = 'criado_em';
    public const UPDATED_AT = null;

    protected $fillable = ['paciente_id', 'descricao_alerta'];

    public function pacientes()
    {
        return $this->belongsTo(Pacientes::class);
    }
}