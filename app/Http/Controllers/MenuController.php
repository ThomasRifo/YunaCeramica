<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Listar todos los tipos de menú
     */
    public function index()
    {
        $menus = Menu::withCount('talleres')
            ->orderBy('nombre', 'asc')
            ->get();

        return Inertia::render('Dashboard/Paginas/Menu/Menu', [
            'menus' => $menus,
        ]);
    }

    /**
     * Crear una nueva opción de menú
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:menus,nombre',
            'html' => 'nullable|string',
        ]);

        try {
            Menu::create([
                'nombre' => $validated['nombre'],
                'html' => $validated['html'] ?? '',
            ]);

            return redirect()->route('dashboard.paginas.menu.index')
                ->with('success', "Menú '{$validated['nombre']}' creado correctamente");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al crear el menú: ' . $e->getMessage()]);
        }
    }

    /**
     * Actualizar el nombre de un menú existente
     */
    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:menus,nombre,' . $id,
            'html' => 'nullable|string',
        ]);

        try {
            $menu->update([
                'nombre' => $validated['nombre'],
                'html' => $validated['html'] ?? ($menu->html ?? ''),
            ]);

            return redirect()->route('dashboard.paginas.menu.index')
                ->with('success', "Menú '{$validated['nombre']}' actualizado correctamente");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al actualizar el menú: ' . $e->getMessage()]);
        }
    }

    /**
     * Eliminar un menú si no está en uso
     */
    public function destroy($id)
    {
        $menu = Menu::withCount('talleres')->findOrFail($id);

        if ($menu->talleres_count > 0) {
            return redirect()->back()->withErrors([
                'error' => "No se puede eliminar el menú '{$menu->nombre}' porque está asignado a {$menu->talleres_count} taller(es). Debes desvincularlo de los talleres antes de poder eliminarlo.",
            ]);
        }

        try {
            $menu->delete();

            return redirect()->route('dashboard.paginas.menu.index')
                ->with('success', "Menú '{$menu->nombre}' eliminado correctamente");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al eliminar el menú: ' . $e->getMessage()]);
        }
    }
}
