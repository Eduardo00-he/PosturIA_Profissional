<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    public const ROLE_MEDICO = 'medico';
    public const ROLE_CLINICA = 'clinica';

    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function clinica(): BelongsTo
    {
        return $this->belongsTo(Clinicas::class, 'clinica_id');
    }

    public function medico(): HasOne
    {
        return $this->hasOne(Medicos::class, 'user_id');
    }

    public function hasValidPosturiaProfile(): bool
    {
        if (! $this->clinica_id || ! $this->clinica()->exists()) {
            return false;
        }

        if ($this->role === self::ROLE_CLINICA) {
            return ! $this->medico()->exists();
        }

        if ($this->role !== self::ROLE_MEDICO) {
            return false;
        }

        $medico = $this->medico()->first();

        return $medico !== null && (int) $medico->clinica_id === (int) $this->clinica_id;
    }
}
