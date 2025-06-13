<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class ResetPasswordController extends Controller
{
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'correo' => 'required|email|exists:usuarios,email',
            'contraseña' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',        // al menos una minúscula
                'regex:/[A-Z]/',        // al menos una mayúscula
                'regex:/[0-9]/',        // al menos un número
                'regex:/[@$!%*#?&]/',   // al menos un carácter especial
                'confirmed',
            ],
        ], [
            'contraseña.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'contraseña.regex' => 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
            'contraseña.confirmed' => 'La confirmación de la contraseña no coincide.',
            'correo.exists' => 'No se encontró un usuario con ese correo electrónico.',
        ]);

        $status = Password::broker('users')->reset(
            [
                'email' => $request->correo,
                'password' => $request->contraseña,
                'password_confirmation' => $request->contraseña_confirmation,
                'token' => $request->token,
            ],
            function ($user, $password) {
                $user->contraseña = $password;
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Contraseña restablecida.'], 200);
        } else {
            return response()->json(['message' => __($status)], 400);
        }
    }
}


/*namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class ResetPasswordController extends Controller
{
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'correo' => 'required|email',
            'contraseña' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',      // al menos una mayúscula
                'regex:/[0-9]/',      // al menos un número
                'regex:/[@$!%*#?&]/', // al menos un carácter especial
                'confirmed',
            ],
            ], [
    'contraseña.regex' => 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
    'contraseña.min' => 'La contraseña debe tener al menos 8 caracteres.',
     'contraseña.confirmed' => 'La confirmación de la contraseña no coincide.',
        'correo.exists' => 'No se encontró un usuario con ese correo electrónico.',
        ]);

        $status = Password::broker('users')->reset(
            [
                'email' => $request->correo,
                'password' => $request->contraseña,
                'password_confirmation' => $request->contraseña_confirmation,
                'token' => $request->token,
            ],
            function ($user, $password) {
                $user->contraseña = $password;
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Contraseña restablecida.'], 200);
        } else {
            return response()->json(['message' => __($status)], 400);
        }

        
    }
}*/
