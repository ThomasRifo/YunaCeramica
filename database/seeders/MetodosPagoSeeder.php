<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class MetodosPagoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Seeder para los metodos de pago
        DB::table('metodos_pago')->insertOrIgnore([
            ['id' => 1, 'nombre' => 'Transferencia', 'descripcion' => 'Transferencia bancaria'],
            ['id' => 2, 'nombre' => 'Mercado Pago', 'descripcion' => 'Tarjeta de crédito, débito, o dinero disponible en tu cuenta'],
            ['id' => 3, 'nombre' => 'Efectivo', 'descripcion' => 'Pago en efectivo al momento de la entrega'],
        ]);
    }
}
