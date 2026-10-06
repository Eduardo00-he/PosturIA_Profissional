<?php

namespace Tests\Feature;

use App\Models\Clinicas;
use App\Models\Medicos;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PosturiaAccountProvisioningTest extends TestCase
{
    use RefreshDatabase;

    public function test_cli_provisions_a_clinic_account_with_a_valid_server_side_profile(): void
    {
        $clinic = $this->clinic();

        $this->artisan('posturia:user:create')
            ->expectsChoice('Perfil da conta', User::ROLE_CLINICA, [User::ROLE_CLINICA, User::ROLE_MEDICO])
            ->expectsQuestion('Nome completo', 'Responsável da Clínica')
            ->expectsQuestion('E-mail', 'responsavel@example.test')
            ->expectsQuestion('ID da clínica', (string) $clinic->id)
            ->expectsQuestion('Senha inicial (mínimo de 12 caracteres)', 'SenhaForte-2026')
            ->expectsQuestion('Confirme a senha', 'SenhaForte-2026')
            ->assertSuccessful();

        $user = User::where('email', 'responsavel@example.test')->firstOrFail();
        $this->assertSame(User::ROLE_CLINICA, $user->role);
        $this->assertSame($clinic->id, $user->clinica_id);
        $this->assertTrue($user->hasValidPosturiaProfile());
    }

    public function test_cli_provisions_a_doctor_account_and_links_the_existing_doctor(): void
    {
        $clinic = $this->clinic();
        $doctor = Medicos::create([
            'nome' => 'Médica de Teste',
            'registro_profissional' => 'REG-'.uniqid(),
            'data_nascimento' => '1985-01-01',
            'area' => 'ortopedista',
            'clinica_id' => $clinic->id,
        ]);

        $this->artisan('posturia:user:create')
            ->expectsChoice('Perfil da conta', User::ROLE_MEDICO, [User::ROLE_CLINICA, User::ROLE_MEDICO])
            ->expectsQuestion('Nome completo', 'Médica de Teste')
            ->expectsQuestion('E-mail', 'medica@example.test')
            ->expectsQuestion('ID da clínica', (string) $clinic->id)
            ->expectsQuestion('ID do médico vinculado', (string) $doctor->id)
            ->expectsQuestion('Senha inicial (mínimo de 12 caracteres)', 'SenhaForte-2026')
            ->expectsQuestion('Confirme a senha', 'SenhaForte-2026')
            ->assertSuccessful();

        $user = User::where('email', 'medica@example.test')->firstOrFail();
        $this->assertSame(User::ROLE_MEDICO, $user->role);
        $this->assertSame($clinic->id, $user->clinica_id);
        $this->assertTrue($user->hasValidPosturiaProfile());
        $this->assertDatabaseHas('medicos', [
            'id' => $doctor->id,
            'user_id' => $user->id,
        ]);
    }

    private function clinic(): Clinicas
    {
        return Clinicas::create(['nome' => 'Clínica Provisionamento', 'cidade' => 'Belo Horizonte']);
    }
}
