<?php
 
namespace App\Http\Controllers;
 
use App\Models\Medicos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
 
class MedicoController extends Controller
{
    /**
     * ID da clínica única do sistema. Todo médico cadastrado por esta
     * tela é vinculado a ela (requisito 4: "Todos os médicos criados
     * serão associados a essa única clínica existente.").
     */
    private const CLINICA_ID = 1;
 
    /**
     * Lista os médicos da clínica única, já com os pacientes
     * vinculados a cada um (usado tanto na Área da Clínica quanto
     * para popular as opções de login na Área do Médico).
     */
    public function index()
    {
        $medicos = Medicos::with('pacientes')
            ->where('clinica_id', self::CLINICA_ID)
            ->orderBy('id')
            ->get();
 
        return response()->json($medicos);
    }
 
    public function show($id)
    {
        $medico = Medicos::with('pacientes')->findOrFail($id);
 
        return response()->json($medico);
    }
 
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'idade' => 'required|integer|min:18|max:100',
            'area' => 'required|string',
        ]);
 
        // Validação de área: aceita apenas 'fisioterapeuta' ou 'ortopedista'.
        // Qualquer outro valor é bloqueado com a mensagem "Inválido".
        $area = strtolower(trim($request->input('area')));
 
        if ($area !== 'fisioterapeuta' && $area !== 'ortopedista') {
            throw ValidationException::withMessages([
                'area' => ['Inválido'],
            ]);
        }
 
        // Geração automática do CRM com base na área escolhida (if/else),
        // seguido de um número sequencial de 5 dígitos para mantê-lo único.
        $proximoNumero = Medicos::count() + 1;
 
        if ($area === 'ortopedista') {
            $crm = 'CRM-ORTO-' . str_pad($proximoNumero, 5, '0', STR_PAD_LEFT);
        } else {
            $crm = 'CRM-FISIO-' . str_pad($proximoNumero, 5, '0', STR_PAD_LEFT);
        }
 
        // Garante que o CRM gerado é único mesmo se já existir
        // (ex.: após exclusões), incrementando o número até achar um livre.
        while (Medicos::where('crm', $crm)->exists()) {
            $proximoNumero++;
            $prefixo = $area === 'ortopedista' ? 'CRM-ORTO-' : 'CRM-FISIO-';
            $crm = $prefixo . str_pad($proximoNumero, 5, '0', STR_PAD_LEFT);
        }
 
        $medico = DB::transaction(function () use ($request, $area, $crm) {
            // Lógica de auto-incremento inteligente: reaproveita o menor
            // ID vago (ex.: id4 deletado -> próximo cadastro reaproveita id4).
            $novoId = $this->proximoIdDisponivel();
 
            Medicos::insert([
                'id' => $novoId,
                'nome' => $request->input('nome'),
                'idade' => $request->input('idade'),
                'crm' => $crm,
                'area' => $area,
                'clinica_id' => self::CLINICA_ID,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
 
            return Medicos::find($novoId);
        });
 
        return response()->json($medico, 201);
    }
 
    public function destroy($id)
    {
        $medico = Medicos::findOrFail($id);
        $medico->delete();
 
        return response()->json(['message' => 'Médico removido com sucesso.']);
    }
 
    /**
     * Calcula o menor ID positivo ainda não utilizado na tabela de
     * médicos. Se existem id1, id2 e id3, retorna 4. Se o id4 for
     * removido posteriormente, este método volta a retornar 4.
     */
    private function proximoIdDisponivel(): int
    {
        $idsExistentes = Medicos::orderBy('id')->pluck('id')->all();
 
        $candidato = 1;
        foreach ($idsExistentes as $id) {
            if ($id == $candidato) {
                $candidato++;
            } elseif ($id > $candidato) {
                break;
            }
        }
 
        return $candidato;
    }
}
 