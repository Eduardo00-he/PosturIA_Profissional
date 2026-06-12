<?php

namespace App\Models; // <--- Certifique-se de que está assim, sem repetições

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pacientes extends Model
{
    use HasFactory;

    // Força o modelo a usar a tabela correta no banco de dados
    protected $table = 'pacientes'; 

    protected $fillable = [
        'nome', 
        'patologia', 
        'medico_id', 
        'status_conexao',
        'colete_horario_uso',
        'postura_media_percentual'
    ];
}