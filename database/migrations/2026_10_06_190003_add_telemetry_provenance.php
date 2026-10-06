<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->boolean('telemetria_verificada')->default(false)->after('status_conexao');
            $table->boolean('medicao_postural_verificada')->default(false)->after('postura_media_percentual');
        });

        Schema::table('historico_postura', function (Blueprint $table) {
            $table->boolean('verificado')->default(false)->after('registrado_em');
            $table->foreignId('registrado_por')->nullable()->after('verificado')
                ->constrained('users')->nullOnDelete();
        });

        Schema::table('alertas', function (Blueprint $table) {
            $table->boolean('verificado')->default(false)->after('status_ia');
            $table->foreignId('registrado_por')->nullable()->after('verificado')
                ->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        $verifiedPatients = DB::table('pacientes')
            ->where('telemetria_verificada', true)
            ->orWhere('medicao_postural_verificada', true)
            ->exists();
        $verifiedHistory = DB::table('historico_postura')->where('verificado', true)->exists();
        $verifiedAlerts = DB::table('alertas')->where('verificado', true)->exists();

        if ($verifiedPatients || $verifiedHistory || $verifiedAlerts) {
            throw new RuntimeException('Não é possível reverter: existem medições ou registros verificados.');
        }

        Schema::table('historico_postura', function (Blueprint $table) {
            $table->dropForeign(['registrado_por']);
            $table->dropColumn(['registrado_por', 'verificado']);
        });

        Schema::table('alertas', function (Blueprint $table) {
            $table->dropForeign(['registrado_por']);
            $table->dropColumn(['registrado_por', 'verificado']);
        });

        Schema::table('pacientes', function (Blueprint $table) {
            $table->dropColumn(['telemetria_verificada', 'medicao_postural_verificada']);
        });
    }
};
