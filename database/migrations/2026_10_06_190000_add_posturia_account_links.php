<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 20)->nullable()->after('password');
            $table->foreignId('clinica_id')->nullable()->after('role')
                ->constrained('clinicas')->nullOnDelete();
        });

        Schema::table('medicos', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->unique()->after('clinica_id')
                ->constrained('users')->nullOnDelete();
            $table->renameColumn('crm', 'registro_profissional');
        });
    }

    public function down(): void
    {
        Schema::table('medicos', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropUnique(['user_id']);
            $table->dropColumn('user_id');
            $table->renameColumn('registro_profissional', 'crm');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['clinica_id']);
            $table->dropColumn(['role', 'clinica_id']);
        });
    }
};
