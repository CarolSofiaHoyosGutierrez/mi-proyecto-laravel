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
        Schema::create('donacions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('ayuda_id')->constrained('ayudas')->onDelete('cascade');
            $table->decimal('monto', 10, 2);
            $table->string('metodo_pago');
            $table->timestamps();

            $table->unique(['usuario_id', 'ayuda_id']); // evitar donaciones duplicadas por usuario
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donacions');
    }
};
