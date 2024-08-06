<?php

namespace App\Imports;

use App\Models\Prizes;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PrizesImport implements ToModel, WithHeadingRow
{
    use Importable;
    
    public function model(array $row)
    {
        // Log the data being processed
        \Log::info('Processing row:', $row);

        // Check if headers are present and handle accordingly
        return new Prizes([
            'RFLID' => $row['rflid'] ?? null,
            'RFLNUM' => $row['rflnum'] ?? null,
            'RFLITEM' => $row['rflitem'] ?? null,
            'RFLITEMQTY' => $row['rflitemqty'] ?? null,
        ]);
    }
}
