<?php

namespace App\Imports;

use App\Models\Winners;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class WinnersImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Log the data being processed
        \Log::info('Processing row:', $row);

        return new Winners([
            'DRWID' => $row['drwid'],
            'DRWNUM' => $row['drwnum'],
            'DRWNAME' => $row['drwname'],
            'DRWPRICE' => $row['drwprice'],
        ]);
    }
}
