<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Aquí puedes configurar las reglas CORS para tu aplicación.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*',
    'http://localhost:3000',
        'https://tu-app.vercel.app',], // Puedes poner aquí tu IP o dominio de Expo si quieres restringir

        'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
