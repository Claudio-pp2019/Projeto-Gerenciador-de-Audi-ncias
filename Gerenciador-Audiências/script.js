
// script.js

// Seleciona os formulários
const formAudiencia = document.getElementById('form-audiencia');
const formLembrete = document.getElementById('form-lembrete');

// Adiciona evento de envio para os formulários
formAudiencia.addEventListener('submit', cadastrarAudiencia);
formLembrete.addEventListener('submit', cadastrarLembrete);

// Função para cadastrar audiência
function cadastrarAudiencia(event) {
    event.preventDefault();
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const vara = document.getElementById('vara').value;
    const descricao = document.getElementById('descricao').value;

    // Cria um objeto com os dados da audiência
    const audiencia = {
        data,
        hora,
        vara,
        descricao
    };

    // Envia a notificação para o cliente (simulação)
    console.log(`Audiência cadastrada: ${audiencia.data} ${audiencia.hora} - ${audiencia.vara}`);

    // Adiciona a audiência à lista
    const listaAudiencias = document.getElementById('lista-audiencias');
    const item = document.createElement('div');
    item.textContent = `${audiencia.data} ${audiencia.hora} - ${audiencia.vara}`;
    listaAudiencias.appendChild(item);
}

// Função para cadastrar lembrete
function cadastrarLembrete(event) {
    event.preventDefault();
    const data = document.getElementById('data-lembrete').value;
    const hora = document.getElementById('hora-lembrete').value;
    const descricao = document.getElementById('descricao-lembrete').value;

    // Cria um objeto com os dados do lembrete
    const lembrete = {
        data,
        hora,
        descricao
    };

    // Envia a notificação para a esposa (simulação)
    console.log(`Lembrete cadastrado: ${lembrete.data} ${lembrete.hora} - ${lembrete.descricao}`);

    // Adiciona o lembrete à lista
    const listaLembretes = document.getElementById('lista-lembretes');
    const item = document.createElement('div');
    item.textContent = `${lembrete.data} ${lembrete.hora} - ${lembrete.descricao}`;
    listaLembretes.appendChild(item);
}
