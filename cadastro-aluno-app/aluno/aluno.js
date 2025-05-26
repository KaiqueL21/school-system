// aluno.js
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("aluno")) {
        document.getElementById("nav-aluno").classList.add("active");
    }

    const form = document.getElementById("aluno-form");
    const lista = document.getElementById("alunos-lista");
    const btnListar = document.getElementById("listar-alunos");
    const popup = document.getElementById("edit-popup");
    const updateForm = document.getElementById("update-form");
    const closePopup = document.getElementById("close-popup");

    function getAlunos() {
        return JSON.parse(localStorage.getItem("alunos") || "[]");
    }
    function setAlunos(alunos) {
        localStorage.setItem("alunos", JSON.stringify(alunos));
    }

    form && form.addEventListener("submit", e => {
        e.preventDefault();
        const nome = form.nome.value.trim();
        const data_nascimento = form.data_nascimento.value;
        const nota_primeiro_semestre = form.nota_primeiro_semestre.value.trim();
        const nota_segundo_semestre = form.nota_segundo_semestre.value.trim();
        const turma_id = form.turma_id.value.trim();
        if (!nome || !data_nascimento || !nota_primeiro_semestre || !nota_segundo_semestre || !turma_id) {
            alert("Preencha todos os campos.");
            return;
        }
        const alunos = getAlunos();
        alunos.push({
            id: Date.now(),
            nome, data_nascimento, nota_primeiro_semestre, nota_segundo_semestre, turma_id
        });
        setAlunos(alunos);
        form.reset();
        render();
    });

    btnListar && btnListar.addEventListener("click", render);

    function render() {
        const alunos = getAlunos();
        lista.innerHTML = "";
        if (!alunos.length) {
            lista.innerHTML = "<p>Nenhum aluno cadastrado.</p>";
            return;
        }
        const table = document.createElement("table");
        table.innerHTML = `
            <tr>
                <th>Nome</th>
                <th>Data de Nascimento</th>
                <th>Nota 1º Semestre</th>
                <th>Nota 2º Semestre</th>
                <th>ID da Turma</th>
                <th>Ações</th>
            </tr>
            ${alunos.map(a => `
                <tr>
                    <td>${a.nome}</td>
                    <td>${a.data_nascimento}</td>
                    <td>${a.nota_primeiro_semestre}</td>
                    <td>${a.nota_segundo_semestre}</td>
                    <td>${a.turma_id}</td>
                    <td>
                        <button class="edit-btn" data-id="${a.id}">Editar</button>
                        <button class="delete-btn" data-id="${a.id}">Excluir</button>
                    </td>
                </tr>
            `).join("")}
        `;
        lista.appendChild(table);

        // Editar
        table.querySelectorAll(".edit-btn").forEach(btn => {
            btn.onclick = () => {
                const id = Number(btn.dataset.id);
                const a = alunos.find(a => a.id === id);
                document.getElementById("aluno-id").value = a.id;
                document.getElementById("update-nome").value = a.nome;
                document.getElementById("update-data_nascimento").value = a.data_nascimento;
                document.getElementById("update-nota_primeiro_semestre").value = a.nota_primeiro_semestre;
                document.getElementById("update-nota_segundo_semestre").value = a.nota_segundo_semestre;
                document.getElementById("update-turma_id").value = a.turma_id;
                popup.style.display = "block";
            };
        });

        // Excluir
        table.querySelectorAll(".delete-btn").forEach(btn => {
            btn.onclick = () => {
                const id = Number(btn.dataset.id);
                setAlunos(alunos.filter(a => a.id !== id));
                render();
            };
        });
    }

    updateForm && updateForm.addEventListener("submit", e => {
        e.preventDefault();
        const id = Number(document.getElementById("aluno-id").value);
        const nome = document.getElementById("update-nome").value.trim();
        const data_nascimento = document.getElementById("update-data_nascimento").value;
        const nota_primeiro_semestre = document.getElementById("update-nota_primeiro_semestre").value.trim();
        const nota_segundo_semestre = document.getElementById("update-nota_segundo_semestre").value.trim();
        const turma_id = document.getElementById("update-turma_id").value.trim();
        let alunos = getAlunos();
        alunos = alunos.map(a =>
            a.id === id ? { id, nome, data_nascimento, nota_primeiro_semestre, nota_segundo_semestre, turma_id } : a
        );
        setAlunos(alunos);
        popup.style.display = "none";
        render();
    });

    closePopup && closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });

    if (popup) popup.style.display = "none";
    render();
});