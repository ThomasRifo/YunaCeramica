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
        // Crear usuario de prueba
        User::create([
            'name' => 'Test User',
            'apellido' => 'Test Apellido',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),
        ])->assignRole('admin');
    
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
