<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/migrar', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        Artisan::call('db:seed', ['--force' => true]);
        return response("<pre>" . Artisan::output() . "</pre>");
    } catch (\Exception $e) {
        return response("<pre>Error: " . $e->getMessage() . "</pre>", 500);
    }
});

Route::view('/{any?}', 'welcome')->where('any', '.*');


{/*Route::get('/login', function () {
    return response()->json(['message' => 'No autenticado.'], 401);
})->name('login');*/}