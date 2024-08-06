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
    
    public function store(Request $request)
    {
        $participant = Participants::create($request->all());
        return response()->json($participant, 201);
    }

    public function show($id)
    {
        return Participants::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $participant = Participants::findOrFail($id);
        $participant->update($request->all());
        return response()->json($participant, 200);
    }

    public function destroy($id)
    {
        Participants::destroy($id);
        return response()->json(null, 204);
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
}
