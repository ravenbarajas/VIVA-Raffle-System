<?php

namespace App\Imports;

use App\Models\Prize;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PrizesImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Prize([
            'RFLID' => $row['rflid'],
            'RFLNUM' => $row['rflnum'],
            'RFLITEM' => $row['rflitem'],
            'RFLITEMQTY' => $row['rflitemqty'],
        ]);
    }
}
