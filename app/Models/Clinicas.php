<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clinicas extends Model
{
    use HasFactory;

    // Se a tabela no banco de dados se chamar 'clinicas', garanta que o Eloquent sabe disso:
    protected $table = 'clinicas';

    // Desativa completamente o gerenciamento automático se não tiver timestamps na tabela,
    // OU simplesmente remova esta linha se a tabela tiver os campos 'created_at' e 'updated_at' padrão.
    public $timestamps = false;

    protected $fillable = ['nome', 'cidade'];

    public function medicos()
    {
        return $this->hasMany(Medicos::class, 'clinica_id');
    }
}