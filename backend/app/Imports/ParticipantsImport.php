<?php

namespace App\Imports;

use App\Models\Participant;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ParticipantsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Participant([
            'EMPID' => $row['empid'],
            'EMPNAME' => $row['empname'],
            'EMPCOMP' => $row['empcomp'],
            'EMPCOMPID' => $row['empcompid'],
        ]);
    }
}
