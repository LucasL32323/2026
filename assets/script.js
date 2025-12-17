const API_URL = 'http://localhost:3001/login';

document.addEventListener('DOMContentLoaded', () => {
    listarUsuarios();
});

function listarUsuarios() {
    console.group("Requisição GET (Listar Usuários)");
    fetch(API_URL)
        .then(async response => {
            console.log("Status da resposta:", response.status);
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        })
        .then(data => {
            console.log("Dados recebidos:", data);
            console.groupEnd();
            const tbody = document.querySelector("#tabela-usuarios tbody");
            tbody.innerHTML = "";
            data.forEach(usuario => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.senha}</td>
                    <td>
                        <button class="btn btn-editar" onclick="carregarDadosEdicao('${usuario.id}')">Editar</button>
                        <button class="btn btn-deletar" onclick="deletarUsuario('${usuario.id}')">Deletar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Erro capturado:", error);
            console.groupEnd();
            const tbody = document.querySelector("#tabela-usuarios tbody");
            tbody.innerHTML = `<tr><td colspan="4" style="color: red; text-align: center;">Erro ao carregar dados: ${error.message}</td></tr>`;
        });
}

function salvarUsuario() {
    const id = document.getElementById("id-usuario").value;
    const usuarioInput = document.getElementById("input-usuario").value;
    const senhaInput = document.getElementById("input-senha").value;
    if (!usuarioInput || !senhaInput) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    const dadosUsuario = {
        usuario: usuarioInput,
        senha: senhaInput
    };

    let metodo = 'POST';
    let url = API_URL;
    let acaoTexto = "Cadastrar";
    if (id) {
        metodo = 'PUT';
        url = `${API_URL}/${id}`;
        acaoTexto = "Atualizar";
    }
    console.group(`Requisição ${metodo} (${acaoTexto})`);
    fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosUsuario)
    })
    .then(async response => {
        const status = response.status;
        const statusText = response.statusText;
        console.log("Resposta da API:", status, statusText);
        if (!response.ok) {
            throw { status: status, statusText: statusText, message: "Falha na requisição" };
        }
        const data = await response.json();
        return { status, statusText, data };
    })
    .then(({ status, statusText, data }) => {
        console.log("Sucesso:", data);
        console.groupEnd();
        const message = `
        SUCESSO!
        Operação: ${metodo}
        Status Code: ${status} (${statusText})
        ID do Registro: ${data.id}
        `;
        alert(message);
        limparFormulario();
        listarUsuarios();
    })
    .catch(error => {
        console.error("Erro capturado:", error);
        console.groupEnd();
        let msgError = "Erro desconhecido.";
        if (error.message) {
            msgError = `
            ERRO NO SERVIDOR!
            Status: ${error.status} (${error.statusText})
            A operação não foi salva.
            `;
        } else {
            msgError = `
            ERRO DE CONEXÃO: Verifique se o servidor (npm start) está rodando.
            `;
        }
        alert(msgError);
    });
}

function carregarDadosEdicao(id) {
    console.log(`Buscando dados para edição do ID: ${id}`);
    fetch(`${API_URL}/${id}`)
        .then(async response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(usuario => {
            document.getElementById("id-usuario").value = usuario.id;
            document.getElementById("input-usuario").value = usuario.usuario;
            document.getElementById("input-senha").value = usuario.senha;
            document.querySelector(".btn-salvar").innerHTML = "Atualizar";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => {
            console.error(`Erro ao carregar dados para edição: ${error.message}`);
        })
}

function deleteUsuario(id){
    if (confirm(`Tem certeza que deseja excluir o usuário de ID ${id}`)){
    console.group(`Requisição DELETE(Deletar id:${id}`);
    fetch(`${API_URL}/${id}`,{
    method:"DELETE"
    })
    
    .then(response =>{
        console.log("Status DELETE" , response.status);
            if(!response.ok){
            throw {status:response.status, statusText:response.statusText};
            }
        return response;
        })
            
  
    .then (response =>{
        console.groupEnd();
        alert(`
            Sucesso!
            Usuário Excluido com sucesso.
            Status Code:${response.status})
            `);
            listarUsuarios();

    })

    .catch(error =>
{
    console.error("Erro ao deletar" , error);
    console.groupEnd();
    let msgError = "Erro ao excluir";
    if(erro.status){
        msgError = `Erro($(error.status)Não foi possível excluir o registro`;
    }
    alert(msgError);
});
    }
}

function limparFormulario(){
    document.getElementById("id-usuario").value="";
    document.getElementById("input-usuario").value="";
    document.getElementById("input-senha").value="";
    document.getElementById("btn-salvar").innerText="Salvar";
    
}