<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 
class Medicos extends Model
{
    use HasFactory;
 
    protected $table = 'medicos';
 
    protected $fillable = [
        'id',
        'nome',
        'idade',
        'crm',
        'area',
        'clinica_id',
    ];
 
    public function clinica()
    {
        return $this->belongsTo(Clinicas::class, 'clinica_id');
    }
 
    public function pacientes()
    {
        return $this->hasMany(Pacientes::class, 'medico_id');
    }
}
 