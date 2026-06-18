<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adiciona a coluna 'idade' à tabela de pacientes.
     * As demais colunas exigidas pelo requisito 1 (status_conexao,
     * postura_media_percentual, colete_horario_uso) já existem na
     * migration original de criação da tabela.
     */
    public function up(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->integer('idade')->nullable()->after('nome');
        });
    }

    public function down(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->dropColumn('idade');
        });
    }
};