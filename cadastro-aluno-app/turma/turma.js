// turma.js
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("turma")) {
        document.getElementById("nav-turma").classList.add("active");
    }

    const form = document.getElementById("turma-form");
    const lista = document.getElementById("turmas-lista");
    const btnListar = document.getElementById("listar-turmas");
    const popup = document.getElementById("edit-popup");
    const updateForm = document.getElementById("update-form");
    const closePopup = document.getElementById("close-popup");

    function getTurmas() {
        return JSON.parse(localStorage.getItem("turmas") || "[]");
    }
    function setTurmas(turmas) {
        localStorage.setItem("turmas", JSON.stringify(turmas));
    }

    form && form.addEventListener("submit", e => {
        e.preventDefault();
        const turma_id = form.turma_id.value.trim();
        const nome_turma = form.nome_turma.value.trim();
        const descricao = form.descricao.value.trim();
        if (!turma_id || !nome_turma || !descricao) {
            alert("Preencha todos os campos.");
            return;
        }
        const turmas = getTurmas();
        if (turmas.some(t => t.turma_id == turma_id)) {
            alert("ID da turma já existe!");
            return;
        }
        turmas.push({ turma_id, nome_turma, descricao });
        setTurmas(turmas);
        form.reset();
        render();
    });

    btnListar && btnListar.addEventListener("click", render);

    function render() {
        const turmas = getTurmas();
        lista.innerHTML = "";
        if (!turmas.length) {
            lista.innerHTML = "<p>Nenhuma turma cadastrada.</p>";
            return;
        }
        const table = document.createElement("table");
        table.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Ações</th>
            </tr>
            ${turmas.map(t => `
                <tr>
                    <td>${t.turma_id}</td>
                    <td>${t.nome_turma}</td>
                    <td>${t.descricao}</td>
                    <td>
                        <button class="edit-btn" data-id="${t.turma_id}">Editar</button>
                        <button class="delete-btn" data-id="${t.turma_id}">Excluir</button>
                    </td>
                </tr>
            `).join("")}
        `;
        lista.appendChild(table);

        // Editar
        table.querySelectorAll(".edit-btn").forEach(btn => {
            btn.onclick = () => {
                const turma_id = btn.dataset.id;
                const t = turmas.find(t => t.turma_id == turma_id);
                document.getElementById("turma-id").value = t.turma_id;
                document.getElementById("update-turma_id").value = t.turma_id;
                document.getElementById("update-nome_turma").value = t.nome_turma;
                document.getElementById("update-descricao").value = t.descricao;
                popup.style.display = "block";
            };
        });

        // Excluir
        table.querySelectorAll(".delete-btn").forEach(btn => {
            btn.onclick = () => {
                const turma_id = btn.dataset.id;
                setTurmas(turmas.filter(t => t.turma_id != turma_id));
                render();
            };
        });
    }

    updateForm && updateForm.addEventListener("submit", e => {
        e.preventDefault();
        const oldId = document.getElementById("turma-id").value;
        const turma_id = document.getElementById("update-turma_id").value.trim();
        const nome_turma = document.getElementById("update-nome_turma").value.trim();
        const descricao = document.getElementById("update-descricao").value.trim();
        let turmas = getTurmas();
        // Checa se mudou o ID e se já existe outro igual
        if (turma_id !== oldId && turmas.some(t => t.turma_id == turma_id)) {
            alert("ID da turma já existe!");
            return;
        }
        turmas = turmas.map(t =>
            t.turma_id == oldId ? { turma_id, nome_turma, descricao } : t
        );
        setTurmas(turmas);
        popup.style.display = "none";
        render();
    });

    closePopup && closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });

    if (popup) popup.style.display = "none";
    render();
});