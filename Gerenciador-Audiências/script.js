/*// Utilitário para verificar prazos
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
});*/

// --- UTILITÁRIOS ---
function verificarPrazo(prazoStr) {
    const hoje = new Date();
    const prazo = new Date(prazoStr);
    const diff = prazo - hoje;
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return dias <= 2;
}

function gerarLinksContato(nome, whatsapp, email, mensagem) {
    const tel = whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(mensagem);

    let linkZap = '#';
    if (tel.length >= 11) {  // Exemplo: 34 + 9 dígitos = 11
        linkZap = `https://wa.me/55${tel}?text=${msg}`;
    }

    const linkEmail = `mailto:${email}?subject=Lembrete&body=${msg}`;

    return `
        <a href="${linkZap}" target="_blank">📲 WhatsApp</a> |
        <a href="${linkEmail}" target="_blank">✉️ E-mail</a>
    `;
}


// --- AUDIÊNCIAS ---
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
        <button onclick="editarAudiencia(${audiencia.id})">✏️ Editar</button>
        <button onclick="excluirAudiencia(${audiencia.id})">🗑️ Excluir</button>
        <hr>
    `;
    document.getElementById("lista-audiencias").appendChild(div);
}

function carregarAudiencias() {
    document.getElementById("lista-audiencias").innerHTML = "";
    const dados = JSON.parse(localStorage.getItem("audiencias")) || [];
    dados.forEach(renderizarAudiencia);
}

function excluirAudiencia(id) {
    const dados = JSON.parse(localStorage.getItem("audiencias")) || [];
    const atualizados = dados.filter(a => a.id !== id);
    localStorage.setItem("audiencias", JSON.stringify(atualizados));
    carregarAudiencias();
}

function editarAudiencia(id) {
    const dados = JSON.parse(localStorage.getItem("audiencias")) || [];
    const audiencia = dados.find(a => a.id === id);
    if (!audiencia) return;

    document.getElementById("cliente-nome").value = audiencia.nome;
    document.getElementById("cliente-whatsapp").value = audiencia.whatsapp;
    document.getElementById("cliente-email").value = audiencia.email;
    document.getElementById("data").value = audiencia.data;
    document.getElementById("hora").value = audiencia.hora;
    document.getElementById("prazo").value = audiencia.prazo;
    document.getElementById("vara").value = audiencia.vara;
    document.getElementById("descricao").value = audiencia.descricao;

    excluirAudiencia(id);
}

document.getElementById("form-audiencia").addEventListener("submit", function (e) {
    e.preventDefault();

    const audiencia = {
        id: Date.now(),
        nome: document.getElementById("cliente-nome").value,
        whatsapp: document.getElementById("cliente-whatsapp").value,
        email: document.getElementById("cliente-email").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value,
        prazo: document.getElementById("prazo").value,
        vara: document.getElementById("vara").value,
        descricao: document.getElementById("descricao").value
    };

    const dados = JSON.parse(localStorage.getItem("audiencias")) || [];
    dados.push(audiencia);
    localStorage.setItem("audiencias", JSON.stringify(dados));
    renderizarAudiencia(audiencia);
    e.target.reset();
});

// --- LEMBRETES ---
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
        <button onclick="editarLembrete(${lembrete.id})">✏️ Editar</button>
        <button onclick="excluirLembrete(${lembrete.id})">🗑️ Excluir</button>
        <hr>
    `;
    document.getElementById("lista-lembretes").appendChild(div);
}

function carregarLembretes() {
    document.getElementById("lista-lembretes").innerHTML = "";
    const dados = JSON.parse(localStorage.getItem("lembretes")) || [];
    dados.forEach(renderizarLembrete);
}

function excluirLembrete(id) {
    const dados = JSON.parse(localStorage.getItem("lembretes")) || [];
    const atualizados = dados.filter(l => l.id !== id);
    localStorage.setItem("lembretes", JSON.stringify(atualizados));
    carregarLembretes();
}

function editarLembrete(id) {
    const dados = JSON.parse(localStorage.getItem("lembretes")) || [];
    const lembrete = dados.find(l => l.id === id);
    if (!lembrete) return;

    document.getElementById("titulo-lembrete").value = lembrete.titulo;
    document.getElementById("cliente-lembrete-nome").value = lembrete.nome;
    document.getElementById("cliente-lembrete-whatsapp").value = lembrete.whatsapp;
    document.getElementById("cliente-lembrete-email").value = lembrete.email;
    document.getElementById("data-lembrete").value = lembrete.data;
    document.getElementById("hora-lembrete").value = lembrete.hora;
    document.getElementById("prazo-lembrete").value = lembrete.prazo;
    document.getElementById("descricao-lembrete").value = lembrete.descricao;

    excluirLembrete(id);
}

document.getElementById("form-lembrete").addEventListener("submit", function (e) {
    e.preventDefault();

    const lembrete = {
        id: Date.now(),
        titulo: document.getElementById("titulo-lembrete").value,
        nome: document.getElementById("cliente-lembrete-nome").value,
        whatsapp: document.getElementById("cliente-lembrete-whatsapp").value,
        email: document.getElementById("cliente-lembrete-email").value,
        data: document.getElementById("data-lembrete").value,
        hora: document.getElementById("hora-lembrete").value,
        prazo: document.getElementById("prazo-lembrete").value,
        descricao: document.getElementById("descricao-lembrete").value
    };

    const dados = JSON.parse(localStorage.getItem("lembretes")) || [];
    dados.push(lembrete);
    localStorage.setItem("lembretes", JSON.stringify(dados));
    renderizarLembrete(lembrete);
    e.target.reset();
});

// --- CARREGAR DADOS ---
window.addEventListener("DOMContentLoaded", () => {
    carregarAudiencias();
    carregarLembretes();
});
