document.addEventListener("DOMContentLoaded", () => {
  // Controle das abas
  const tabs = document.querySelectorAll("nav button.tab-btn");
  const sections = document.querySelectorAll("main section");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      sections.forEach(s => {
        s.id === target ? s.classList.add("active") : s.classList.remove("active");
      });
    });
  });

  // Função para salvar formulário e gerar PDF
  function handleForm(formId, fields, pdfTitle) {
    const form = document.getElementById(formId);
    const msg = form.querySelector(".success");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // coletar dados
      const data = {};
      for (const field of fields) {
        const el = form.querySelector("#" + field);
        if (!el) continue;
        if (el.type === "checkbox") {
          data[field] = el.checked;
        } else {
          data[field] = el.value;
        }
      }
      // salvar no localStorage
      localStorage.setItem(formId, JSON.stringify(data));
      msg.textContent = "Salvo com sucesso!";
      setTimeout(() => { msg.textContent = ""; }, 4000);
      form.reset();
    });

    const btnPdf = document.getElementById("btnPdf" + formId.replace("form",""));
    btnPdf.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(pdfTitle, 10, 10);
      doc.setFontSize(12);
      let y = 20;
      for (const field of fields) {
        const el = form.querySelector("#" + field);
        if (!el) continue;
        let val;
        if (el.type === "checkbox") {
          val = el.checked ? "Sim" : "Não";
        } else {
          val = el.value || "-";
        }
        // quebra texto em múltiplas linhas se for muito longo
        const label = form.querySelector(`label[for='${field}']`);
        const labelText = label ? label.textContent.replace(":", "") : field;
        const lines = doc.splitTextToSize(`${labelText}: ${val}`, 180);
        doc.text(lines, 10, y);
        y += lines.length * 7;
        if(y > 280) {
          doc.addPage();
          y = 10;
        }
      }
      doc.save(`${pdfTitle.replace(/\s+/g, "_").toLowerCase()}.pdf`);
    });
  }

  // Chamadas handleForm para cada formulário com seus campos importantes e título PDF
  handleForm("formCadastro", [
    "nome","cpf","email","funcao","setor","admissao","exposicao",
    "jornada","condicao","ciencia"
  ], "Ficha de Cadastro de Colaborador");

  handleForm("formDeclaracao", [
    "nomeDecl","cpfDecl","condicaoEmocional","descricaoCondicao","cienciaDecl"
  ], "Declaração de Saúde Psicossocial");

  handleForm("formQuestionario", [
    "nomeQ","cpfQ","q1","q2","q3","cienciaQ"
  ], "Questionário Periódico de Avaliação de Saúde Mental");

  handleForm("formPlano", [
    "nomePlano","cpfPlano","dataInicio","descricaoProblema","objetivoPlano",
    "responsavelPlano","medidasPlano","prazoPlano","validacaoPlano"
  ], "Plano de Ação para Suporte Psicológico");

  handleForm("formCompromisso", [
    "empresaNome","cnpjEmpresa","responsavelEmpresa","cargoResponsavel",
    "dataCompromisso","confirmacaoCompromisso"
  ], "Declaração de Compromisso da Empresa com Saúde Mental");

  handleForm("formEncRH", [
    "nomeEncRH","cpfEncRH","setorEncRH","motivoEncRH","rhResponsavel",
    "dataEncRH","confirmacaoEncRH"
  ], "Termo de Encaminhamento do RH para Psicólogo");

  handleForm("formEncPsiq", [
    "nomeEncPsiq","cpfEncPsiq","motivoEncPsiq","nomePsiq","dataEncPsiq","confirmacaoEncPsiq"
  ], "Termo de Encaminhamento da Psicóloga para Psiquiatra");

  handleForm("formTermoSST", [
    "nomeTermoSST","cpfTermoSST","setorTermoSST","confirmacaoTermoSST"
  ], "Termo de Compromisso e Engajamento em SST");

  handleForm("formDesligamento", [
    "nomeDeslig","cpfDeslig","dataDeslig","suporteEmocional",
    "situacoesAfectaram","confirmacaoDeslig"
  ], "Entrevista de Desligamento");
});
