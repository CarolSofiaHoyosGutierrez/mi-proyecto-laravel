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
        Schema::create('compras', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('producto_id')->check('producto_id >= 0');
            $table->string('nombre');
            $table->decimal('precio', 10, 2);
            $table->integer('cantidad');
            $table->bigInteger('usuario_id')->check('usuario_id >= 0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compras');
    }
};
