<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubcategoriasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Seeder para las subcategorias de los talleres
        DB::table('subcategorias')->insertOrIgnore([
            ['id' => 1, 'nombre' => 'Cerámica y Gin', 'descripcion' => 'Taller de cerámica y gin', 'idCategoria' => 2, 'url' => 'ceramica-y-gin', 'activo' => 1, 'orden' => 0],
            ['id' => 2, 'nombre' => 'Cerámica y Café', 'descripcion' => 'Taller de cerámica y café', 'idCategoria' => 2, 'url' => 'ceramica-y-cafe', 'activo' => 1, 'orden' => 0],
        ]);
    }
}
