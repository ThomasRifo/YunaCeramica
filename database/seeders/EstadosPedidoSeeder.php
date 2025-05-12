<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadosPedidoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Seeder para los estados de los pedidos
        DB::table('estado_pedidos')->insertOrIgnore([
            ['id' => 1, 'nombre' => 'Pendiente'],
            ['id' => 2, 'nombre' => 'Enviado'],
            ['id' => 3, 'nombre' => 'Entregado'],
            ['id' => 4, 'nombre' => 'Cancelado'],
        ]);
    }
}
