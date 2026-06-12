<?php

namespace App\Models; // <--- GARANTA QUE ESTÁ APENAS ASSIM

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicos extends Model
{
    use HasFactory;

    protected $table = 'medicos';

    protected $fillable = [
        'id',
        'nome',
        'crm',
        'clinica_id'
    ];
}