<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicos extends Model
{
    use HasFactory;

    protected $table = 'medicos';

    protected $fillable = [
        'nome',
        'crm',
        'area',
        'data_nascimento', // ADICIONADO AQUI!
    ];

    public function clinica()
    {
        return $this->belongsTo(Clinicas::class, 'clinica_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function pacientes()
    {
        return $this->hasMany(Pacientes::class, 'medico_id');
    }

    public function consultas()
    {
        return $this->hasMany(Consultas::class, 'medico_id');
    }
}
