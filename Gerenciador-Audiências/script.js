// Utilitário para verificar prazos
function verificarPrazo(prazoStr) {
    const hoje = new Date();
    const prazo = new Date(prazoStr);
    const diff = prazo - hoje;
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return dias <= 2;
}

// Utilitário para gerar links de contato
function gerarLinksContato(nome, whatsapp, email, mensagem) {
    const tel = whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(mensagem);
    const linkZap = `https://wa.me/55${tel}?text=${msg}`;
    const linkEmail = `mailto:${email}?subject=Lembrete&body=${msg}`;

    return `
        <a href="${linkZap}" target="_blank">📲 WhatsApp</a> |
        <a href="${linkEmail}" target="_blank">✉️ E-mail</a>
    `;
}

// ---------- AUDIÊNCIAS ----------

function renderizarAudiencia(audiencia) {
    const alerta = verificarPrazo(audiencia.prazo) ? `<strong style="color: red;">⚠️ PRAZO PRÓXIMO</strong><br>` : '';
    const mensagem = `Olá ${audiencia.nome}, lembramos que sua audiência está marcada para ${audiencia.data} às ${audiencia.hora}, na vara ${audiencia.vara}.`;
    const contatos = gerarLinksContato(audiencia.nome, audiencia.whatsapp, audiencia.email, mensagem);

    const div = document.createElement("div");
    div.classList.add("audiencia-item");
    div.innerHTML = `
        <p>${alerta}<strong>Cliente:</strong> ${audiencia.nome}</p>
        <p><strong>Data:</strong> ${audiencia.data} às ${audiencia.hora}</p>
        <p><strong>Vara:</strong> ${audiencia.vara}</p>
        <p><strong>Descrição:</strong> ${audiencia.descricao}</p>
        <p>${contatos}</p>
        <hr>
    `;
    document.getElementById("lista-audiencias").appendChild(div);
}

function carregarAudiencias() {
    const dados = JSON.parse(localStorage.getItem("audiencias")) || [];
    dados.forEach(renderizarAudiencia);
}

document.getElementById("form-audiencia").addEventListener("submit", function (e) {
    e.preventDefault();

    const audiencia = {
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value,
        prazo: document.getElementById("prazo").value,
        nome: document.getElementById("cliente-nome").value,
        whatsapp: document.getElementById("cliente-whatsapp").value,
        email: document.getElementById("cliente-email").value,
        vara: document.getElementById("vara").value,
        descricao: document.getElementById("descricao").value
    };

    const dados = JSON.parse(localStorage.getItem("audiencias")) || [];
    dados.push(audiencia);
    localStorage.setItem("audiencias", JSON.stringify(dados));

    renderizarAudiencia(audiencia);
    e.target.reset();
});

// ---------- LEMBRETES ----------

function renderizarLembrete(lembrete) {
    const alerta = verificarPrazo(lembrete.prazo) ? `<strong style="color: red;">⚠️ PRAZO PRÓXIMO</strong><br>` : '';
    const mensagem = `Olá ${lembrete.nome}, você tem uma tarefa pendente: "${lembrete.titulo}" marcada para ${lembrete.data} às ${lembrete.hora}.`;
    const contatos = gerarLinksContato(lembrete.nome, lembrete.whatsapp, lembrete.email, mensagem);

    const div = document.createElement("div");
    div.classList.add("lembrete-item");
    div.innerHTML = `
        <p>${alerta}<strong>Tarefa:</strong> ${lembrete.titulo}</p>
        <p><strong>Cliente:</strong> ${lembrete.nome}</p>
        <p><strong>Data:</strong> ${lembrete.data} às ${lembrete.hora}</p>
        <p><strong>Descrição:</strong> ${lembrete.descricao}</p>
        <p>${contatos}</p>
        <hr>
    `;
    document.getElementById("lista-lembretes").appendChild(div);
}

function carregarLembretes() {
    const dados = JSON.parse(localStorage.getItem("lembretes")) || [];
    dados.forEach(renderizarLembrete);
}

document.getElementById("form-lembrete").addEventListener("submit", function (e) {
    e.preventDefault();

    const lembrete = {
        titulo: document.getElementById("titulo-lembrete").value,
        data: document.getElementById("data-lembrete").value,
        hora: document.getElementById("hora-lembrete").value,
        prazo: document.getElementById("prazo-lembrete").value,
        nome: document.getElementById("cliente-lembrete-nome").value,
        whatsapp: document.getElementById("cliente-lembrete-whatsapp").value,
        email: document.getElementById("cliente-lembrete-email").value,
        descricao: document.getElementById("descricao-lembrete").value
    };

    const dados = JSON.parse(localStorage.getItem("lembretes")) || [];
    dados.push(lembrete);
    localStorage.setItem("lembretes", JSON.stringify(dados));

    renderizarLembrete(lembrete);
    e.target.reset();
});

// Carrega dados ao abrir a página
window.addEventListener("DOMContentLoaded", () => {
    carregarAudiencias();
    carregarLembretes();
});

