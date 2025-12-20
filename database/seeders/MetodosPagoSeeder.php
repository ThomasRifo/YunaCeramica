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
            ['id' => 1, 'nombre' => 'Transferencia', 'descripcion' => 'Transferencia bancaria', 'activo' => true],
            ['id' => 2, 'nombre' => 'Mercado Pago', 'descripcion' => 'Tarjeta de crédito, débito, o dinero disponible en tu cuenta', 'activo' => true],
            ['id' => 3, 'nombre' => 'Efectivo', 'descripcion' => 'Pago en efectivo al momento de la entrega', 'activo' => true],
        ]);
        
        // Asegurar que todos los métodos de pago estén activos (actualizar si ya existen)
        DB::table('metodos_pago')->whereIn('id', [1, 2, 3])->update(['activo' => true]);
    }
}
