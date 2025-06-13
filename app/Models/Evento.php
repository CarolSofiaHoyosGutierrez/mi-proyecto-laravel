<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Inscripcion;

class Evento extends Model
{
    // Campos que son asignables
    protected $fillable = ['nombre', 'fecha', 'lugar', 'cupo'];

    // Relación de muchos a muchos con User (no Usuarios)
    public function usuarios()
    {
        return $this->belongsToMany(User::class, 'inscripciones', 'evento_id', 'usuario_id');
    }

    public function inscripciones()
    {
    return $this->hasMany(Inscripcion::class);
    }

}


