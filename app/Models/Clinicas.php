<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 
class Clinicas extends Model
{
    use HasFactory;
 
    protected $table = 'clinicas';
 
    protected $fillable = ['nome', 'cidade'];
 
    public function medicos()
    {
        return $this->hasMany(Medicos::class, 'clinica_id');
    }
}
 