/* ==========================================
   SANTOS CHEFIA
   PAINEL ADMINISTRATIVO
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        iniciarLogin();

        iniciarPainel();

    }
);


/* ==========================================
   CHAVES
========================================== */

const CHAVE_PRODUTOS =
    "santosChefiaProdutos";

const CHAVE_PEDIDOS =
    "santosChefiaPedidos";

const URL_BACKEND =
    "https://santos-chefia.onrender.com";


/* ==========================================
   CATEGORIAS OFICIAIS
========================================== */

const CATEGORIAS_SANTOS_CHEFIA = [

    "Início",

    "Inverno",

    "Bonés Premium",

    "Camisetas Básicas",

    "Camisetas Polo",

    "Shorts",

    "Calça Jeans",

    "Joias",

    "Perfumes",

    "Carteira",

    "Cueca"

];


/* ==========================================
   CONFIGURAÇÃO PADRÃO DE FRETE
========================================== */

const DIMENSOES_PADRAO_ROUPA = {

    peso:
        0.5,

    comprimento:
        30,

    largura:
        20,

    altura:
        10

};


let imagemProdutoAtual =
    "";


/* ==========================================
   STATUS QUE BAIXAM ESTOQUE
========================================== */

const STATUS_COM_ESTOQUE_BAIXADO = [

    "Pago",

    "Em preparação",

    "Enviado",

    "Pronto para retirada",

    "Concluído"

];


/* ==========================================
   LOGIN
========================================== */

function iniciarLogin() {

    const formLogin =
        document.getElementById(
            "formLogin"
        );


    if (!formLogin) {

        return;

    }


    const usuario =
        document.getElementById(
            "usuarioAdmin"
        );


    const senha =
        document.getElementById(
            "senhaAdmin"
        );


    const mensagem =
        document.getElementById(
            "mensagemLogin"
        );


    const mostrarSenha =
        document.getElementById(
            "mostrarSenha"
        );


    if (mostrarSenha) {

        mostrarSenha.addEventListener(
            "click",
            function () {

                if (
                    senha.type ===
                    "password"
                ) {

                    senha.type =
                        "text";

                    mostrarSenha.textContent =
                        "🙈";

                }

                else {

                    senha.type =
                        "password";

                    mostrarSenha.textContent =
                        "👁";

                }

            }
        );

    }


    formLogin.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const usuarioDigitado =
                usuario.value
                    .trim()
                    .toLowerCase();


            const senhaDigitada =
                senha.value
                    .trim();


            if (
                usuarioDigitado ===
                "admin"
                &&
                senhaDigitada ===
                "santos123"
            ) {

                localStorage.setItem(
                    "santosChefiaAdminLogado",
                    "true"
                );


                window.location.href =
                    "painel.html";


                return;

            }


            if (mensagem) {

                mensagem.textContent =
                    "Usuário ou senha incorretos.";

            }

        }
    );

}


/* ==========================================
   INICIAR PAINEL
========================================== */

function iniciarPainel() {

    const painel =
        document.querySelector(
            ".admin-page"
        );


    if (!painel) {

        return;

    }


    verificarLoginAdmin();

    iniciarMenuAdmin();

    iniciarAtalhos();

    iniciarBotaoSair();

    iniciarConfiguracoes();

    iniciarProdutos();

    iniciarPedidos();

    atualizarDashboard();

    iniciarAtualizacaoEntreAbas();

}


/* ==========================================
   VERIFICAR LOGIN
========================================== */

function verificarLoginAdmin() {

    const logado =
        localStorage.getItem(
            "santosChefiaAdminLogado"
        );


    if (
        logado !==
        "true"
    ) {

        window.location.href =
            "login.html";

    }

}


/* ==========================================
   MENU
========================================== */

function iniciarMenuAdmin() {

    const botoes =
        document.querySelectorAll(
            ".menu-item"
        );


    botoes.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    abrirSecao(
                        botao.dataset.section
                    );

                }
            );

        }
    );

}


/* ==========================================
   ABRIR SEÇÃO
========================================== */

function abrirSecao(
    secao
) {

    document
        .querySelectorAll(
            ".admin-section"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "ativa"
                );

            }
        );


    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "ativo"
                );

            }
        );


    const secaoSelecionada =
        document.getElementById(
            secao
        );


    const botaoSelecionado =
        document.querySelector(
            `.menu-item[data-section="${secao}"]`
        );


    if (secaoSelecionada) {

        secaoSelecionada.classList.add(
            "ativa"
        );

    }


    if (botaoSelecionado) {

        botaoSelecionado.classList.add(
            "ativo"
        );

    }


    atualizarTitulo(
        secao
    );


    if (
        secao ===
        "pedidos"
    ) {

        renderizarPedidos();

    }


    if (
        secao ===
        "clientes"
    ) {

        renderizarClientes();

    }

}


/* ==========================================
   TÍTULO
========================================== */

function atualizarTitulo(
    secao
) {

    const titulo =
        document.getElementById(
            "tituloPagina"
        );


    if (!titulo) {

        return;

    }


    const titulos = {

        dashboard:
            "Dashboard",

        produtos:
            "Produtos",

        pedidos:
            "Pedidos",

        clientes:
            "Clientes",

        configuracoes:
            "Configurações"

    };


    titulo.textContent =
        titulos[secao] ||
        "Painel";

}


/* ==========================================
   ATALHOS
========================================== */

function iniciarAtalhos() {

    document
        .querySelectorAll(
            "[data-ir]"
        )
        .forEach(
            function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        abrirSecao(
                            botao.dataset.ir
                        );

                    }
                );

            }
        );

}


/* ==========================================
   SAIR
========================================== */

function iniciarBotaoSair() {

    const botao =
        document.getElementById(
            "sairAdmin"
        );


    if (!botao) {

        return;

    }


    botao.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "santosChefiaAdminLogado"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* ==========================================
   CONFIGURAÇÕES
========================================== */

function iniciarConfiguracoes() {

    const botao =
        document.getElementById(
            "salvarConfiguracoes"
        );


    if (!botao) {

        return;

    }


    botao.addEventListener(
        "click",
        function () {

            alert(
                "Configurações salvas na demonstração."
            );

        }
    );

}


/* ==========================================
   INICIAR PRODUTOS
========================================== */

function iniciarProdutos() {

    const novoProduto =
        document.getElementById(
            "novoProduto"
        );

    const fecharModal =
        document.getElementById(
            "fecharModalProduto"
        );

    const modal =
        document.getElementById(
            "modalProduto"
        );

    const form =
        document.getElementById(
            "formProduto"
        );

    const imagemInput =
        document.getElementById(
            "produtoImagem"
        );

    if (!modal) {
        return;
    }

    if (novoProduto) {
        novoProduto.addEventListener(
            "click",
            abrirModalNovoProduto
        );
    }

    if (fecharModal) {
        fecharModal.addEventListener(
            "click",
            fecharModalProduto
        );
    }

    modal.addEventListener(
        "click",
        function (event) {
            if (event.target === modal) {
                fecharModalProduto();
            }
        }
    );

    if (form) {
        form.addEventListener(
            "submit",
            salvarProduto
        );
    }

    if (imagemInput) {
        imagemInput.addEventListener(
            "change",
            carregarImagemProduto
        );
    }

    aplicarDimensoesNosProdutosAntigos();

    migrarCategoriasAntigas();

    renderizarProdutosAdmin();

    carregarProdutosOnline();

}


/* ==========================================
   DIMENSÕES EM PRODUTOS ANTIGOS
========================================== */

function aplicarDimensoesNosProdutosAntigos() {

    const produtos =
        pegarProdutos();


    let alterou =
        false;


    produtos.forEach(
        function (produto) {

            if (
                !produto.frete
            ) {

                produto.frete = {

                    ...DIMENSOES_PADRAO_ROUPA

                };


                alterou =
                    true;

            }

        }
    );


    if (alterou) {

        salvarListaProdutos(
            produtos
        );

    }

}


/* ==========================================
   MIGRAR CATEGORIAS ANTIGAS
========================================== */

function migrarCategoriasAntigas() {

    const produtos =
        pegarProdutos();


    let alterou =
        false;


    produtos.forEach(
        function (produto) {

            const antiga =
                String(
                    produto.categoria || ""
                )
                    .trim();


            const mapa = {

                "Camisetas":
                    "Camisetas Básicas",

                "Polos":
                    "Camisetas Polo",

                "Camisas":
                    "Camisetas Básicas",

                "Calças":
                    "Calça Jeans",

                "Jaquetas":
                    "Inverno",

                "Acessórios":
                    "Joias",

                "Outros":
                    "Início"

            };


            if (
                mapa[antiga]
            ) {

                produto.categoria =
                    mapa[antiga];

                alterou =
                    true;

            }

        }
    );


    if (alterou) {

        salvarListaProdutos(
            produtos
        );

    }

}


/* ==========================================
   NOVO PRODUTO
========================================== */

function abrirModalNovoProduto() {

    const modal =
        document.getElementById(
            "modalProduto"
        );


    const form =
        document.getElementById(
            "formProduto"
        );


    const titulo =
        document.getElementById(
            "tituloModalProduto"
        );


    const preview =
        document.getElementById(
            "previewProduto"
        );


    if (form) {

        form.reset();

    }


    const id =
        document.getElementById(
            "produtoId"
        );


    if (id) {

        id.value =
            "";

    }


    imagemProdutoAtual =
        "";


    if (preview) {

        preview.innerHTML =
            "Nenhuma imagem selecionada";

    }


    if (titulo) {

        titulo.textContent =
            "Novo Produto";

    }


    if (modal) {

        modal.classList.add(
            "ativo"
        );

    }

}


/* ==========================================
   FECHAR MODAL
========================================== */

function fecharModalProduto() {

    const modal =
        document.getElementById(
            "modalProduto"
        );


    if (modal) {

        modal.classList.remove(
            "ativo"
        );

    }

}


/* ==========================================
   CARREGAR IMAGEM
========================================== */

function carregarImagemProduto(
    event
) {

    const arquivo =
        event.target.files[0];


    if (!arquivo) {

        return;

    }


    if (
        arquivo.size >
        2 * 1024 * 1024
    ) {

        alert(
            "Escolha uma imagem menor que 2 MB."
        );


        event.target.value =
            "";


        return;

    }


    const leitor =
        new FileReader();


    leitor.onload =
        function () {

            imagemProdutoAtual =
                leitor.result;


            atualizarPreviewImagem(
                imagemProdutoAtual
            );

        };


    leitor.readAsDataURL(
        arquivo
    );

}


/* ==========================================
   PREVIEW
========================================== */

function atualizarPreviewImagem(
    imagem
) {

    const preview =
        document.getElementById(
            "previewProduto"
        );


    if (!preview) {

        return;

    }


    if (!imagem) {

        preview.innerHTML =
            "Nenhuma imagem selecionada";


        return;

    }


    preview.innerHTML = `

        <img
            src="${imagem}"
            alt="Preview do produto"
        >

    `;

}


/* ==========================================
   PEGAR PRODUTOS - CACHE LOCAL
========================================== */

function pegarProdutos() {

    const salvo =
        localStorage.getItem(
            CHAVE_PRODUTOS
        );

    if (!salvo) {

        return [];

    }

    try {

        const dados =
            JSON.parse(
                salvo
            );

        return Array.isArray(
            dados
        )
            ?
            dados
            :
            [];

    }

    catch (erro) {

        console.error(
            "Erro ao carregar produtos do cache:",
            erro
        );

        return [];

    }

}


/* ==========================================
   SALVAR CACHE LOCAL
========================================== */

function salvarListaProdutos(
    produtos
) {

    localStorage.setItem(
        CHAVE_PRODUTOS,
        JSON.stringify(
            produtos
        )
    );

}


/* ==========================================
   CARREGAR PRODUTOS ONLINE
========================================== */

async function carregarProdutosOnline() {

    try {

        const resposta =
            await fetch(
                `${URL_BACKEND}/produtos`
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok
            ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível carregar os produtos."
            );

        }


        const produtos =
            Array.isArray(
                dados.produtos
            )
                ?
                dados.produtos
                :
                [];


        salvarListaProdutos(
            produtos
        );


        renderizarProdutosAdmin();

        atualizarDashboard();


        return produtos;

    }

    catch (erro) {

        console.error(
            "Erro ao carregar produtos online:",
            erro
        );


        renderizarProdutosAdmin();

        atualizarDashboard();


        return pegarProdutos();

    }

}


/* ==========================================
   SALVAR PRODUTO ONLINE
========================================== */

async function salvarProduto(
    event
) {

    event.preventDefault();


    const id =
        document.getElementById(
            "produtoId"
        ).value;


    const nome =
        document.getElementById(
            "produtoNome"
        ).value.trim();


    const categoria =
        document.getElementById(
            "produtoCategoria"
        ).value;


    const preco =
        Number(
            document.getElementById(
                "produtoPreco"
            ).value
        );


    const estoque =
        Number(
            document.getElementById(
                "produtoEstoque"
            ).value
        );


    const tamanhos =
        Array.from(
            document.querySelectorAll(
                'input[name="produtoTamanho"]:checked'
            )
        )
            .map(
                function (input) {

                    return input.value;

                }
            );


    if (!nome) {

        alert(
            "Digite o nome do produto."
        );

        return;

    }


    if (!categoria) {

        alert(
            "Selecione uma categoria."
        );

        return;

    }


    if (
        !CATEGORIAS_SANTOS_CHEFIA.includes(
            categoria
        )
    ) {

        alert(
            "Selecione uma categoria válida."
        );

        return;

    }


    if (
        !Number.isFinite(
            preco
        )
        ||
        preco <= 0
    ) {

        alert(
            "Digite um preço válido."
        );

        return;

    }


    if (
        !Number.isFinite(
            estoque
        )
        ||
        estoque < 0
    ) {

        alert(
            "Digite um estoque válido."
        );

        return;

    }


    if (
        tamanhos.length === 0
    ) {

        alert(
            "Selecione pelo menos um tamanho."
        );

        return;

    }


    let imagemFinal =
        imagemProdutoAtual;


    if (
        id
        &&
        !imagemFinal
    ) {

        const produtoAtual =
            pegarProdutos()
                .find(
                    function (
                        produto
                    ) {

                        return (
                            String(
                                produto.id
                            )
                            ===
                            String(
                                id
                            )
                        );

                    }
                );


        imagemFinal =
            produtoAtual?.imagem
            ||
            "";

    }


    const produto = {

        nome:
            nome,

        categoria:
            categoria,

        preco:
            preco,

        estoque:
            estoque,

        tamanhos:
            tamanhos,

        imagem:
            imagemFinal,

        frete: {

            ...DIMENSOES_PADRAO_ROUPA

        }

    };


    const botaoSalvar =
        document.querySelector(
            '#formProduto button[type="submit"]'
        );


    const textoOriginal =
        botaoSalvar?.textContent
        ||
        "Salvar";


    if (botaoSalvar) {

        botaoSalvar.disabled =
            true;

        botaoSalvar.textContent =
            "SALVANDO...";

    }


    try {

        const url =
            id
                ?
                `${URL_BACKEND}/produtos/${encodeURIComponent(id)}`
                :
                `${URL_BACKEND}/produtos`;


        const resposta =
            await fetch(
                url,
                {

                    method:
                        id
                            ?
                            "PUT"
                            :
                            "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            produto
                        )

                }
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok
            ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível salvar o produto."
            );

        }


        await carregarProdutosOnline();


        fecharModalProduto();

        renderizarProdutosAdmin();

        atualizarDashboard();


        alert(
            id
                ?
                "Produto atualizado com sucesso!"
                :
                "Produto cadastrado com sucesso!"
        );

    }

    catch (erro) {

        console.error(
            erro
        );


        alert(
            erro.message ||
            "Não foi possível salvar o produto."
        );

    }

    finally {

        if (botaoSalvar) {

            botaoSalvar.disabled =
                false;

            botaoSalvar.textContent =
                textoOriginal;

        }

    }

}


/* ==========================================
   RENDERIZAR PRODUTOS
========================================== */

function renderizarProdutosAdmin() {

    const lista =
        document.getElementById(
            "listaProdutosAdmin"
        );


    if (!lista) {

        return;

    }


    const produtos =
        pegarProdutos();


    if (
        produtos.length === 0
    ) {

        lista.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    padding:40px;
                    text-align:center;
                    color:#777;
                "
            >

                Nenhum produto cadastrado.

            </div>

        `;


        return;

    }


    lista.innerHTML =
        produtos
            .map(
                criarCardProduto
            )
            .join("");

}


/* ==========================================
   CARD PRODUTO
========================================== */

function criarCardProduto(
    produto
) {

    const imagem =
        produto.imagem
            ?
            `
                <img
                    src="${produto.imagem}"
                    alt="${escapeHtml(produto.nome)}"
                >
            `
            :
            `
                <div class="produto-admin-sem-imagem">
                    👕
                </div>
            `;


    const tamanhos =
        Array.isArray(
            produto.tamanhos
        )
            ?
            produto.tamanhos.join(
                ", "
            )
            :
            "";


    return `

        <article class="produto-admin-card">

            ${imagem}


            <div style="margin-top:14px;">


                <span>

                    ${escapeHtml(
                        produto.categoria
                    )}

                </span>


                <h3>

                    ${escapeHtml(
                        produto.nome
                    )}

                </h3>


                <strong>

                    ${formatarPreco(
                        produto.preco
                    )}

                </strong>


                <p
                    style="
                        margin-top:8px;
                        color:#777;
                        font-size:12px;
                    "
                >

                    Estoque:
                    ${Number(
                        produto.estoque
                    )}

                </p>


                <p
                    style="
                        margin-top:5px;
                        color:#777;
                        font-size:12px;
                    "
                >

                    Tamanhos:
                    ${escapeHtml(
                        tamanhos
                    )}

                </p>

            </div>


            <div class="produto-admin-actions">

                <button
                    type="button"
                    onclick="editarProduto('${produto.id}')"
                >
                    Editar
                </button>


                <button
                    type="button"
                    class="danger"
                    onclick="excluirProduto('${produto.id}')"
                >
                    Excluir
                </button>

            </div>

        </article>

    `;

}


/* ==========================================
   EDITAR PRODUTO
========================================== */

function editarProduto(
    id
) {

    const produto =
        pegarProdutos()
            .find(
                function (item) {

                    return (
                        String(
                            item.id
                        )
                        ===
                        String(
                            id
                        )
                    );

                }
            );


    if (!produto) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    document.getElementById(
        "produtoId"
    ).value =
        produto.id;


    document.getElementById(
        "produtoNome"
    ).value =
        produto.nome;


    document.getElementById(
        "produtoCategoria"
    ).value =
        produto.categoria;


    document.getElementById(
        "produtoPreco"
    ).value =
        produto.preco;


    document.getElementById(
        "produtoEstoque"
    ).value =
        produto.estoque;


    document
        .querySelectorAll(
            'input[name="produtoTamanho"]'
        )
        .forEach(
            function (input) {

                input.checked =
                    Array.isArray(
                        produto.tamanhos
                    )
                    &&
                    produto.tamanhos.includes(
                        input.value
                    );

            }
        );


    imagemProdutoAtual =
        produto.imagem
        ||
        "";


    atualizarPreviewImagem(
        imagemProdutoAtual
    );


    document.getElementById(
        "tituloModalProduto"
    ).textContent =
        "Editar Produto";


    document.getElementById(
        "modalProduto"
    ).classList.add(
        "ativo"
    );

}


/* ==========================================
   EXCLUIR PRODUTO ONLINE
========================================== */

async function excluirProduto(
    id
) {

    const confirmou =
        confirm(
            "Tem certeza que deseja excluir este produto?"
        );


    if (!confirmou) {

        return;

    }


    try {

        const resposta =
            await fetch(
                `${URL_BACKEND}/produtos/${encodeURIComponent(id)}`,
                {

                    method:
                        "DELETE"

                }
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok
            ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível excluir o produto."
            );

        }


        await carregarProdutosOnline();


        renderizarProdutosAdmin();

        atualizarDashboard();


        alert(
            "Produto excluído com sucesso!"
        );

    }

    catch (erro) {

        console.error(
            erro
        );


        alert(
            erro.message ||
            "Não foi possível excluir o produto."
        );

    }

}


/* ==========================================
   PEDIDOS
========================================== */

function iniciarPedidos() {

    prepararAreaPedidos();

    renderizarPedidos();

    renderizarClientes();

}


/* ==========================================
   PEGAR PEDIDOS
========================================== */

function pegarPedidos() {

    const salvo =
        localStorage.getItem(
            CHAVE_PEDIDOS
        );


    if (!salvo) {

        return [];

    }


    try {

        const dados =
            JSON.parse(
                salvo
            );


        return Array.isArray(
            dados
        )
            ?
            dados
            :
            [];


    }

    catch (erro) {

        console.error(
            "Erro ao carregar pedidos:",
            erro
        );


        return [];

    }

}


/* ==========================================
   SALVAR PEDIDOS
========================================== */

function salvarPedidos(
    pedidos
) {

    localStorage.setItem(
        CHAVE_PEDIDOS,
        JSON.stringify(
            pedidos
        )
    );

}


/* ==========================================
   PREPARAR PEDIDOS
========================================== */

function prepararAreaPedidos() {

    const secao =
        document.getElementById(
            "pedidos"
        );


    if (!secao) {

        return;

    }


    const card =
        secao.querySelector(
            ".admin-card"
        );


    if (!card) {

        return;

    }


    card.innerHTML = `

        <div id="listaPedidosAdmin"></div>

    `;

}


/* ==========================================
   RENDERIZAR PEDIDOS
========================================== */

function renderizarPedidos() {

    const lista =
        document.getElementById(
            "listaPedidosAdmin"
        );


    if (!lista) {

        return;

    }


    const pedidos =
        pegarPedidos();


    if (
        pedidos.length === 0
    ) {

        lista.innerHTML = `

            <div
                style="
                    padding:40px 10px;
                    text-align:center;
                    color:#777;
                "
            >

                Nenhum pedido registrado ainda.

            </div>

        `;


        return;

    }


    lista.innerHTML =
        pedidos
            .map(
                criarPedidoHtml
            )
            .join("");

}


/* ==========================================
   PEDIDO HTML
========================================== */

function criarPedidoHtml(
    pedido
) {

    const produtos =
        Array.isArray(
            pedido.produtos
        )
            ?
            pedido.produtos
            :
            [];


    const produtosHtml =
        produtos
            .map(
                function (produto) {

                    return `

                        <div
                            style="
                                padding:9px 0;
                                border-bottom:1px solid #222;
                                font-size:13px;
                            "
                        >

                            <strong>

                                ${escapeHtml(
                                    produto.nome
                                )}

                            </strong>


                            <br>


                            <span
                                style="
                                    color:#888;
                                "
                            >

                                ${Number(
                                    produto.quantidade
                                )}x

                                ${
                                    produto.tamanho
                                        ?
                                        ` • Tam. ${escapeHtml(
                                            produto.tamanho
                                        )}`
                                        :
                                        ""
                                }

                                • ${formatarPreco(
                                    produto.preco
                                )}

                            </span>

                        </div>

                    `;

                }
            )
            .join("");


    return `

        <article
            style="
                border:1px solid #242424;
                background:#080808;
                padding:20px;
                margin-bottom:16px;
            "
        >

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:20px;
                    flex-wrap:wrap;
                "
            >

                <div>

                    <small
                        style="
                            color:#ff6900;
                            font-weight:800;
                        "
                    >

                        ${escapeHtml(
                            pedido.numero ||
                            pedido.id
                        )}

                    </small>


                    <h3>

                        ${escapeHtml(
                            pedido.cliente?.nome ||
                            "Cliente"
                        )}

                    </h3>


                    <span
                        style="
                            color:#777;
                            font-size:12px;
                        "
                    >

                        ${formatarData(
                            pedido.data
                        )}

                    </span>

                </div>


                <strong
                    style="
                        color:#ff6900;
                        font-size:20px;
                    "
                >

                    ${formatarPreco(
                        pedido.total
                    )}

                </strong>

            </div>


            <div
                style="
                    display:grid;
                    grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
                    gap:15px;
                    margin-top:20px;
                "
            >

                <div>

                    <small style="color:#777;">
                        WHATSAPP
                    </small>

                    <p>

                        ${escapeHtml(
                            pedido.cliente?.whatsapp ||
                            "-"
                        )}

                    </p>

                </div>


                <div>

                    <small style="color:#777;">
                        PAGAMENTO
                    </small>

                    <p>

                        ${escapeHtml(
                            pedido.pagamentoNome ||
                            pedido.pagamento
                        )}

                    </p>

                </div>


                <div>

                    <small style="color:#777;">
                        ENTREGA
                    </small>

                    <p>

                        ${escapeHtml(
                            pedido.entregaNome ||
                            pedido.entrega
                        )}

                    </p>

                </div>

            </div>


            <div style="margin-top:18px;">

                <small style="color:#777;">
                    ENDEREÇO
                </small>

                <p>

                    ${escapeHtml(
                        formatarEndereco(
                            pedido
                        )
                    )}

                </p>

            </div>


            <div style="margin-top:18px;">

                <small style="color:#777;">
                    PRODUTOS
                </small>

                ${produtosHtml}

            </div>


            <div
                style="
                    margin-top:18px;
                    padding-top:15px;
                    border-top:1px solid #222;
                    font-size:13px;
                "
            >

                <p>

                    Produtos:
                    <strong>
                        ${formatarPreco(
                            pedido.subtotal
                        )}
                    </strong>

                </p>


                <p>

                    Frete:
                    <strong>

                        ${
                            Number(
                                pedido.frete
                            ) > 0
                                ?
                                formatarPreco(
                                    pedido.frete
                                )
                                :
                                "Grátis"
                        }

                    </strong>

                </p>


                <p>

                    Total pago:
                    <strong>

                        ${formatarPreco(
                            pedido.total
                        )}

                    </strong>

                </p>

            </div>


            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    flex-wrap:wrap;
                    margin-top:20px;
                "
            >

                <select
                    onchange="alterarStatusPedido('${pedido.id}',this.value)"
                    style="
                        min-width:220px;
                        height:44px;
                        background:#111;
                        color:#fff;
                        border:1px solid #333;
                        padding:0 12px;
                    "
                >

                    ${criarOpcoesStatus(
                        pedido.status
                    )}

                </select>


                <button
                    type="button"
                    onclick="excluirPedido('${pedido.id}')"
                    style="
                        height:44px;
                        padding:0 18px;
                        background:transparent;
                        border:1px solid #742828;
                        color:#ff6b6b;
                        cursor:pointer;
                    "
                >

                    Excluir pedido

                </button>

            </div>

        </article>

    `;

}


/* ==========================================
   STATUS
========================================== */

function criarOpcoesStatus(
    statusAtual
) {

    const status = [

        "Novo pedido",

        "Aguardando pagamento",

        "Pago",

        "Em preparação",

        "Enviado",

        "Pronto para retirada",

        "Concluído",

        "Cancelado"

    ];


    return status
        .map(
            function (item) {

                return `

                    <option
                        value="${item}"
                        ${
                            item ===
                            statusAtual
                                ?
                                "selected"
                                :
                                ""
                        }
                    >

                        ${item}

                    </option>

                `;

            }
        )
        .join("");

}


/* ==========================================
   STATUS BAIXA ESTOQUE
========================================== */

function statusBaixaEstoque(
    status
) {

    return (
        STATUS_COM_ESTOQUE_BAIXADO
            .includes(
                status
            )
    );

}


/* ==========================================
   ALTERAR STATUS
========================================== */

function alterarStatusPedido(
    id,
    novoStatus
) {

    const pedidos =
        pegarPedidos();


    const pedido =
        pedidos.find(
            function (item) {

                return (
                    String(
                        item.id
                    )
                    ===
                    String(
                        id
                    )
                );

            }
        );


    if (!pedido) {

        alert(
            "Pedido não encontrado."
        );

        return;

    }


    const statusAnterior =
        pedido.status;


    const estoqueEstavaBaixado =
        pedido.estoqueBaixado ===
        true
        ||
        statusBaixaEstoque(
            statusAnterior
        );


    const novoStatusBaixa =
        statusBaixaEstoque(
            novoStatus
        );


    if (
        !estoqueEstavaBaixado
        &&
        novoStatusBaixa
    ) {

        const conseguiu =
            baixarEstoquePedido(
                pedido
            );


        if (!conseguiu) {

            renderizarPedidos();

            return;

        }


        pedido.estoqueBaixado =
            true;

    }


    if (
        estoqueEstavaBaixado
        &&
        !novoStatusBaixa
    ) {

        devolverEstoquePedido(
            pedido
        );


        pedido.estoqueBaixado =
            false;

    }


    pedido.status =
        novoStatus;


    pedido.atualizadoEm =
        new Date()
            .toISOString();


    salvarPedidos(
        pedidos
    );


    renderizarPedidos();

    renderizarProdutosAdmin();

    renderizarClientes();

    atualizarDashboard();

}


/* ==========================================
   BAIXAR ESTOQUE
========================================== */

function baixarEstoquePedido(
    pedido
) {

    let produtos =
        pegarProdutos();


    const itens =
        Array.isArray(
            pedido.produtos
        )
            ?
            pedido.produtos
            :
            [];


    for (
        const itemPedido
        of itens
    ) {

        const produto =
            produtos.find(
                function (produto) {

                    return (
                        String(
                            produto.id
                        )
                        ===
                        String(
                            itemPedido.id
                        )
                    );

                }
            );


        if (!produto) {

            alert(
                `O produto "${itemPedido.nome}" não foi encontrado no estoque.`
            );


            return false;

        }


        const quantidade =
            Number(
                itemPedido.quantidade
            )
            ||
            1;


        if (
            Number(
                produto.estoque
            )
            <
            quantidade
        ) {

            alert(
                `Estoque insuficiente para "${produto.nome}".\n\nDisponível: ${produto.estoque}\nPedido: ${quantidade}`
            );


            return false;

        }

    }


    itens.forEach(
        function (
            itemPedido
        ) {

            const produto =
                produtos.find(
                    function (
                        produto
                    ) {

                        return (
                            String(
                                produto.id
                            )
                            ===
                            String(
                                itemPedido.id
                            )
                        );

                    }
                );


            if (!produto) {

                return;

            }


            produto.estoque =
                Number(
                    produto.estoque
                )
                -
                (
                    Number(
                        itemPedido.quantidade
                    )
                    ||
                    1
                );

        }
    );


    salvarListaProdutos(
        produtos
    );


    return true;

}


/* ==========================================
   DEVOLVER ESTOQUE
========================================== */

function devolverEstoquePedido(
    pedido
) {

    let produtos =
        pegarProdutos();


    const itens =
        Array.isArray(
            pedido.produtos
        )
            ?
            pedido.produtos
            :
            [];


    itens.forEach(
        function (
            itemPedido
        ) {

            const produto =
                produtos.find(
                    function (
                        produto
                    ) {

                        return (
                            String(
                                produto.id
                            )
                            ===
                            String(
                                itemPedido.id
                            )
                        );

                    }
                );


            if (!produto) {

                return;

            }


            produto.estoque =
                Number(
                    produto.estoque
                )
                +
                (
                    Number(
                        itemPedido.quantidade
                    )
                    ||
                    1
                );

        }
    );


    salvarListaProdutos(
        produtos
    );

}


/* ==========================================
   EXCLUIR PEDIDO
========================================== */

function excluirPedido(
    id
) {

    let pedidos =
        pegarPedidos();


    const pedido =
        pedidos.find(
            function (item) {

                return (
                    String(
                        item.id
                    )
                    ===
                    String(
                        id
                    )
                );

            }
        );


    if (!pedido) {

        return;

    }


    const confirmou =
        confirm(
            "Deseja realmente excluir este pedido?"
        );


    if (!confirmou) {

        return;

    }


    if (
        pedido.estoqueBaixado ===
        true
        ||
        statusBaixaEstoque(
            pedido.status
        )
    ) {

        devolverEstoquePedido(
            pedido
        );

    }


    pedidos =
        pedidos.filter(
            function (item) {

                return (
                    String(
                        item.id
                    )
                    !==
                    String(
                        id
                    )
                );

            }
        );


    salvarPedidos(
        pedidos
    );


    renderizarPedidos();

    renderizarProdutosAdmin();

    renderizarClientes();

    atualizarDashboard();

}


/* ==========================================
   ENDEREÇO
========================================== */

function formatarEndereco(
    pedido
) {

    if (
        pedido.entrega ===
        "retirada"
    ) {

        return (
            "Retirada na loja Santos Chefia - Lajedo/PE"
        );

    }


    const e =
        pedido.endereco;


    if (!e) {

        return "-";

    }


    let texto =
        `${e.rua || ""}, ${e.numero || ""}`;


    if (
        e.complemento
    ) {

        texto +=
            ` - ${e.complemento}`;

    }


    texto +=
        ` - ${e.bairro || ""}, ${e.cidade || ""}/${e.estado || ""} - CEP ${e.cep || ""}`;


    return texto;

}


/* ==========================================
   CLIENTES
========================================== */

function renderizarClientes() {

    const secao =
        document.getElementById(
            "clientes"
        );


    if (!secao) {

        return;

    }


    const card =
        secao.querySelector(
            ".admin-card"
        );


    if (!card) {

        return;

    }


    const pedidos =
        pegarPedidos();


    const clientesMap =
        new Map();


    pedidos.forEach(
        function (pedido) {

            if (
                !pedido.cliente
            ) {

                return;

            }


            const chave =
                pedido.cliente.whatsapp
                ||
                pedido.cliente.email
                ||
                pedido.cliente.cpf
                ||
                pedido.cliente.nome;


            if (
                !clientesMap.has(
                    chave
                )
            ) {

                clientesMap.set(
                    chave,
                    {

                        ...pedido.cliente,

                        pedidos:
                            0,

                        totalProdutos:
                            0

                    }
                );

            }


            const cliente =
                clientesMap.get(
                    chave
                );


            cliente.pedidos++;


            if (
                pedido.status !==
                "Cancelado"
            ) {

                cliente.totalProdutos +=
                    Number(
                        pedido.subtotal
                    )
                    ||
                    0;

            }

        }
    );


    const clientes =
        Array.from(
            clientesMap.values()
        );


    if (
        clientes.length === 0
    ) {

        card.innerHTML = `

            <div
                style="
                    padding:40px;
                    text-align:center;
                    color:#777;
                "
            >

                Nenhum cliente cadastrado ainda.

            </div>

        `;


        return;

    }


    card.innerHTML = `

        <div style="overflow-x:auto;">

            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                    min-width:700px;
                "
            >

                <thead>

                    <tr>

                        <th style="${estiloTh()}">
                            Cliente
                        </th>

                        <th style="${estiloTh()}">
                            WhatsApp
                        </th>

                        <th style="${estiloTh()}">
                            E-mail
                        </th>

                        <th style="${estiloTh()}">
                            Pedidos
                        </th>

                        <th style="${estiloTh()}">
                            Compras
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${clientes
                        .map(
                            function (
                                cliente
                            ) {

                                return `

                                    <tr>

                                        <td style="${estiloTd()}">

                                            ${escapeHtml(
                                                cliente.nome ||
                                                "-"
                                            )}

                                        </td>

                                        <td style="${estiloTd()}">

                                            ${escapeHtml(
                                                cliente.whatsapp ||
                                                "-"
                                            )}

                                        </td>

                                        <td style="${estiloTd()}">

                                            ${escapeHtml(
                                                cliente.email ||
                                                "-"
                                            )}

                                        </td>

                                        <td style="${estiloTd()}">

                                            ${cliente.pedidos}

                                        </td>

                                        <td style="${estiloTd()}">

                                            ${formatarPreco(
                                                cliente.totalProdutos
                                            )}

                                        </td>

                                    </tr>

                                `;

                            }
                        )
                        .join("")}

                </tbody>

            </table>

        </div>

    `;

}


/* ==========================================
   ESTILOS TABELA
========================================== */

function estiloTh() {

    return (
        "text-align:left;padding:14px;border-bottom:1px solid #333;color:#ff6900;font-size:12px;"
    );

}


function estiloTd() {

    return (
        "padding:14px;border-bottom:1px solid #222;color:#ddd;font-size:13px;"
    );

}


/* ==========================================
   DASHBOARD
========================================== */

function atualizarDashboard() {

    const produtos =
        pegarProdutos();


    const pedidos =
        pegarPedidos();


    const contadorProdutos =
        document.getElementById(
            "dashboardProdutos"
        );


    if (
        contadorProdutos
    ) {

        contadorProdutos.textContent =
            produtos.length;

    }


    const cards =
        document.querySelectorAll(
            ".stat-card"
        );


    let faturamento =
        0;


    pedidos.forEach(
        function (pedido) {

            if (
                statusBaixaEstoque(
                    pedido.status
                )
            ) {

                faturamento +=
                    Number(
                        pedido.subtotal
                    )
                    ||
                    0;

            }

        }
    );


    const clientesUnicos =
        new Set();


    pedidos.forEach(
        function (pedido) {

            const chave =
                pedido.cliente?.whatsapp
                ||
                pedido.cliente?.email
                ||
                pedido.cliente?.cpf;


            if (chave) {

                clientesUnicos.add(
                    chave
                );

            }

        }
    );


    if (
        cards[0]
    ) {

        const numero =
            cards[0]
                .querySelector(
                    "strong"
                );


        if (numero) {

            numero.textContent =
                pedidos.length;

        }

    }


    if (
        cards[1]
    ) {

        const numero =
            cards[1]
                .querySelector(
                    "strong"
                );


        if (numero) {

            numero.textContent =
                formatarPreco(
                    faturamento
                );

        }

    }


    if (
        cards[2]
    ) {

        const numero =
            cards[2]
                .querySelector(
                    "strong"
                );


        if (numero) {

            numero.textContent =
                produtos.length;

        }

    }


    if (
        cards[3]
    ) {

        const numero =
            cards[3]
                .querySelector(
                    "strong"
                );


        if (numero) {

            numero.textContent =
                clientesUnicos.size;

        }

    }


    atualizarPedidosRecentes();

}


/* ==========================================
   PEDIDOS RECENTES
========================================== */

function atualizarPedidosRecentes() {

    const dashboard =
        document.getElementById(
            "dashboard"
        );


    if (!dashboard) {

        return;

    }


    const cards =
        dashboard.querySelectorAll(
            ".admin-card"
        );


    if (
        !cards[0]
    ) {

        return;

    }


    const pedidos =
        pegarPedidos()
            .slice(
                0,
                5
            );


    const card =
        cards[0];


    const header =
        card.querySelector(
            ".card-header"
        );


    const headerHtml =
        header
            ?
            header.outerHTML
            :
            `
                <div class="card-header">

                    <div>

                        <p class="admin-kicker">
                            PEDIDOS
                        </p>

                        <h3>
                            Pedidos recentes
                        </h3>

                    </div>

                </div>
            `;


    if (
        pedidos.length === 0
    ) {

        card.innerHTML =
            headerHtml
            +
            `

                <p style="color:#666;">

                    Ainda não existem pedidos cadastrados.

                </p>

            `;


        return;

    }


    card.innerHTML =
        headerHtml
        +
        pedidos
            .map(
                function (pedido) {

                    return `

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                gap:15px;
                                padding:12px 0;
                                border-bottom:1px solid #222;
                                align-items:center;
                            "
                        >

                            <div>

                                <strong>

                                    ${escapeHtml(
                                        pedido.numero ||
                                        pedido.id
                                    )}

                                </strong>


                                <p
                                    style="
                                        color:#777;
                                        font-size:12px;
                                        margin-top:4px;
                                    "
                                >

                                    ${escapeHtml(
                                        pedido.cliente?.nome ||
                                        "Cliente"
                                    )}

                                    • ${escapeHtml(
                                        pedido.status ||
                                        "-"
                                    )}

                                </p>

                            </div>


                            <strong
                                style="
                                    color:#ff6900;
                                "
                            >

                                ${formatarPreco(
                                    pedido.subtotal
                                )}

                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ==========================================
   DATA
========================================== */

function formatarData(
    data
) {

    if (!data) {

        return "-";

    }


    const objeto =
        new Date(
            data
        );


    if (
        Number.isNaN(
            objeto.getTime()
        )
    ) {

        return data;

    }


    return objeto.toLocaleString(
        "pt-BR",
        {

            dateStyle:
                "short",

            timeStyle:
                "short"

        }
    );

}


/* ==========================================
   PREÇO
========================================== */

function formatarPreco(
    valor
) {

    return Number(
        valor || 0
    )
        .toLocaleString(
            "pt-BR",
            {

                style:
                    "currency",

                currency:
                    "BRL"

            }
        );

}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHtml(
    texto
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            texto ?? ""
        );


    return div.innerHTML;

}


/* ==========================================
   ATUALIZAÇÃO ENTRE ABAS
========================================== */

function iniciarAtualizacaoEntreAbas() {

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key ===
                CHAVE_PEDIDOS
            ) {

                renderizarPedidos();

                renderizarClientes();

                atualizarDashboard();

            }


            if (
                event.key ===
                CHAVE_PRODUTOS
            ) {

                renderizarProdutosAdmin();

                atualizarDashboard();

            }

        }
    );

}