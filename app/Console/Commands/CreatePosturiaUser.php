<?php

namespace App\Console\Commands;

use App\Models\Clinicas;
use App\Models\Medicos;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreatePosturiaUser extends Command
{
    protected $signature = 'posturia:user:create';

    protected $description = 'Provisiona uma conta PosturIA de clínica ou médico';

    public function handle(): int
    {
        $role = $this->choice('Perfil da conta', [User::ROLE_CLINICA, User::ROLE_MEDICO]);
        $name = trim((string) $this->ask('Nome completo'));
        $email = mb_strtolower(trim((string) $this->ask('E-mail')));
        $clinicId = filter_var($this->ask('ID da clínica'), FILTER_VALIDATE_INT);

        $validator = Validator::make(
            ['name' => $name, 'email' => $email, 'clinica_id' => $clinicId],
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'clinica_id' => ['required', 'integer', 'min:1', 'exists:clinicas,id'],
            ]
        );

        if ($validator->fails()) {
            $this->error($validator->errors()->first());
            return self::FAILURE;
        }

        $medicoId = null;
        if ($role === User::ROLE_MEDICO) {
            $medicoId = filter_var($this->ask('ID do médico vinculado'), FILTER_VALIDATE_INT);
            if (! $medicoId || $medicoId < 1) {
                $this->error('Informe um ID de médico válido.');
                return self::FAILURE;
            }
        }

        $password = (string) $this->secret('Senha inicial (mínimo de 12 caracteres)');
        $confirmation = (string) $this->secret('Confirme a senha');

        if (mb_strlen($password) < 12 || ! hash_equals($password, $confirmation)) {
            $this->error('A senha precisa ter ao menos 12 caracteres e coincidir com a confirmação.');
            return self::FAILURE;
        }

        $created = DB::transaction(function () use ($name, $email, $password, $role, $clinicId, $medicoId): bool {
            // Serializa provisionamentos concorrentes para a mesma clínica.
            $clinic = Clinicas::query()->lockForUpdate()->find($clinicId);
            if (! $clinic) {
                $this->error('A clínica informada não existe mais.');
                return false;
            }

            if ($role === User::ROLE_CLINICA
                && User::where('role', User::ROLE_CLINICA)->where('clinica_id', $clinic->id)->exists()) {
                $this->error('Esta clínica já possui uma conta de acesso.');
                return false;
            }

            $medico = null;
            if ($role === User::ROLE_MEDICO) {
                $medico = Medicos::query()
                    ->where('clinica_id', $clinic->id)
                    ->whereNull('user_id')
                    ->lockForUpdate()
                    ->find($medicoId);

                if (! $medico) {
                    $this->error('O médico não existe nesta clínica ou já possui uma conta.');
                    return false;
                }
            }

            $user = new User();
            $user->forceFill([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => $role,
                'clinica_id' => $clinic->id,
            ]);
            $user->save();

            if ($medico) {
                $medico->user()->associate($user);
                $medico->save();
            }

            return true;
        });

        if (! $created) {
            return self::FAILURE;
        }

        $this->info('Conta provisionada com sucesso. Entregue a senha inicial ao titular por um canal seguro e solicite a troca no primeiro acesso.');

        return self::SUCCESS;
    }
}
