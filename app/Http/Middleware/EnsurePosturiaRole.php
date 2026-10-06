<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePosturiaRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->hasValidPosturiaProfile() || ! in_array($user->role, $roles, true)) {
            abort(403, 'Acesso não autorizado.');
        }

        return $next($request);
    }
}
