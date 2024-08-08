<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Winners extends Model
{
    use HasFactory;

    protected $table = 'draw_winners'; // Specify the correct table name
    
    protected $primaryKey = 'DRWID';

    protected $fillable = [
        'DRWNUM',
        'DRWNAME',
        'DRWPRICE',
    ];
}
