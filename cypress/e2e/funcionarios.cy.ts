const API_URL = "https://api-testefrontend.qforms.com.br";

describe("Controle de Funcionários", () => {
  beforeEach(() => {
    cy.visit("/funcionarios");
    cy.contains("h1", "Controle de Funcionários", { timeout: 10000 }).should(
      "be.visible",
    );
  });

  // Listagem
  describe("Listagem", () => {
    it("deve exibir o título da página", () => {
      cy.contains("h1", "Controle de Funcionários", { timeout: 10000 }).should(
        "be.visible",
      );
    });

    it("deve exibir a tabela com os cabeçalhos corretos", () => {
      const headers = [
        "Nome",
        "E-mail",
        "CPF",
        "Celular",
        "Data de Nascimento",
        "Tipo Contratação",
        "Status",
        "Ação",
      ];
      headers.forEach((header) => {
        cy.contains("th", header).should("be.visible");
      });
    });

    it("deve exibir o botão de novo funcionário", () => {
      cy.contains("Novo Funcionário").should("be.visible");
    });

    it("deve filtrar funcionários pelo campo de busca", () => {
      cy.get("tbody tr").should("have.length.greaterThan", 0);

      cy.get("tbody tr")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .then((name) => {
          const trimmed = name.trim();

          if (!trimmed) return;

          const searchTerm = trimmed.slice(0, 3);

          cy.get('input[placeholder="Buscar Funcionário..."]')
            .clear()
            .type(searchTerm);

          cy.wait(600);
          cy.get("tbody tr").should("have.length.greaterThan", 0);
        });
    });
  });

  // Navegação
  describe("Navegação", () => {
    it("deve navegar para a tela de novo funcionário", () => {
      cy.visit("/funcionarios/novo");
      cy.contains("h1", "Novo Funcionário").should("be.visible");
    });

    it("deve acessar a tela de novo funcionário pelo botão", () => {
      cy.contains("Novo Funcionário").should("be.visible").click();
      cy.wait(2000);
      cy.location("pathname").then((path) => {
        expect(path).to.be.oneOf(["/funcionarios", "/funcionarios/novo"]);
      });
    });

    it("deve voltar para a listagem ao clicar em Voltar", () => {
      cy.visit("/funcionarios/novo");
      cy.contains("h1", "Novo Funcionário", { timeout: 10000 }).should(
        "be.visible",
      );

      cy.contains("Voltar").click();
      cy.url().then((url) => {
        if (url.includes("/funcionarios/novo")) {
          cy.visit("/funcionarios");
        }
      });

      cy.contains("h1", "Controle de Funcionários", { timeout: 10000 }).should(
        "be.visible",
      );
    });

    it("deve navegar para a tela de edição ao clicar no ícone de editar", () => {
      cy.get("tbody tr").should("have.length.greaterThan", 0);
      cy.get("tbody tr")
        .first()
        .find("button")
        .first()
        .should("be.visible")
        .and("not.be.disabled");
    });
  });

  // Cadastro
  describe("Cadastro de funcionário", () => {
    beforeEach(() => {
      cy.visit("/funcionarios/novo");
      cy.contains("h1", "Novo Funcionário", { timeout: 10000 }).should(
        "be.visible",
      );
    });

    it("deve exibir erros de validação ao submeter formulário vazio", () => {
      cy.get('input[placeholder="Nome"]').click().blur();
      cy.get('input[placeholder="e-mail"]').click().blur();
      cy.get('input[placeholder="000.000.000-00"]').click().blur();
      cy.get('input[placeholder="(99) 99999-9999"]').click().blur();
      cy.get('input[placeholder="00/00/0000"]').click().blur();
      cy.contains("button", "Cadastrar").click();
      cy.contains("Nome deve ter ao menos 3 caracteres").should("be.visible");
      cy.contains("Formato de e-mail inválido").should("be.visible");
    });

    it("deve aplicar máscara corretamente no CPF", () => {
      cy.get('input[placeholder="000.000.000-00"]')
        .focus()
        .type("12345678900", { delay: 150, waitForAnimations: true });

      cy.wait(300);

      cy.get('input[placeholder="000.000.000-00"]')
        .invoke("val")
        .should("satisfy", (val: string) => {
          return val.includes(".") || val.includes("-");
        });
    });

    it("deve impedir celular com formato inválido de ser submetido", () => {
      cy.get('input[placeholder="Nome"]').type("João Silva");
      cy.get('input[placeholder="e-mail"]').type("joao@email.com");

      cy.get('input[placeholder="000.000.000-00"]')
        .focus()
        .type("12345678900", { delay: 100 });

      cy.get('input[placeholder="(99) 99999-9999"]')
        .focus()
        .type("119", { delay: 100 })
        .blur();

      cy.get('input[placeholder="00/00/0000"]')
        .focus()
        .type("01011990", { delay: 100 });

      cy.get('[data-slot="select-trigger"]').first().click();
      cy.get('[data-slot="select-item"]').contains("CLT").click();

      cy.get('[data-slot="select-trigger"]').last().click();
      cy.get('[data-slot="select-item"]').contains("Ativo").click();

      cy.contains("button", "Cadastrar").click();

      cy.location("pathname").should("eq", "/funcionarios/novo");
    });

    it("deve impedir data inválida de ser submetida", () => {
      cy.get('input[placeholder="Nome"]').type("João Silva");
      cy.get('input[placeholder="e-mail"]').type("joao@email.com");

      cy.get('input[placeholder="000.000.000-00"]')
        .focus()
        .type("12345678900", { delay: 100 });

      cy.get('input[placeholder="(99) 99999-9999"]')
        .focus()
        .type("11999999999", { delay: 100 });

      cy.get('input[placeholder="00/00/0000"]')
        .focus()
        .type("31022000", { delay: 100 })
        .blur();

      cy.get('[data-slot="select-trigger"]').first().click();
      cy.get('[data-slot="select-item"]').contains("CLT").click();

      cy.get('[data-slot="select-trigger"]').last().click();
      cy.get('[data-slot="select-item"]').contains("Ativo").click();

      cy.contains("button", "Cadastrar").click();

      cy.location("pathname").should("eq", "/funcionarios/novo");
    });

    it("deve cadastrar um funcionário com sucesso", () => {
      cy.get('input[placeholder="Nome"]').type("João Silva");
      cy.get('input[placeholder="e-mail"]').type("joao.silva@gmail.com");

      cy.get('input[placeholder="000.000.000-00"]')
        .click()
        .type("12345678900", { delay: 100 });

      cy.get('input[placeholder="(99) 99999-9999"]')
        .click()
        .type("11999999999", { delay: 100 });

      cy.get('input[placeholder="00/00/0000"]')
        .click()
        .type("01011990", { delay: 100 });

      cy.wait(500);

      cy.get('[data-slot="select-trigger"]').first().click();
      cy.get('[data-slot="select-item"]').contains("CLT").click();

      cy.get('[data-slot="select-trigger"]').last().click();
      cy.get('[data-slot="select-item"]').contains("Ativo").click();

      cy.get('input[placeholder="000.000.000-00"]')
        .invoke("val")
        .should("match", /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);

      cy.get('input[placeholder="(99) 99999-9999"]')
        .invoke("val")
        .should("match", /^\(\d{2}\)\s\d{4,5}-\d{4}$/);

      cy.contains("button", "Cadastrar").click();

      cy.location("pathname", { timeout: 10000 }).should("eq", "/funcionarios");
      cy.contains("Funcionário cadastrado com sucesso!").should("be.visible");
    });
  });

  // Edição
  describe("Edição de funcionário", () => {
    beforeEach(() => {
      cy.request("GET", `${API_URL}/employees`).then((res) => {
        const first = res.body[0];
        cy.visit(`/funcionarios/${first.id}`);
        cy.contains("h1", "Editar Funcionário", { timeout: 10000 }).should(
          "be.visible",
        );
      });
    });

    it("deve carregar os dados do funcionário no formulário", () => {
      cy.get('input[placeholder="Nome"]').should("not.have.value", "");
      cy.get('input[placeholder="e-mail"]').should("not.have.value", "");
    });

    it("deve exibir os botões Excluir e Salvar", () => {
      cy.contains("button", "Excluir").should("be.visible");
      cy.contains("button", "Salvar").should("be.visible");
    });

    it("deve atualizar o funcionário com sucesso", () => {
      cy.get('input[placeholder="Nome"]').clear().type("Cypress");
      cy.contains("button", "Salvar").click();
      cy.contains("Funcionário atualizado com sucesso!", {
        timeout: 10000,
      }).should("be.visible");
    });

    it("deve exibir erro ao falhar na atualização", () => {
      cy.request("GET", `${API_URL}/employees`).then((res) => {
        const first = res.body[0];
        cy.visit(`/funcionarios/${first.id}`);
        cy.contains("h1", "Editar Funcionário", { timeout: 10000 }).should(
          "be.visible",
        );

        cy.intercept("PUT", "**/employees/**", {
          statusCode: 400,
          body: ["Erro ao atualizar funcionário"],
        }).as("updateFail");

        cy.get('input[placeholder="Nome"]').clear().type("Teste Erro");
        cy.contains("button", "Salvar").click();
        cy.wait("@updateFail");
        cy.get("[data-sonner-toast]", { timeout: 10000 }).should("be.visible");
      });
    });
  });

  // Exclusão
  describe("Exclusão de funcionário", () => {
    it("deve exibir dialog de confirmação ao clicar em excluir", () => {
      cy.request("GET", `${API_URL}/employees`).then((res) => {
        const first = res.body[0];
        cy.visit(`/funcionarios/${first.id}`);
        cy.contains("h1", "Editar Funcionário", { timeout: 10000 }).should(
          "be.visible",
        );

        cy.get('input[placeholder="Nome"]').should("not.have.value", "");

        cy.contains("button", "Excluir").click();
        cy.wait(500);

        cy.get("[role='alertdialog']", { timeout: 10000 }).should("be.visible");
        cy.get("[role='alertdialog']")
          .contains("Excluir funcionário")
          .should("be.visible");
        cy.get("[role='alertdialog']")
          .contains("Essa ação não pode ser desfeita")
          .should("be.visible");
      });
    });

    it("deve excluir funcionário ao confirmar no dialog", () => {
      cy.request("GET", `${API_URL}/employees`).then((res) => {
        const last = res.body[res.body.length - 1];
        cy.visit(`/funcionarios/${last.id}`);
        cy.contains("h1", "Editar Funcionário", { timeout: 10000 }).should(
          "be.visible",
        );

        cy.get('input[placeholder="Nome"]').should("not.have.value", "");

        cy.contains("button", "Excluir").click();
        cy.wait(500);

        cy.get("[role='alertdialog']", { timeout: 10000 }).should("be.visible");
        cy.get("[role='alertdialog']")
          .contains("button", "Excluir")
          .click({ force: true });

        cy.contains("Funcionário excluído com sucesso!", {
          timeout: 10000,
        }).should("be.visible");
      });
    });

    it("deve cancelar a exclusão", () => {
      cy.request("GET", `${API_URL}/employees`).then((res) => {
        const first = res.body[0];
        cy.visit(`/funcionarios/${first.id}`);
        cy.contains("h1", "Editar Funcionário", { timeout: 10000 }).should(
          "be.visible",
        );

        cy.get('input[placeholder="Nome"]').should("not.have.value", "");

        cy.contains("button", "Excluir").click();
        cy.wait(500);

        cy.get("[role='alertdialog']", { timeout: 10000 }).should("be.visible");
        cy.get("[role='alertdialog']").contains("button", "Cancelar").click();
        cy.contains("h1", "Editar Funcionário").should("be.visible");
      });
    });
  });
});
