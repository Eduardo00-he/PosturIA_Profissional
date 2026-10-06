<?php

namespace Tests\Feature;

use App\Models\Alertas;
use App\Models\Clinicas;
use App\Models\HistoricoPostura;
use App\Models\Medicos;
use App\Models\Pacientes;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PosturiaAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_read_clinical_api(): void
    {
        $this->getJson('/api/pacientes')->assertUnauthorized();
    }

    public function test_clinic_cannot_list_or_create_patients_for_another_clinic(): void
    {
        $clinicA = $this->clinic('Clínica A');
        $clinicB = $this->clinic('Clínica B');
        $clinicUserA = $this->clinicUser($clinicA);
        $doctorB = $this->doctor($clinicB);

        $this->actingAs($clinicUserA)
            ->getJson('/api/pacientes?medico_id='.$doctorB->id)
            ->assertOk()
            ->assertExactJson([]);

        $this->actingAs($clinicUserA)
            ->postJson('/api/pacientes', [
                'nome' => 'Paciente indevido',
                'data_nascimento' => '1990-01-01',
                'patologia' => 'Teste',
                'medico_id' => $doctorB->id,
            ])
            ->assertNotFound();

        $this->actingAs($clinicUserA)
            ->postJson('/api/pacientes', [
                'nome' => 'Paciente inexistente',
                'data_nascimento' => '1990-01-01',
                'patologia' => 'Teste',
                'medico_id' => 999999,
            ])
            ->assertNotFound();

        $this->assertDatabaseMissing('pacientes', ['nome' => 'Paciente indevido']);
    }

    public function test_doctor_cannot_read_another_doctors_record_or_patient_history(): void
    {
        $clinic = $this->clinic('Clínica Compartilhada');
        [$doctorUserA, $doctorA] = $this->doctorWithAccount($clinic, 'A');
        [$doctorUserB, $doctorB] = $this->doctorWithAccount($clinic, 'B');
        $patientB = $this->patient($doctorB);

        $this->actingAs($doctorUserA)
            ->getJson('/api/medicos/'.$doctorB->id)
            ->assertNotFound();

        $this->actingAs($doctorUserA)
            ->postJson('/api/historico-postura', [
                'paciente_id' => $patientB->id,
                'percentual' => 70,
            ])
            ->assertNotFound();

        $this->actingAs($doctorUserA)
            ->getJson('/api/historico-postura?paciente_id='.$patientB->id)
            ->assertNotFound();

        $this->actingAs($doctorUserA)
            ->getJson('/api/historico-postura?paciente_id=999999')
            ->assertNotFound();

        $this->actingAs($doctorUserA)
            ->postJson('/api/consultas', [
                'paciente_id' => $patientB->id,
                'medico_id' => $doctorB->id,
                'data_hora' => now()->addDay()->toIso8601String(),
            ])
            ->assertNotFound();

        $this->actingAs($doctorUserA)
            ->postJson('/api/consultas', [
                'paciente_id' => 999999,
                'medico_id' => 999999,
                'data_hora' => now()->addDay()->toIso8601String(),
            ])
            ->assertNotFound();

        $this->assertDatabaseMissing('historico_postura', ['paciente_id' => $patientB->id]);
    }

    public function test_role_query_parameter_cannot_change_server_assigned_profile(): void
    {
        $clinic = $this->clinic('Clínica Médica');
        [$doctorUser, $doctor] = $this->doctorWithAccount($clinic, 'C');

        $this->actingAs($doctorUser)
            ->get('/admin?role=clinica')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin')
                ->where('role', User::ROLE_MEDICO)
                ->where('medicoId', $doctor->id));
    }

    public function test_clinic_cannot_open_another_clinics_dashboard(): void
    {
        $clinicA = $this->clinic('Clínica A');
        $clinicB = $this->clinic('Clínica B');

        $this->actingAs($this->clinicUser($clinicA))
            ->getJson('/api/clinica/'.$clinicB->id.'/dashboard')
            ->assertNotFound();
    }

    public function test_unverified_legacy_metrics_and_history_are_not_returned_as_real_data(): void
    {
        $clinic = $this->clinic('Clínica de Telemetria');
        [$doctorUser, $doctor] = $this->doctorWithAccount($clinic, 'D');
        $patient = Pacientes::create([
            'nome' => 'Paciente legado',
            'data_nascimento' => '1990-01-01',
            'patologia' => 'Teste',
            'medico_id' => $doctor->id,
            'status_conexao' => 1,
            'postura_media_percentual' => 88,
        ]);

        HistoricoPostura::create([
            'paciente_id' => $patient->id,
            'percentual' => 88,
            'registrado_em' => now()->subDay(),
        ]);

        $this->actingAs($doctorUser)
            ->getJson('/api/pacientes?medico_id='.$doctor->id)
            ->assertOk()
            ->assertJsonPath('0.status_conexao', null)
            ->assertJsonPath('0.postura_media_percentual', null);

        $this->actingAs($doctorUser)
            ->getJson('/api/historico-postura?paciente_id='.$patient->id)
            ->assertOk()
            ->assertExactJson([]);
    }

    public function test_professional_recorded_measurement_is_verified_and_audited(): void
    {
        $clinic = $this->clinic('Clínica de Medição');
        [$doctorUser, $doctor] = $this->doctorWithAccount($clinic, 'E');
        $patient = $this->patient($doctor);

        $this->actingAs($doctorUser)
            ->postJson('/api/historico-postura', [
                'paciente_id' => $patient->id,
                'percentual' => 76.5,
            ])
            ->assertCreated()
            ->assertJsonPath('verificado', true)
            ->assertJsonPath('registrado_por', $doctorUser->id);

        $this->assertDatabaseHas('historico_postura', [
            'paciente_id' => $patient->id,
            'registrado_por' => $doctorUser->id,
            'verificado' => true,
        ]);
        $this->assertDatabaseHas('pacientes', [
            'id' => $patient->id,
            'medicao_postural_verificada' => true,
            'postura_media_percentual' => 76.5,
        ]);
    }

    public function test_dashboard_returns_only_verified_alerts_and_clients_cannot_create_ai_alerts(): void
    {
        $clinic = $this->clinic('Clínica de Alertas');
        [$doctorUser, $doctor] = $this->doctorWithAccount($clinic, 'F');
        $patient = $this->patient($doctor);

        Alertas::create([
            'paciente_id' => $patient->id,
            'descricao_alerta' => 'Alerta de demonstração',
        ]);

        $verified = Alertas::create([
            'paciente_id' => $patient->id,
            'descricao_alerta' => 'Alerta autorizado',
            'angulo_medido' => 30,
            'horas_uso_sessao' => 2,
            'status_ia' => 'validado',
        ]);
        $verified->forceFill(['verificado' => true])->save();

        $response = $this->actingAs($doctorUser)
            ->getJson('/api/medico/'.$doctor->id.'/dashboard')
            ->assertOk();

        $alerts = $response->json('pacientes.0.alertas');
        $this->assertCount(1, $alerts);
        $this->assertSame($verified->id, $alerts[0]['id']);

        $this->actingAs($doctorUser)
            ->postJson('/api/alertas', [
                'paciente_id' => $patient->id,
                'descricao_alerta' => 'Status de IA forjado pelo cliente',
                'status_ia' => 'normal',
            ])
            ->assertStatus(405);
    }

    public function test_aggregate_history_uses_only_verified_data_visible_to_the_current_doctor(): void
    {
        $clinicA = $this->clinic('Clínica Agregada A');
        $clinicB = $this->clinic('Clínica Agregada B');
        [$doctorUserA, $doctorA] = $this->doctorWithAccount($clinicA, 'G');
        [, $doctorB] = $this->doctorWithAccount($clinicB, 'H');
        $patientA = $this->patient($doctorA);
        $patientB = $this->patient($doctorB);

        HistoricoPostura::create([
            'paciente_id' => $patientA->id,
            'percentual' => 60,
            'registrado_em' => now(),
            'verificado' => true,
        ]);
        HistoricoPostura::create([
            'paciente_id' => $patientA->id,
            'percentual' => 99,
            'registrado_em' => now(),
        ]);
        HistoricoPostura::create([
            'paciente_id' => $patientB->id,
            'percentual' => 99,
            'registrado_em' => now(),
            'verificado' => true,
        ]);

        $response = $this->actingAs($doctorUserA)
            ->getJson('/api/historico-postura/agregado')
            ->assertOk()
            ->assertJsonCount(1);

        $this->assertEquals(60, $response->json('0.percentual'));
    }

    private function clinic(string $name): Clinicas
    {
        return Clinicas::create(['nome' => $name, 'cidade' => 'Belo Horizonte']);
    }

    private function clinicUser(Clinicas $clinic): User
    {
        $user = User::factory()->create();
        $user->forceFill([
            'role' => User::ROLE_CLINICA,
            'clinica_id' => $clinic->id,
        ])->save();

        return $user;
    }

    private function doctor(Clinicas $clinic): Medicos
    {
        return Medicos::create([
            'nome' => 'Médico sem conta',
            'registro_profissional' => 'REG-'.uniqid(),
            'data_nascimento' => '1985-01-01',
            'area' => 'ortopedista',
            'clinica_id' => $clinic->id,
        ]);
    }

    /** @return array{User, Medicos} */
    private function doctorWithAccount(Clinicas $clinic, string $suffix): array
    {
        $user = User::factory()->create();
        $user->forceFill([
            'role' => User::ROLE_MEDICO,
            'clinica_id' => $clinic->id,
        ])->save();

        $doctor = Medicos::create([
            'nome' => 'Médico '.$suffix,
            'registro_profissional' => 'REG-'.$suffix.'-'.uniqid(),
            'data_nascimento' => '1985-01-01',
            'area' => 'ortopedista',
            'clinica_id' => $clinic->id,
            'user_id' => $user->id,
        ]);

        return [$user, $doctor];
    }

    private function patient(Medicos $doctor): Pacientes
    {
        return Pacientes::create([
            'nome' => 'Paciente '.$doctor->id,
            'data_nascimento' => '1990-01-01',
            'patologia' => 'Teste',
            'medico_id' => $doctor->id,
            'status_conexao' => null,
            'postura_media_percentual' => null,
        ]);
    }
}
