<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
 
class AuthController extends Controller
{
    /**
     * Credenciais únicas do sistema (requisito 2: Login: eduardo0 / posturia0).
     * Em produção, isso deveria vir de uma tabela de usuários com senha
     * hasheada; mantido simples aqui pois o sistema tem um único login fixo.
     */
    private const LOGIN_VALIDO = 'eduardo0';
    private const SENHA_VALIDA = 'posturia0';
 
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'senha' => 'required|string',
        ]);
 
        $loginOk = strtolower($request->input('login')) === self::LOGIN_VALIDO;
        $senhaOk = $request->input('senha') === self::SENHA_VALIDA;
 
        if (! $loginOk || ! $senhaOk) {
            return response()->json([
                'message' => 'Credenciais inválidas.',
            ], 401);
        }
 
        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'nome' => 'Eduardo',
        ]);
    }
}
 