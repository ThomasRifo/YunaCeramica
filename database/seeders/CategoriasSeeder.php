<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Seeder para las categorias de la pagina
        DB::table('categorias')->insertOrIgnore([
            ['id' => 1, 'nombre' => 'Productos'],
            ['id' => 2, 'nombre' => 'Talleres'],

        ]);
    }
}
