<?php
 

//Sin utilizar por el momento
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserOwnsProfile
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()->id !== $request->route('user')->id) {
            abort(403, 'No tienes permiso para acceder a este perfil.');
        }

        return $next($request);
    }
}