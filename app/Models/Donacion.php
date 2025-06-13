<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donacion extends Model
{
    protected $fillable = ['usuario_id', 'ayuda_id', 'monto', 'metodo_pago'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function ayuda()
    {
        return $this->belongsTo(Ayuda::class, 'ayuda_id');
    }
}
