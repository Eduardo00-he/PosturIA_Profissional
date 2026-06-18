<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 
class Pacientes extends Model
{
    use HasFactory;
 
    // Força o modelo a usar a tabela correta no banco de dados
    protected $table = 'pacientes';
 
    protected $fillable = [
        'id',
        'nome',
        'idade',
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
}
 