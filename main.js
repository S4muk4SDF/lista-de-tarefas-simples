let tarefas = [];
let filtroAtual = 'todas';

window.onload = function () {
  const dados = localStorage.getItem('tarefas');
  if (dados) tarefas = JSON.parse(dados);
  renderizarTarefas();
};

function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function adicionarTarefa() {
  const input = document.getElementById('tarefa');
  const texto = input.value.trim();
  if (!texto) return;

  tarefas.push({ texto, concluida: false });
  input.value = '';
  salvarTarefas();
  renderizarTarefas();
}

function renderizarTarefas() {
  const ul = document.getElementById('lista');
  ul.innerHTML = '';

  const tarefasFiltradas = tarefas.filter(t => {
    if (filtroAtual === 'pendentes') return !t.concluida;
    if (filtroAtual === 'concluidas') return t.concluida;
    return true;
  });

  tarefasFiltradas.forEach((tarefa, index) => {
    const li = document.createElement('li');
    if (tarefa.concluida) li.classList.add('done');

    const span = document.createElement('span');
    span.textContent = tarefa.texto;
    span.style.cursor = 'pointer';
    span.onclick = () => {
      tarefas[index].concluida = !tarefas[index].concluida;
      salvarTarefas();
      renderizarTarefas();
    };

    const btns = document.createElement('div');
    btns.className = 'btns';

    const edit = document.createElement('button');
    edit.className = 'btn edit';
    edit.textContent = '✏️';
    edit.onclick = () => {
      const novoTexto = prompt('Editar tarefa:', tarefa.texto);
      if (novoTexto !== null) {
        tarefas[index].texto = novoTexto.trim();
        salvarTarefas();
        renderizarTarefas();
      }
    };

    const remove = document.createElement('button');
    remove.className = 'btn remove';
    remove.textContent = '🗑️';
    remove.onclick = () => {
      tarefas.splice(index, 1);
      salvarTarefas();
      renderizarTarefas();
    };

    btns.appendChild(edit);
    btns.appendChild(remove);

    li.appendChild(span);
    li.appendChild(btns);
    ul.appendChild(li);
  });

  atualizarContador();
}

function filtrar(filtro) {
  filtroAtual = filtro;
  document.querySelectorAll('.filtros button').forEach(btn => {
    btn.classList.remove('ativo');
  });
  document.getElementById(`filtro-${filtro}`).classList.add('ativo');
  renderizarTarefas();
}

function atualizarContador() {
  const total = tarefas.length;
  const concluidas = tarefas.filter(t => t.concluida).length;
  const pendentes = total - concluidas;

  document.getElementById('contadorTarefas').textContent =
    `Total: ${total} | Pendentes: ${pendentes} | Concluídas: ${concluidas}`;
}
