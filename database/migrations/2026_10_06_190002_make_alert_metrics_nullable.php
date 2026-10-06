<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alertas', function (Blueprint $table) {
            $table->float('angulo_medido')->nullable()->change();
            $table->integer('horas_uso_sessao')->nullable()->change();
            $table->string('status_ia')->nullable()->change();
        });
    }

    public function down(): void
    {
        $hasUnknownMetrics = DB::table('alertas')
            ->whereNull('angulo_medido')
            ->orWhereNull('horas_uso_sessao')
            ->orWhereNull('status_ia')
            ->exists();

        if ($hasUnknownMetrics) {
            throw new RuntimeException('Não é possível reverter: alertas sem telemetria usam métricas nulas.');
        }

        Schema::table('alertas', function (Blueprint $table) {
            $table->float('angulo_medido')->nullable(false)->change();
            $table->integer('horas_uso_sessao')->nullable(false)->change();
            $table->string('status_ia')->nullable(false)->change();
        });
    }
};
