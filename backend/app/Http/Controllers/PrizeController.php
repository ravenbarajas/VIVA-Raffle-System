<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prize;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\PrizesImport;

class PrizeController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xls,xlsx,csv',
        ]);

        Excel::import(new PrizesImport, $request->file('file'));

        return response()->json(['message' => 'Prizes uploaded successfully']);
    }

    public function index()
    {
        $prizes = Prize::all();
        return response()->json($prizes);
    }
}
