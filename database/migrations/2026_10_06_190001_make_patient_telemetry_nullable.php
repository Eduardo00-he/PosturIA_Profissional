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
            $table->integer('status_conexao')->nullable()->default(null)->change();
            $table->decimal('postura_media_percentual', 5, 2)->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        $hasUnknownTelemetry = DB::table('pacientes')
            ->whereNull('status_conexao')
            ->orWhereNull('postura_media_percentual')
            ->exists();

        if ($hasUnknownTelemetry) {
            throw new RuntimeException('Não é possível reverter: pacientes sem telemetria usam valores nulos.');
        }

        Schema::table('pacientes', function (Blueprint $table) {
            $table->integer('status_conexao')->default(1)->nullable(false)->change();
            $table->decimal('postura_media_percentual', 5, 2)->default(0.00)->nullable(false)->change();
        });
    }
};
