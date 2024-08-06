<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prizes;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\PrizesImport;
use Illuminate\Support\Facades\Log;

class PrizeController extends Controller
{
    public function index()
    {
        try {
            $prizes = Prizes::all();
            return response()->json($prizes);
        } catch (\Exception $e) {
            // Log the exception
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    public function upload(Request $request)
    {
        try {
            // Validate the file
            $request->validate([
                'file' => 'required|mimes:xlsx,xls,csv|max:2048',
            ]);

            // Import the file
            Excel::import(new PrizesImport, $request->file('file'));

            return response()->json(['message' => 'File uploaded successfully!'], 200);
        } catch (\Exception $e) {
            Log::error('File upload error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to upload file.'], 500);
        }
    }
    public function getPrizesForDraw()
    {
        try {
            $prizes = Prizes::where('quantity', '>', 0)->get(); // Fetch prizes with quantity greater than 0
            return response()->json($prizes);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}

