<?php
 
namespace App\Http\Controllers;
 
use App\Models\Pacientes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
 
class PacienteController extends Controller
{
    /**
     * Lista pacientes. Se 'medico_id' for informado na query string,
     * retorna apenas os pacientes vinculados a esse médico (requisito 1:
     * "exiba apenas os pacientes pertencentes ao médico logado"; e
     * requisito 3: filtro usado pelo dashboard ao logar como médico).
     */
    public function index(Request $request)
    {
        $query = Pacientes::with('medico');
 
        if ($request->filled('medico_id')) {
            $query->where('medico_id', $request->input('medico_id'));
        }
 
        return response()->json($query->orderBy('id')->get());
    }
 
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'idade' => 'required|integer|min:0|max:120',
            'patologia' => 'required|string|max:255',
            'medico_id' => 'required|exists:medicos,id',
        ]);
 
        // Status de conexão e postura média são gerados aleatoriamente,
        // e o horário de uso do colete recebe o timestamp do momento
        // da criação, conforme requisito 1.
        $statusConexaoOnline = (bool) random_int(0, 1);
        $posturaMediaPercentual = round(random_int(4000, 9500) / 100, 2); // 40.00% a 95.00%
 
        $paciente = DB::transaction(function () use ($request, $statusConexaoOnline, $posturaMediaPercentual) {
            $novoId = $this->proximoIdDisponivel();
 
            Pacientes::insert([
                'id' => $novoId,
                'nome' => $request->input('nome'),
                'idade' => $request->input('idade'),
                'patologia' => $request->input('patologia'),
                'medico_id' => $request->input('medico_id'),
                'status_conexao' => $statusConexaoOnline ? 1 : 0,
                'colete_horario_uso' => now(),
                'postura_media_percentual' => $posturaMediaPercentual,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
 
            return Pacientes::find($novoId);
        });
 
        return response()->json($paciente, 201);
    }
 
    /**
     * Mesma lógica de reaproveitamento de ID usada para médicos,
     * aplicada também a pacientes para manter o comportamento consistente
     * em todo o sistema.
     */
    private function proximoIdDisponivel(): int
    {
        $idsExistentes = Pacientes::orderBy('id')->pluck('id')->all();
 
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
 