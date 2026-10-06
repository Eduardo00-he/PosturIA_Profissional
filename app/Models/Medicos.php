<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicos extends Model
{
    use HasFactory;

    protected $table = 'medicos';

    protected $fillable = [
        'nome',
        'registro_profissional',
        'area',
        'clinica_id',
        'user_id',
        'data_nascimento',
    ];

    protected $hidden = ['user_id'];

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

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if ($user->role === User::ROLE_MEDICO) {
            return $query->where('user_id', $user->id);
        }

        if ($user->role === User::ROLE_CLINICA && $user->clinica_id) {
            return $query->where('clinica_id', $user->clinica_id);
        }

        return $query->whereRaw('1 = 0');
    }
}
