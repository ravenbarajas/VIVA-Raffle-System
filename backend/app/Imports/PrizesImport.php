<?php

namespace App\Imports;

use App\Models\Prize;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;

class PrizesImport implements ToModel
{
    use Importable;
    
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
