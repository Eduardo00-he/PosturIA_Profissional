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
    Schema::create('alertas', function (Blueprint $table) {
        $table->id();
        
        // ADICIONE ESTAS QUATRO LINHAS:
        $table->foreignId('paciente_id')->constrained()->onDelete('cascade');
        $table->float('angulo_medido'); 
        $table->integer('horas_uso_sessao'); 
        $table->string('status_ia'); 
        
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alertas');
    }
};
