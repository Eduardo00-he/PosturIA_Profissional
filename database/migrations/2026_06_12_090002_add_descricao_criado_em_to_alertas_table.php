<?php
 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration
{
    /**
     * Alinha a tabela 'alertas' ao Model App\Models\Alertas:
     * - adiciona 'descricao_alerta', usada pelo fillable do model
     * - adiciona a coluna 'criado_em', já que o model define
     *   CREATED_AT = 'criado_em' e UPDATED_AT = null (sem 'updated_at').
     *
     * Esta migration não faz parte dos 4 requisitos solicitados, mas
     * corrige uma divergência pré-existente entre a migration original
     * de 'alertas' e o Model, para evitar erro de coluna inexistente.
     */
    public function up(): void
    {
        Schema::table('alertas', function (Blueprint $table) {
            $table->string('descricao_alerta')->nullable()->after('status_ia');
            $table->timestamp('criado_em')->nullable()->after('descricao_alerta');
        });
    }
 
    public function down(): void
    {
        Schema::table('alertas', function (Blueprint $table) {
            $table->dropColumn(['descricao_alerta', 'criado_em']);
        });
    }
};
 