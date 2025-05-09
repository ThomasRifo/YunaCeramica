<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadosPagoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('estados_pago')->insertOrIgnore([
            ['id' => 1, 'nombre' => 'Pendiente'],
            ['id' => 2, 'nombre' => 'Señado'],
            ['id' => 3, 'nombre' => 'Pagado'],
            ['id' => 4, 'nombre' => 'Rechazado'],
            ['id' => 5, 'nombre' => 'Cancelado'],
        ]);
    }
}
