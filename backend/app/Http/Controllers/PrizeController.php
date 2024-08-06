<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prize;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\PrizesImport;

class PrizeController extends Controller
{
    public function index()
    {
        return Prize::all();
    }

    public function store(Request $request)
    {
        $prize = Prize::create($request->all());
        return response()->json($prize, 201);
    }

    public function show($id)
    {
        return Prize::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $prize = Prize::findOrFail($id);
        $prize->update($request->all());
        return response()->json($prize, 200);
    }

    public function destroy($id)
    {
        Prize::destroy($id);
        return response()->json(null, 204);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        Excel::import(new PrizesImport, $request->file('file'));

        return response()->json(['message' => 'Prizes imported successfully.'], 200);
    }
}

