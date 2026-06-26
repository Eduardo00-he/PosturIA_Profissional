<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Substitui a coluna 'idade' por 'data_nascimento' na tabela de
     * pacientes, pelo mesmo motivo aplicado à tabela de médicos: a data
     * de nascimento é o dado correto a ser persistido, permitindo
     * calcular a idade real sempre que necessário.
     */
    public function up(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->dropColumn('idade');
            $table->date('data_nascimento')->nullable()->after('nome');
        });
    }

    public function down(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->dropColumn('data_nascimento');
            $table->integer('idade')->nullable()->after('nome');
        });
    }
};