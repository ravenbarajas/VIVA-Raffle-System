<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Winners;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\WinnersImport;

class WinnerController extends Controller
{
    public function index()
    {
        $winners = Winners::all(); // This will query the 'draw_winners' table
        return response()->json($winners);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'DRWNUM' => 'required|integer',
            'DRWNAME' => 'required|string',
            'DRWPRICE' => 'required|string',
        ]);

        $winners = Winners::create($validated);

        return response()->json($winners, 201);
    }

    public function update(Request $request, $id)
    {
        $winners = Winners::findOrFail($id);
        $winners->update($request->all());
        return response()->json($winners, 200);
    }
}
