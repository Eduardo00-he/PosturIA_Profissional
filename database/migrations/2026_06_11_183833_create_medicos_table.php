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
    Schema::create('medicos', function (Blueprint $table) {
        $table->id();
        
        // ADICIONE ESTAS TRÊS LINHAS:
        $table->foreignId('clinica_id')->constrained()->onDelete('cascade'); 
        $table->string('nome');
        $table->string('crm')->unique();
        
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicos');
    }
};
