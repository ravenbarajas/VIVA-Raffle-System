<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Winner;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\WinnersImport;

class WinnerController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xls,xlsx,csv',
        ]);

        Excel::import(new WinnersImport, $request->file('file'));

        return response()->json(['message' => 'Winners uploaded successfully']);
    }

    public function index()
    {
        $winners = Winner::all();
        return response()->json($winners);
    }
}
