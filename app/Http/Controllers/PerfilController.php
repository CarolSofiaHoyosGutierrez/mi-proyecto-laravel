<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class PerfilController extends Controller
{
    // Mostrar datos del usuario autenticado
    public function show()
    {
        $user = Auth::user();
        return response()->json($user);
    }

    // Actualizar datos del usuario
    public function update(Request $request)
    {
        \Log::debug('🧾 Formulario recibido:', $request->all());
         $user = auth()->user();

    // Validación
    $request->validate([
        'nombre' => 'sometimes|string|max:255',
        'apellido' => 'sometimes|string|max:255',
        'correo' => 'sometimes|email|unique:usuarios,correo,' . $user->id,
        'telefono' => 'sometimes|string|max:20',
        'contraseña' => 'sometimes|string|min:6',
        'imagen_perfil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
    ]);

    // Log temporal para depuración (esto aparecerá en storage/logs/laravel.log)
    \Log::info('📤 Actualizando perfil', $request->all());

    // Asignaciones individuales
    if ($request->has('nombre')) {
        \Log::info('📤 Actualizando nombre a: ' . $request->nombre);
        $user->nombre = $request->nombre;
    } else {
    \Log::warning('⚠️ No se recibió el campo nombre en la petición');
}

    if ($request->has('apellido')) {
        $user->apellido = $request->apellido;
    }

    if ($request->has('correo')) {
        $user->correo = $request->correo;
        $user->email = $request->correo; // sincroniza ambos campos
    }

    if ($request->has('telefono')) {
        $user->telefono = $request->telefono;
    }

    if ($request->filled('contraseña')) {
        $user->contraseña = Hash::make($request->contraseña);
    }

    if ($request->hasFile('imagen_perfil')) {
    $archivo = $request->file('imagen_perfil');
    $nombreArchivo = uniqid() . '.' . $archivo->getClientOriginalExtension();

    // Guarda la imagen en storage/app/public/imagenes
    $archivo->storeAs('imagenes', $nombreArchivo, 'public');

    // Guarda el nombre en la base de datos (si corresponde)
    $user->imagen_perfil = $nombreArchivo;
    \Log::info('📤 Imagen de perfil actualizada: ' . $nombreArchivo);
}




    // Guardar y refrescar modelo
    $user->save();
    $user->refresh();

    return response()->json($user);
    }

    // Método temporal para probar cambio manual de nombre
public function testUpdateNombre()
{
    $user = auth()->user();   // Usuario autenticado
    $user->nombre = 'TESTING'; // Cambias el nombre manualmente
    $user->save();             // Guardas en base de datos

    \Log::info('Nombre cambiado a: ' . $user->nombre);  // Log para verificar

    return response()->json([
        'mensaje' => 'Nombre cambiado a TESTING',
        'user' => $user
    ]);
}

}
