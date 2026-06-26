<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historico_postura', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes')->onDelete('cascade');
            $table->decimal('percentual', 5, 2);
            $table->dateTime('registrado_em');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historico_postura');
    }
};