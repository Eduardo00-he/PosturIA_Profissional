<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 
class Alertas extends Model
{
    use HasFactory;
 
    public const CREATED_AT = 'criado_em';
    public const UPDATED_AT = null;
 
    protected $fillable = [
        'paciente_id',
        'angulo_medido',
        'horas_uso_sessao',
        'status_ia',
        'descricao_alerta',
    ];
 
    public function paciente()
    {
        return $this->belongsTo(Pacientes::class, 'paciente_id');
    }
}
 