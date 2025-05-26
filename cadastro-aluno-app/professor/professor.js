document.addEventListener("DOMContentLoaded", () => {
    // Destaca o menu
    if (window.location.pathname.includes("professor")) {
        document.getElementById("nav-professor").classList.add("active");
    }

    // Elementos
    const form = document.getElementById("professor-form");
    const lista = document.getElementById("professores-lista");
    const btnListar = document.getElementById("listar-professores");
    const popup = document.getElementById("edit-popup");
    const updateForm = document.getElementById("update-form");
    const closePopup = document.getElementById("close-popup");

    // Utilidades Local Storage
    function getProfessores() {
        return JSON.parse(localStorage.getItem("professores") || "[]");
    }
    function setProfessores(profs) {
        localStorage.setItem("professores", JSON.stringify(profs));
    }

    // Cadastro
    form && form.addEventListener("submit", e => {
        e.preventDefault();
        const nome = form.nome.value.trim();
        const especializacao = form.especializacao.value.trim();
        const data_nascimento = form.data_nascimento.value;
        const turma_id = form.turma_id.value.trim();
        if (!nome || !especializacao || !data_nascimento || !turma_id) {
            alert("Preencha todos os campos.");
            return;
        }
        const professores = getProfessores();
        professores.push({
            id: Date.now(),
            nome, especializacao, data_nascimento, turma_id
        });
        setProfessores(professores);
        form.reset();
        render();
    });

    // Listar
    btnListar && btnListar.addEventListener("click", render);

    function render() {
        const professores = getProfessores();
        lista.innerHTML = "";
        if (!professores.length) {
            lista.innerHTML = "<p>Nenhum professor cadastrado.</p>";
            return;
        }
        const table = document.createElement("table");
        table.innerHTML = `
            <tr>
                <th>Nome</th>
                <th>Especialização</th>
                <th>Data de Nascimento</th>
                <th>ID da Turma</th>
                <th>Ações</th>
            </tr>
            ${professores.map(p => `
                <tr>
                    <td>${p.nome}</td>
                    <td>${p.especializacao}</td>
                    <td>${p.data_nascimento}</td>
                    <td>${p.turma_id}</td>
                    <td>
                        <button class="edit-btn" data-id="${p.id}">Editar</button>
                        <button class="delete-btn" data-id="${p.id}">Excluir</button>
                    </td>
                </tr>
            `).join("")}
        `;
        lista.appendChild(table);

        // Editar
        table.querySelectorAll(".edit-btn").forEach(btn => {
            btn.onclick = () => {
                const id = Number(btn.dataset.id);
                const p = professores.find(p => p.id === id);
                document.getElementById("professor-id").value = p.id;
                document.getElementById("update-nome").value = p.nome;
                document.getElementById("update-especializacao").value = p.especializacao;
                document.getElementById("update-data_nascimento").value = p.data_nascimento;
                document.getElementById("update-turma_id").value = p.turma_id;
                popup.style.display = "block";
            };
        });

        // Excluir
        table.querySelectorAll(".delete-btn").forEach(btn => {
            btn.onclick = () => {
                const id = Number(btn.dataset.id);
                setProfessores(professores.filter(p => p.id !== id));
                render();
            };
        });
    }

    // Atualizar
    updateForm && updateForm.addEventListener("submit", e => {
        e.preventDefault();
        const id = Number(document.getElementById("professor-id").value);
        const nome = document.getElementById("update-nome").value.trim();
        const especializacao = document.getElementById("update-especializacao").value.trim();
        const data_nascimento = document.getElementById("update-data_nascimento").value;
        const turma_id = document.getElementById("update-turma_id").value.trim();
        let professores = getProfessores();
        professores = professores.map(p =>
            p.id === id ? { id, nome, especializacao, data_nascimento, turma_id } : p
        );
        setProfessores(professores);
        popup.style.display = "none";
        render();
    });

    // Fechar popup
    closePopup && closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });

    // Esconde popup ao iniciar
    if (popup) popup.style.display = "none";
    render();
});