<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id();
            
            // Relacionamento com a tabela de médicos
            $table->foreignId('medico_id')->nullable()->constrained('medicos')->onDelete('cascade');
            $table->string('nome');
            $table->string('patologia');
            
            // Colunas corrigidas e adicionadas para o Seeder funcionar perfeitamente
            $table->integer('status_conexao')->default(1); 
            $table->dateTime('colete_horario_uso')->nullable();
            $table->decimal('postura_media_percentual', 5, 2)->default(0.00);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
};