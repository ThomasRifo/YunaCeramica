<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinciasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provincias = [
            ['nombre' => 'Buenos Aires', 'activo' => true],
            ['nombre' => 'Catamarca', 'activo' => true],
            ['nombre' => 'Chaco', 'activo' => true],
            ['nombre' => 'Chubut', 'activo' => true],
            ['nombre' => 'Córdoba', 'activo' => true],
            ['nombre' => 'Corrientes', 'activo' => true],
            ['nombre' => 'Entre Ríos', 'activo' => true],
            ['nombre' => 'Formosa', 'activo' => true],
            ['nombre' => 'Jujuy', 'activo' => true],
            ['nombre' => 'La Pampa', 'activo' => true],
            ['nombre' => 'La Rioja', 'activo' => true],
            ['nombre' => 'Mendoza', 'activo' => true],
            ['nombre' => 'Misiones', 'activo' => true],
            ['nombre' => 'Neuquén', 'activo' => true],
            ['nombre' => 'Río Negro', 'activo' => true],
            ['nombre' => 'Salta', 'activo' => true],
            ['nombre' => 'San Juan', 'activo' => true],
            ['nombre' => 'San Luis', 'activo' => true],
            ['nombre' => 'Santa Cruz', 'activo' => true],
            ['nombre' => 'Santa Fe', 'activo' => true],
            ['nombre' => 'Santiago del Estero', 'activo' => true],
            ['nombre' => 'Tierra del Fuego', 'activo' => true],
            ['nombre' => 'Tucumán', 'activo' => true],
        ];

        foreach ($provincias as $provincia) {
            DB::table('provincias')->insertOrIgnore([
                'nombre' => $provincia['nombre'],
                'activo' => $provincia['activo'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
