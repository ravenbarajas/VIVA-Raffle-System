<?php

namespace App\Imports;

use App\Models\Winner;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class WinnersImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Winner([
            'DRWID' => $row['drwid'],
            'DRWNUM' => $row['drwnum'],
            'DRWNAME' => $row['drwname'],
            'DRWPRICE' => $row['drwprice'],
        ]);
    }
}
