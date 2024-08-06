<?php

namespace App\Imports;

use App\Models\Participants;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ParticipantsImport implements ToModel, WithHeadingRow
{
    use Importable;
    
    public function model(array $row)
    {
        // Log the data being processed
        \Log::info('Processing row:', $row);

        // Check if headers are present and handle accordingly
        return new Participants([
            'EMPID' => $row['empid'] ?? null,
            'EMPNAME' => $row['empname'] ?? null,
            'EMPCOMP' => $row['empcomp'] ?? null,
            'EMPCOMPID' => $row['empcompid'] ?? null,
        ]);
    }
}
