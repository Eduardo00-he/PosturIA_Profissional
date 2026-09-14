<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->foreignId('clinica_id')
                ->nullable()
                ->after('id')
                ->constrained('clinicas')
                ->nullOnDelete();
            $table->string('role', 40)->default('clinic_admin')->after('email');
            $table->index(['clinica_id', 'role']);
        });

        Schema::table('medicos', function (Blueprint $table): void {
            $table->foreignId('user_id')
                ->nullable()
                ->after('clinica_id')
                ->constrained('users')
                ->nullOnDelete();
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('medicos', function (Blueprint $table): void {
            $table->dropUnique(['user_id']);
            $table->dropConstrainedForeignId('user_id');
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->dropIndex(['clinica_id', 'role']);
            $table->dropConstrainedForeignId('clinica_id');
            $table->dropColumn('role');
        });
    }
};
