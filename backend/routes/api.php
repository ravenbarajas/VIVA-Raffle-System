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
Route::post('/participants', [ParticipantController::class, 'store']); // Create new participant
Route::get('/participants/{id}', [ParticipantController::class, 'show']); // Get single participant
Route::put('/participants/{id}', [ParticipantController::class, 'update']); // Update participant
Route::delete('/participants/{id}', [ParticipantController::class, 'destroy']); // Delete participant

// Prizes
Route::get('/prizes', [PrizeController::class, 'index']);
Route::post('/prizes/upload', [PrizeController::class, 'upload']);
Route::post('/prizes', [PrizeController::class, 'store']); // Create new participant
Route::get('/prizes/{id}', [PrizeController::class, 'show']); // Get single participant
Route::put('/prizes/{id}', [PrizeController::class, 'update']); // Update participant
Route::delete('/prizes/{id}', [PrizeController::class, 'destroy']); // Delete participant
