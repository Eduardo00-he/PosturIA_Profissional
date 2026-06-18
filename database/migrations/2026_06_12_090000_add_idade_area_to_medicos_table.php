<?php
 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration
{
    /**
     * Adiciona as colunas 'idade' e 'area' à tabela de médicos.
     *
     * 'area' guarda a especialidade validada ('fisioterapeuta' ou 'ortopedista'),
     * usada pelo MedicoController para decidir, via if/else, o prefixo do CRM
     * gerado automaticamente.
     */
    public function up(): void
    {
        Schema::table('medicos', function (Blueprint $table) {
            $table->integer('idade')->nullable()->after('nome');
            $table->string('area')->nullable()->after('crm');
        });
    }
 
    public function down(): void
    {
        Schema::table('medicos', function (Blueprint $table) {
            $table->dropColumn(['idade', 'area']);
        });
    }
};
 