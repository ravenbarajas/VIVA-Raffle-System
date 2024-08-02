<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\PrizeController;
use App\Http\Controllers\WinnerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/participants/upload', [ParticipantController::class, 'upload']);
Route::post('/prizes/upload', [PrizeController::class, 'upload']);
Route::post('/winners/upload', [WinnerController::class, 'upload']);

Route::get('/participants', [ParticipantController::class, 'index']);
Route::get('/prizes', [PrizeController::class, 'index']);
Route::get('/winners', [WinnerController::class, 'index']);