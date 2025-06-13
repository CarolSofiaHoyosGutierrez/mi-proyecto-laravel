<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::view('/{any?}', 'welcome')->where('any', '.*');

Route::get('/migrar', function () {
    Artisan::call('migrate --force');
    Artisan::call('db:seed --force');
    return 'Migración y seed ejecutados';
});

{/*Route::get('/login', function () {
    return response()->json(['message' => 'No autenticado.'], 401);
})->name('login');*/}