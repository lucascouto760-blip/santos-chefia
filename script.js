/* ==========================================
   SANTOS CHEFIA
   PÁGINA PRINCIPAL
   PRODUTOS ONLINE + CARRINHO
========================================== */


/* ==========================================
   CONFIGURAÇÕES
========================================== */

const URL_BACKEND =
    "https://santos-chefia.onrender.com";

const CHAVE_CARRINHO =
    "santosChefiaCarrinho";


/* ==========================================
   CATEGORIAS
========================================== */

const CATEGORIAS_OFICIAIS = [

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
   ESTADO
========================================== */

let produtos =
    [];

let carrinho =
    [];

let produtoSelecionado =
    null;

let tamanhoSelecionado =
    null;

let quantidadeProduto =
    1;

let categoriaSelecionada =
    "Início";

let termoPesquisa =
    "";


/* ==========================================
   FORMATAR PREÇO
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
   NORMALIZAR TEXTO
========================================== */

function normalizarTexto(
    texto
) {

    return String(
        texto ?? ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


/* ==========================================
   NORMALIZAR PRODUTO
========================================== */

function normalizarProduto(
    produto
) {

    return {

        ...produto,

        id:
            String(
                produto.id ?? ""
            ),

        nome:
            produto.nome ||
            "Produto",

        categoria:
            produto.categoria ||
            "Início",

        preco:
            Number(
                produto.preco
            ) || 0,

        estoque:
            Number(
                produto.estoque
            ) || 0,

        tamanhos:
            Array.isArray(
                produto.tamanhos
            )
                ?
                produto.tamanhos.map(
                    String
                )
                :
                [],

        imagem:
            produto.imagem ||
            "",

        frete:
            produto.frete
            ||
            {
                peso: 0.5,
                comprimento: 30,
                largura: 20,
                altura: 10
            }

    };

}


/* ==========================================
   CARREGAR PRODUTOS ONLINE
========================================== */

async function carregarProdutosOnline() {

    const lista =
        document.getElementById(
            "listaProdutos"
        );


    if (lista) {

        lista.innerHTML = `

            <div class="nenhum-produto">

                <span>
                    ⏳
                </span>

                <h3>
                    Carregando produtos...
                </h3>

            </div>

        `;

    }


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


        produtos =
            Array.isArray(
                dados.produtos
            )
                ?
                dados.produtos.map(
                    normalizarProduto
                )
                :
                [];


        mostrarProdutos();

        renderizarCarrinho();

    }

    catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );


        produtos =
            [];


        if (lista) {

            lista.innerHTML = `

                <div class="nenhum-produto">

                    <span>
                        ⚠️
                    </span>

                    <h3>
                        Não foi possível carregar os produtos
                    </h3>

                    <p>
                        Tente atualizar a página em alguns segundos.
                    </p>

                </div>

            `;

        }

    }

}


/* ==========================================
   FILTRAR PRODUTOS
========================================== */

function obterProdutosFiltrados() {

    const termo =
        normalizarTexto(
            termoPesquisa
        );


    return produtos.filter(
        function (
            produto
        ) {

            const textoProduto =
                normalizarTexto(
                    `${produto.nome} ${produto.categoria}`
                );


            const batePesquisa =
                !termo
                ||
                textoProduto.includes(
                    termo
                );


            let bateCategoria =
                true;


            if (
                categoriaSelecionada !==
                "Início"
            ) {

                bateCategoria =
                    normalizarTexto(
                        produto.categoria
                    )
                    ===
                    normalizarTexto(
                        categoriaSelecionada
                    );

            }


            return (
                batePesquisa
                &&
                bateCategoria
            );

        }
    );

}


/* ==========================================
   CONTADOR
========================================== */

function atualizarContadorResultados(
    quantidade
) {

    const elemento =
        document.getElementById(
            "quantidadeResultados"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        quantidade === 1
            ?
            "1 produto"
            :
            `${quantidade} produtos`;

}


/* ==========================================
   MOSTRAR PRODUTOS
========================================== */

function mostrarProdutos() {

    const lista =
        document.getElementById(
            "listaProdutos"
        );


    if (!lista) {

        return;

    }


    const filtrados =
        obterProdutosFiltrados();


    atualizarContadorResultados(
        filtrados.length
    );


    lista.innerHTML =
        "";


    if (
        produtos.length === 0
    ) {

        lista.innerHTML = `

            <div class="nenhum-produto">

                <span>
                    👕
                </span>

                <h3>
                    Nenhum produto cadastrado
                </h3>

                <p>
                    Novos produtos aparecerão aqui em breve.
                </p>

            </div>

        `;

        return;

    }


    if (
        filtrados.length === 0
    ) {

        lista.innerHTML = `

            <div class="nenhum-produto">

                <span>
                    🔍
                </span>

                <h3>
                    Nenhum produto encontrado
                </h3>

                <p>
                    Tente pesquisar outro nome
                    ou escolher outra categoria.
                </p>

            </div>

        `;

        return;

    }


    filtrados.forEach(
        function (
            produto
        ) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "produto-card";


            const esgotado =
                Number(
                    produto.estoque
                ) <= 0;


            let imagemHtml =
                "";


            if (
                produto.imagem
            ) {

                imagemHtml = `

                    <img
                        src="${produto.imagem}"
                        alt="${escapeHtml(
                            produto.nome
                        )}"
                        loading="lazy"
                    >

                `;

            }

            else {

                imagemHtml = `

                    <div
                        style="
                            width:100%;
                            height:100%;
                            display:grid;
                            place-items:center;
                            font-size:54px;
                            color:#555;
                        "
                    >
                        👕
                    </div>

                `;

            }


            card.innerHTML = `

                <div class="produto-imagem">

                    ${imagemHtml}

                    ${
                        esgotado
                            ?
                            `
                                <span
                                    style="
                                        position:absolute;
                                        right:14px;
                                        top:14px;
                                        z-index:3;
                                        padding:7px 10px;
                                        background:#080808;
                                        border:1px solid #8f2e2e;
                                        color:#ff7777;
                                        font-size:9px;
                                        font-weight:800;
                                        letter-spacing:1px;
                                    "
                                >
                                    ESGOTADO
                                </span>
                            `
                            :
                            ""
                    }

                </div>


                <div class="produto-info">

                    <div class="produto-categoria">

                        ${escapeHtml(
                            produto.categoria
                        )}

                    </div>


                    <h3 class="produto-nome">

                        ${escapeHtml(
                            produto.nome
                        )}

                    </h3>


                    <strong class="produto-preco">

                        ${formatarPreco(
                            produto.preco
                        )}

                    </strong>


                    <div class="produto-acoes">

                        <button
                            type="button"
                            class="btn-produto"
                            ${
                                esgotado
                                    ?
                                    "disabled"
                                    :
                                    ""
                            }
                        >

                            ${
                                esgotado
                                    ?
                                    "PRODUTO ESGOTADO"
                                    :
                                    "VER PRODUTO"
                            }

                        </button>

                    </div>

                </div>

            `;


            const botao =
                card.querySelector(
                    ".btn-produto"
                );


            if (
                botao
                &&
                !esgotado
            ) {

                botao.addEventListener(
                    "click",
                    function () {

                        abrirProduto(
                            produto.id
                        );

                    }
                );

            }


            lista.appendChild(
                card
            );

        }
    );

}


/* ==========================================
   PESQUISA
========================================== */

function configurarPesquisa() {

    const input =
        document.getElementById(
            "pesquisaProdutos"
        );

    const limpar =
        document.getElementById(
            "limparPesquisa"
        );

    const abrir =
        document.getElementById(
            "abrirPesquisa"
        );


    if (input) {

        input.addEventListener(
            "input",
            function () {

                termoPesquisa =
                    input.value;


                if (limpar) {

                    limpar.style.display =
                        input.value.trim()
                            ?
                            "flex"
                            :
                            "none";

                }


                mostrarProdutos();

            }
        );

    }


    if (limpar) {

        limpar.addEventListener(
            "click",
            function () {

                termoPesquisa =
                    "";


                if (input) {

                    input.value =
                        "";

                    input.focus();

                }


                limpar.style.display =
                    "none";


                mostrarProdutos();

            }
        );

    }


    if (abrir) {

        abrir.addEventListener(
            "click",
            function () {

                const secao =
                    document.getElementById(
                        "produtos"
                    );


                if (secao) {

                    secao.scrollIntoView(
                        {
                            behavior:
                                "smooth",

                            block:
                                "start"
                        }
                    );

                }


                if (input) {

                    setTimeout(
                        function () {

                            input.focus();

                        },
                        450
                    );

                }

            }
        );

    }

}


/* ==========================================
   CATEGORIAS
========================================== */

function configurarCategorias() {

    const botoes =
        document.querySelectorAll(
            ".categoria-btn"
        );


    botoes.forEach(
        function (
            botao
        ) {

            botao.addEventListener(
                "click",
                function () {

                    botoes.forEach(
                        function (
                            item
                        ) {

                            item.classList.remove(
                                "ativo"
                            );

                        }
                    );


                    botao.classList.add(
                        "ativo"
                    );


                    categoriaSelecionada =
                        botao.dataset.categoria
                        ||
                        "Início";


                    mostrarProdutos();


                    const lista =
                        document.getElementById(
                            "listaProdutos"
                        );


                    if (lista) {

                        lista.scrollIntoView(
                            {
                                behavior:
                                    "smooth",

                                block:
                                    "start"
                            }
                        );

                    }

                }
            );

        }
    );

}


/* ==========================================
   ABRIR PRODUTO
========================================== */

function abrirProduto(
    id
) {

    const produto =
        produtos.find(
            function (
                item
            ) {

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

        return;

    }


    if (
        Number(
            produto.estoque
        ) <= 0
    ) {

        alert(
            "Este produto está esgotado."
        );

        return;

    }


    produtoSelecionado =
        produto;

    tamanhoSelecionado =
        null;

    quantidadeProduto =
        1;


    const modal =
        document.getElementById(
            "produtoModal"
        );


    if (!modal) {

        return;

    }


    const imagem =
        document.getElementById(
            "modalImagemProduto"
        );

    const nome =
        document.getElementById(
            "modalNomeProduto"
        );

    const categoria =
        document.getElementById(
            "modalCategoria"
        );

    const preco =
        document.getElementById(
            "modalPrecoProduto"
        );

    const tamanhoTexto =
        document.getElementById(
            "tamanhoSelecionado"
        );

    const quantidade =
        document.getElementById(
            "quantidadeProduto"
        );

    const botaoAdicionar =
        document.getElementById(
            "adicionarProdutoModal"
        );


    if (imagem) {

        imagem.src =
            produto.imagem ||
            "";

        imagem.alt =
            produto.nome;

    }


    if (nome) {

        nome.textContent =
            produto.nome;

    }


    if (categoria) {

        categoria.textContent =
            produto.categoria;

    }


    if (preco) {

        preco.textContent =
            formatarPreco(
                produto.preco
            );

    }


    if (tamanhoTexto) {

        tamanhoTexto.textContent =
            "Selecione";

    }


    if (quantidade) {

        quantidade.textContent =
            "1";

    }


    document
        .querySelectorAll(
            ".tamanho-btn"
        )
        .forEach(
            function (
                botao
            ) {

                const tamanho =
                    botao.dataset.tamanho;


                const disponivel =
                    produto.tamanhos.length === 0
                    ||
                    produto.tamanhos.includes(
                        tamanho
                    );


                botao.classList.remove(
                    "selecionado"
                );


                botao.style.display =
                    disponivel
                        ?
                        ""
                        :
                        "none";

            }
        );


    if (
        produto.tamanhos.length === 1
    ) {

        selecionarTamanho(
            produto.tamanhos[0]
        );

    }


    if (
        botaoAdicionar
    ) {

        botaoAdicionar.disabled =
            false;

        botaoAdicionar.textContent =
            "ADICIONAR AO CARRINHO";

    }


    modal.classList.add(
        "ativo"
    );

}


/* ==========================================
   FECHAR PRODUTO
========================================== */

function fecharProduto() {

    const modal =
        document.getElementById(
            "produtoModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "ativo"
    );

}


/* ==========================================
   SELECIONAR TAMANHO
========================================== */

function selecionarTamanho(
    tamanho
) {

    if (
        !produtoSelecionado
    ) {

        return;

    }


    if (
        produtoSelecionado.tamanhos.length > 0
        &&
        !produtoSelecionado.tamanhos.includes(
            tamanho
        )
    ) {

        return;

    }


    tamanhoSelecionado =
        tamanho;


    const texto =
        document.getElementById(
            "tamanhoSelecionado"
        );


    if (texto) {

        texto.textContent =
            tamanho === "Único"
                ?
                "Tamanho único"
                :
                tamanho;

    }


    document
        .querySelectorAll(
            ".tamanho-btn"
        )
        .forEach(
            function (
                botao
            ) {

                botao.classList.remove(
                    "selecionado"
                );

            }
        );


    document
        .querySelectorAll(
            ".tamanho-btn"
        )
        .forEach(
            function (
                botao
            ) {

                if (
                    botao.dataset.tamanho ===
                    tamanho
                ) {

                    botao.classList.add(
                        "selecionado"
                    );

                }

            }
        );

}


/* ==========================================
   CONFIGURAR TAMANHOS
========================================== */

function configurarTamanhos() {

    document
        .querySelectorAll(
            ".tamanho-btn"
        )
        .forEach(
            function (
                botao
            ) {

                botao.addEventListener(
                    "click",
                    function () {

                        selecionarTamanho(
                            botao.dataset.tamanho
                        );

                    }
                );

            }
        );

}


/* ==========================================
   QUANTIDADE
========================================== */

function configurarQuantidade() {

    const diminuir =
        document.getElementById(
            "diminuirQuantidade"
        );

    const aumentar =
        document.getElementById(
            "aumentarQuantidade"
        );


    if (diminuir) {

        diminuir.addEventListener(
            "click",
            function () {

                if (
                    quantidadeProduto > 1
                ) {

                    quantidadeProduto--;

                    atualizarQuantidadeModal();

                }

            }
        );

    }


    if (aumentar) {

        aumentar.addEventListener(
            "click",
            function () {

                if (
                    !produtoSelecionado
                ) {

                    return;

                }


                if (
                    quantidadeProduto <
                    Number(
                        produtoSelecionado.estoque
                    )
                ) {

                    quantidadeProduto++;

                    atualizarQuantidadeModal();

                }

                else {

                    alert(
                        "Quantidade máxima disponível em estoque."
                    );

                }

            }
        );

    }

}


/* ==========================================
   ATUALIZAR QUANTIDADE
========================================== */

function atualizarQuantidadeModal() {

    const elemento =
        document.getElementById(
            "quantidadeProduto"
        );


    if (elemento) {

        elemento.textContent =
            quantidadeProduto;

    }

}


/* ==========================================
   ADICIONAR AO CARRINHO
========================================== */

function adicionarProdutoAoCarrinho() {

    if (
        !produtoSelecionado
    ) {

        return;

    }


    if (
        produtoSelecionado.tamanhos.length > 0
        &&
        !tamanhoSelecionado
    ) {

        alert(
            "Selecione um tamanho."
        );

        return;

    }


    const existente =
        carrinho.find(
            function (
                item
            ) {

                return (
                    String(
                        item.id
                    )
                    ===
                    String(
                        produtoSelecionado.id
                    )
                    &&
                    String(
                        item.tamanho || ""
                    )
                    ===
                    String(
                        tamanhoSelecionado || ""
                    )
                );

            }
        );


    if (existente) {

        const novaQuantidade =
            Number(
                existente.quantidade
            )
            +
            quantidadeProduto;


        if (
            novaQuantidade >
            Number(
                produtoSelecionado.estoque
            )
        ) {

            alert(
                "Quantidade maior que o estoque disponível."
            );

            return;

        }


        existente.quantidade =
            novaQuantidade;

    }

    else {

        carrinho.push({

            id:
                String(
                    produtoSelecionado.id
                ),

            nome:
                produtoSelecionado.nome,

            categoria:
                produtoSelecionado.categoria,

            preco:
                Number(
                    produtoSelecionado.preco
                ),

            imagem:
                produtoSelecionado.imagem,

            tamanho:
                tamanhoSelecionado || "",

            quantidade:
                quantidadeProduto,

            frete:
                produtoSelecionado.frete
                ||
                {
                    peso: 0.5,
                    comprimento: 30,
                    largura: 20,
                    altura: 10
                }

        });

    }


    salvarCarrinho();

    renderizarCarrinho();

    fecharProduto();

    abrirCarrinho();

}


/* ==========================================
   SALVAR CARRINHO
========================================== */

function salvarCarrinho() {

    localStorage.setItem(
        CHAVE_CARRINHO,
        JSON.stringify(
            carrinho
        )
    );

}


/* ==========================================
   CARREGAR CARRINHO
========================================== */

function carregarCarrinho() {

    const salvo =
        localStorage.getItem(
            CHAVE_CARRINHO
        );


    if (!salvo) {

        carrinho =
            [];

        return;

    }


    try {

        const dados =
            JSON.parse(
                salvo
            );


        carrinho =
            Array.isArray(
                dados
            )
                ?
                dados
                :
                [];

    }

    catch (erro) {

        console.error(
            "Erro ao carregar carrinho:",
            erro
        );


        carrinho =
            [];

    }

}


/* ==========================================
   RENDERIZAR CARRINHO
========================================== */

function renderizarCarrinho() {

    const lista =
        document.getElementById(
            "itensCarrinho"
        );

    const contador =
        document.getElementById(
            "contadorCarrinho"
        );

    const total =
        document.getElementById(
            "totalCarrinho"
        );


    if (!lista) {

        return;

    }


    const quantidadeTotal =
        carrinho.reduce(
            function (
                soma,
                item
            ) {

                return (
                    soma
                    +
                    Number(
                        item.quantidade || 0
                    )
                );

            },
            0
        );


    if (contador) {

        contador.textContent =
            quantidadeTotal;

    }


    const valorTotal =
        carrinho.reduce(
            function (
                soma,
                item
            ) {

                return (
                    soma
                    +
                    (
                        Number(
                            item.preco || 0
                        )
                        *
                        Number(
                            item.quantidade || 1
                        )
                    )
                );

            },
            0
        );


    if (total) {

        total.textContent =
            formatarPreco(
                valorTotal
            );

    }


    if (
        carrinho.length === 0
    ) {

        lista.innerHTML = `

            <div class="carrinho-vazio">

                Seu carrinho está vazio.

            </div>

        `;

        return;

    }


    lista.innerHTML =
        carrinho
            .map(
                function (
                    item,
                    index
                ) {

                    return `

                        <div class="cart-item">

                            <div class="cart-item-imagem">

                                ${
                                    item.imagem
                                        ?
                                        `
                                            <img
                                                src="${item.imagem}"
                                                alt="${escapeHtml(
                                                    item.nome
                                                )}"
                                            >
                                        `
                                        :
                                        "👕"
                                }

                            </div>


                            <div class="cart-item-info">

                                <strong>

                                    ${escapeHtml(
                                        item.nome
                                    )}

                                </strong>


                                <span>

                                    ${
                                        item.tamanho
                                            ?
                                            `Tam. ${escapeHtml(
                                                item.tamanho
                                            )}`
                                            :
                                            ""
                                    }

                                </span>


                                <span>

                                    ${formatarPreco(
                                        item.preco
                                    )}

                                </span>


                                <div class="cart-item-quantidade">

                                    <button
                                        type="button"
                                        onclick="alterarQuantidadeCarrinho(${index}, -1)"
                                    >
                                        −
                                    </button>


                                    <span>

                                        ${Number(
                                            item.quantidade
                                        )}

                                    </span>


                                    <button
                                        type="button"
                                        onclick="alterarQuantidadeCarrinho(${index}, 1)"
                                    >
                                        +
                                    </button>

                                </div>

                            </div>


                            <button
                                type="button"
                                class="cart-item-remover"
                                onclick="removerCarrinho(${index})"
                            >
                                ×
                            </button>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ==========================================
   ALTERAR QUANTIDADE CARRINHO
========================================== */

function alterarQuantidadeCarrinho(
    index,
    alteracao
) {

    const item =
        carrinho[index];


    if (!item) {

        return;

    }


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
                        item.id
                    )
                );

            }
        );


    const novaQuantidade =
        Number(
            item.quantidade
        )
        +
        alteracao;


    if (
        novaQuantidade <= 0
    ) {

        removerCarrinho(
            index
        );

        return;

    }


    if (
        produto
        &&
        novaQuantidade >
        Number(
            produto.estoque
        )
    ) {

        alert(
            "Quantidade maior que o estoque disponível."
        );

        return;

    }


    item.quantidade =
        novaQuantidade;


    salvarCarrinho();

    renderizarCarrinho();

}


/* ==========================================
   REMOVER CARRINHO
========================================== */

function removerCarrinho(
    index
) {

    carrinho.splice(
        index,
        1
    );


    salvarCarrinho();

    renderizarCarrinho();

}


/* ==========================================
   ABRIR CARRINHO
========================================== */

function abrirCarrinho() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "ativo"
        );

    }

}


/* ==========================================
   FECHAR CARRINHO
========================================== */

function fecharCarrinho() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "ativo"
        );

    }

}


/* ==========================================
   CONFIGURAR CARRINHO
========================================== */

function configurarCarrinho() {

    const abrir =
        document.getElementById(
            "abrirCarrinho"
        );

    const fechar =
        document.getElementById(
            "fecharCarrinho"
        );

    const overlay =
        document.getElementById(
            "cartOverlay"
        );

    const finalizar =
        document.getElementById(
            "finalizarCompra"
        );


    if (abrir) {

        abrir.addEventListener(
            "click",
            abrirCarrinho
        );

    }


    if (fechar) {

        fechar.addEventListener(
            "click",
            fecharCarrinho
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            function (
                event
            ) {

                if (
                    event.target ===
                    overlay
                ) {

                    fecharCarrinho();

                }

            }
        );

    }


    if (finalizar) {

        finalizar.addEventListener(
            "click",
            function () {

                if (
                    carrinho.length === 0
                ) {

                    alert(
                        "Seu carrinho está vazio."
                    );

                    return;

                }


                window.location.href =
                    "checkout.html";

            }
        );

    }

}


/* ==========================================
   CONFIGURAR MODAL PRODUTO
========================================== */

function configurarModalProduto() {

    const modal =
        document.getElementById(
            "produtoModal"
        );

    const fechar =
        document.getElementById(
            "fecharProdutoModal"
        );

    const adicionar =
        document.getElementById(
            "adicionarProdutoModal"
        );


    if (fechar) {

        fechar.addEventListener(
            "click",
            fecharProduto
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (
                event
            ) {

                if (
                    event.target ===
                    modal
                ) {

                    fecharProduto();

                }

            }
        );

    }


    if (adicionar) {

        adicionar.addEventListener(
            "click",
            adicionarProdutoAoCarrinho
        );

    }

}


/* ==========================================
   ATUALIZAR CATÁLOGO
========================================== */

function configurarAtualizacaoProdutos() {

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                !document.hidden
            ) {

                carregarProdutosOnline();

            }

        }
    );

}


/* ==========================================
   TECLA ESC
========================================== */

function configurarTeclaEsc() {

    document.addEventListener(
        "keydown",
        function (
            event
        ) {

            if (
                event.key ===
                "Escape"
            ) {

                fecharProduto();

                fecharCarrinho();

            }

        }
    );

}


/* ==========================================
   INICIAR
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        carregarCarrinho();

        configurarPesquisa();

        configurarCategorias();

        configurarTamanhos();

        configurarQuantidade();

        configurarCarrinho();

        configurarModalProduto();

        configurarAtualizacaoProdutos();

        configurarTeclaEsc();

        renderizarCarrinho();

        await carregarProdutosOnline();

    }
);