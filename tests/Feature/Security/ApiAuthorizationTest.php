<?php

namespace Tests\Feature\Security;

use App\Models\Clinicas;
use App\Models\Medicos;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_clinical_api_requires_authentication(): void
    {
        $this->getJson('/api/medicos')->assertUnauthorized();
        $this->postJson('/api/pacientes', [])->assertUnauthorized();
    }

    public function test_security_headers_are_present(): void
    {
        $this->get('/')->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_user_without_clinic_cannot_access_clinical_api(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/medicos')
            ->assertForbidden();
    }

    public function test_clinic_admin_only_sees_doctors_from_own_clinic(): void
    {
        $ownClinic = Clinicas::create(['nome' => 'Clínica A', 'cidade' => 'Belo Horizonte']);
        $otherClinic = Clinicas::create(['nome' => 'Clínica B', 'cidade' => 'São Paulo']);
        $user = User::factory()->create();
        $user->forceFill(['clinica_id' => $ownClinic->id, 'role' => 'clinic_admin'])->save();

        $ownDoctor = Medicos::forceCreate([
            'nome' => 'Médico A', 'crm' => 'CRM-A', 'area' => 'Ortopedia',
            'clinica_id' => $ownClinic->id, 'data_nascimento' => '1980-01-01',
        ]);
        Medicos::forceCreate([
            'nome' => 'Médico B', 'crm' => 'CRM-B', 'area' => 'Fisioterapia',
            'clinica_id' => $otherClinic->id, 'data_nascimento' => '1980-01-01',
        ]);

        $response = $this->actingAs($user)->getJson('/api/medicos')->assertOk();

        $response->assertJsonCount(1);
        $response->assertJsonFragment(['id' => $ownDoctor->id]);
        $response->assertJsonMissing(['crm' => 'CRM-B']);
    }

    public function test_admin_dashboard_cannot_be_selected_for_another_clinic(): void
    {
        $ownClinic = Clinicas::create(['nome' => 'Clínica A', 'cidade' => 'Belo Horizonte']);
        $otherClinic = Clinicas::create(['nome' => 'Clínica B', 'cidade' => 'São Paulo']);
        $user = User::factory()->create();
        $user->forceFill(['clinica_id' => $ownClinic->id, 'role' => 'clinic_admin'])->save();

        $this->actingAs($user)
            ->getJson('/api/clinica/'.$otherClinic->id.'/dashboard')
            ->assertForbidden();
    }
}
