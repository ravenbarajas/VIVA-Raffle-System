<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Participant;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ParticipantsImport;

class ParticipantController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xls,xlsx,csv',
        ]);

        Excel::import(new ParticipantsImport, $request->file('file'));

        return response()->json(['message' => 'Participants uploaded successfully']);
    }

    public function index()
    {
        $participants = Participant::all();
        return response()->json($participants);
    }
}
