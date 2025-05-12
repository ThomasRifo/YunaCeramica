<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            EstadosPagoSeeder::class,
            EstadosPedidoSeeder::class,
            CategoriasSeeder::class,
            RoleSeeder::class,  
            SubcategoriasSeeder::class,
            MetodosPagoSeeder::class,
        ]);
    }
}
