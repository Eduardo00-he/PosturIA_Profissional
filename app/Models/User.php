<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function clinica()
    {
        return $this->belongsTo(Clinicas::class, 'clinica_id');
    }

    public function medico()
    {
        return $this->hasOne(Medicos::class, 'user_id');
    }

    public function isClinicAdmin(): bool
    {
        return in_array($this->role, ['clinic_admin', 'clinica'], true);
    }

    public function isDoctor(): bool
    {
        return in_array($this->role, ['doctor', 'medico'], true);
    }
}
