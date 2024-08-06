<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Participants;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ParticipantsImport;
use Illuminate\Support\Facades\Log;

class ParticipantController extends Controller
{
    public function index()
    {
        try {
            $participants = Participants::all();
            return response()->json($participants);
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
            Excel::import(new ParticipantsImport, $request->file('file'));

            return response()->json(['message' => 'File uploaded successfully!'], 200);
        } catch (\Exception $e) {
            Log::error('File upload error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to upload file.'], 500);
        }
    }
    public function getParticipantsForDraw()
    {
        try {
            $participants = Participants::whereNotNull('EMPNAME')->get(); // Fetch participants with non-null names
            return response()->json($participants);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
