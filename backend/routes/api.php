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

// Participants
Route::get('/participants', [ParticipantController::class, 'index']);
Route::post('/participants/upload', [ParticipantController::class, 'upload']);
Route::get('participants/draw', [ParticipantsController::class, 'getParticipantsForDraw']);

// Prizes
Route::get('/prizes', [PrizeController::class, 'index']);
Route::patch('/prizes/{id}', [PrizeController::class, 'update']);
Route::post('/prizes/upload', [PrizeController::class, 'upload']);
Route::get('prizes/draw', [PrizesController::class, 'getPrizesForDraw']);
Route::post('/prizes', [PrizeController::class, 'store']);
Route::delete('/prizes/{id}', [PrizeController::class, 'destroy']);


// Winners
Route::get('/winners', [WinnerController::class, 'index']);
Route::post('/winners', [WinnerController::class, 'store']);
Route::patch('/winners/{id}', [WinnerController::class, 'update']);