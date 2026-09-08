/* ==========================================
   SANTOS CHEFIA
   CHECKOUT
   CEP + FRETE REAL MELHOR ENVIO
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       CHAVES
    ========================================== */

    const CHAVE_CARRINHO =
        "santosChefiaCarrinho";

    const CHAVE_PEDIDOS =
        "santosChefiaPedidos";

    const CHAVE_PEDIDO_ATUAL =
        "pedidoAtual";


    /* ==========================================
       BACKEND
    ========================================== */

    const URL_BACKEND =
        "https://santos-chefia.onrender.com";


    /* ==========================================
       ELEMENTOS
    ========================================== */

    const cpfInput =
        document.getElementById(
            "cpfCliente"
        );

    const cepInput =
        document.getElementById(
            "cepCliente"
        );

    const whatsappInput =
        document.getElementById(
            "whatsappCliente"
        );

    const buscarCepBtn =
        document.getElementById(
            "buscarCep"
        );

    const finalizarBtn =
        document.getElementById(
            "finalizarPedido"
        );

    const valorFrete =
        document.getElementById(
            "valorFrete"
        );

    const resumoFrete =
        document.getElementById(
            "resumoFrete"
        );

    const resumoSubtotal =
        document.getElementById(
            "resumoSubtotal"
        );

    const resumoTotal =
        document.getElementById(
            "resumoTotal"
        );

    const resumoProdutos =
        document.getElementById(
            "resumoProdutos"
        );


    /* ==========================================
       ESTADO
    ========================================== */

    let subtotal =
        0;

    let frete =
        0;

    let freteCalculado =
        false;

    let entregaGratis =
        false;

    let calculandoFrete =
        false;

    let carrinho =
        [];

    let cotacoesFrete =
        [];

    let freteSelecionado =
        null;


    /* ==========================================
       ÁREA DAS OPÇÕES DE FRETE
    ========================================== */

    const opcoesFrete =
        document.createElement(
            "div"
        );

    opcoesFrete.id =
        "opcoesFrete";

    opcoesFrete.style.display =
        "none";

    opcoesFrete.style.marginTop =
        "15px";

    opcoesFrete.style.padding =
        "14px";

    opcoesFrete.style.background =
        "#0b0b0b";

    opcoesFrete.style.border =
        "1px solid rgba(255,255,255,.08)";


    if (
        valorFrete &&
        valorFrete.parentElement
    ) {

        valorFrete
            .parentElement
            .insertAdjacentElement(
                "afterend",
                opcoesFrete
            );

    }


    /* ==========================================
       FORMATAR CPF
    ========================================== */

    if (cpfInput) {

        cpfInput.addEventListener(
            "input",
            function () {

                let valor =
                    cpfInput.value
                        .replace(
                            /\D/g,
                            ""
                        );


                if (
                    valor.length > 11
                ) {

                    valor =
                        valor.substring(
                            0,
                            11
                        );

                }


                valor =
                    valor.replace(
                        /(\d{3})(\d)/,
                        "$1.$2"
                    );


                valor =
                    valor.replace(
                        /(\d{3})(\d)/,
                        "$1.$2"
                    );


                valor =
                    valor.replace(
                        /(\d{3})(\d{1,2})$/,
                        "$1-$2"
                    );


                cpfInput.value =
                    valor;

            }
        );

    }


    /* ==========================================
       FORMATAR CEP
    ========================================== */

    if (cepInput) {

        cepInput.addEventListener(
            "input",
            function () {

                let valor =
                    cepInput.value
                        .replace(
                            /\D/g,
                            ""
                        );


                if (
                    valor.length > 8
                ) {

                    valor =
                        valor.substring(
                            0,
                            8
                        );

                }


                if (
                    valor.length > 5
                ) {

                    valor =
                        valor.replace(
                            /^(\d{5})(\d)/,
                            "$1-$2"
                        );

                }


                cepInput.value =
                    valor;

                limparFrete();

            }
        );

    }


    /* ==========================================
       FORMATAR WHATSAPP
    ========================================== */

    if (whatsappInput) {

        whatsappInput.addEventListener(
            "input",
            function () {

                let valor =
                    whatsappInput.value
                        .replace(
                            /\D/g,
                            ""
                        );


                if (
                    valor.length > 11
                ) {

                    valor =
                        valor.substring(
                            0,
                            11
                        );

                }


                if (
                    valor.length <= 10
                ) {

                    valor =
                        valor.replace(
                            /^(\d{2})(\d)/,
                            "($1) $2"
                        );

                    valor =
                        valor.replace(
                            /(\d{4})(\d)/,
                            "$1-$2"
                        );

                }

                else {

                    valor =
                        valor.replace(
                            /^(\d{2})(\d)/,
                            "($1) $2"
                        );

                    valor =
                        valor.replace(
                            /(\d{5})(\d)/,
                            "$1-$2"
                        );

                }


                whatsappInput.value =
                    valor;

            }
        );

    }


    /* ==========================================
       VALIDAR CPF
    ========================================== */

    function validarCPF(cpf) {

        cpf =
            String(cpf)
                .replace(
                    /\D/g,
                    ""
                );


        if (
            cpf.length !== 11
        ) {

            return false;

        }


        if (
            /^(\d)\1+$/.test(cpf)
        ) {

            return false;

        }


        let soma =
            0;


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            soma +=
                Number(
                    cpf.charAt(i)
                )
                *
                (10 - i);

        }


        let resto =
            (soma * 10)
            %
            11;


        if (
            resto === 10
        ) {

            resto =
                0;

        }


        if (
            resto !==
            Number(
                cpf.charAt(9)
            )
        ) {

            return false;

        }


        soma =
            0;


        for (
            let i = 0;
            i < 10;
            i++
        ) {

            soma +=
                Number(
                    cpf.charAt(i)
                )
                *
                (11 - i);

        }


        resto =
            (soma * 10)
            %
            11;


        if (
            resto === 10
        ) {

            resto =
                0;

        }


        return (
            resto ===
            Number(
                cpf.charAt(10)
            )
        );

    }


    /* ==========================================
       NORMALIZAR TEXTO
    ========================================== */

    function normalizarTexto(
        texto
    ) {

        return String(
            texto || ""
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
       BUSCAR CEP
    ========================================== */

    if (buscarCepBtn) {

        buscarCepBtn.addEventListener(
            "click",
            async function () {

                if (!cepInput) {

                    return;

                }


                const cep =
                    cepInput.value
                        .replace(
                            /\D/g,
                            ""
                        );


                if (
                    cep.length !== 8
                ) {

                    alert(
                        "Digite um CEP válido."
                    );

                    cepInput.focus();

                    return;

                }


                buscarCepBtn.textContent =
                    "Buscando...";

                buscarCepBtn.disabled =
                    true;


                try {

                    const resposta =
                        await fetch(
                            `https://viacep.com.br/ws/${cep}/json/`
                        );


                    if (
                        !resposta.ok
                    ) {

                        throw new Error(
                            "Erro ao consultar CEP."
                        );

                    }


                    const dados =
                        await resposta.json();


                    if (
                        dados.erro
                    ) {

                        alert(
                            "CEP não encontrado."
                        );

                        return;

                    }


                    preencherCampo(
                        "ruaCliente",
                        dados.logradouro
                    );

                    preencherCampo(
                        "bairroCliente",
                        dados.bairro
                    );

                    preencherCampo(
                        "cidadeCliente",
                        dados.localidade
                    );

                    preencherCampo(
                        "estadoCliente",
                        dados.uf
                    );


                    await calcularFrete(
                        cep,
                        dados.localidade,
                        dados.uf
                    );

                }

                catch (erro) {

                    console.error(
                        erro
                    );


                    alert(
                        "Não foi possível consultar o CEP."
                    );

                }

                finally {

                    buscarCepBtn.textContent =
                        "Buscar";

                    buscarCepBtn.disabled =
                        false;

                }

            }
        );

    }


    /* ==========================================
       PREENCHER CAMPO
    ========================================== */

    function preencherCampo(
        id,
        valor
    ) {

        const campo =
            document.getElementById(
                id
            );


        if (!campo) {

            return;

        }


        campo.value =
            valor || "";

    }


    /* ==========================================
       LIMPAR FRETE
    ========================================== */

    function limparFrete() {

        frete =
            0;

        freteCalculado =
            false;

        entregaGratis =
            false;

        calculandoFrete =
            false;

        freteSelecionado =
            null;

        cotacoesFrete =
            [];


        esconderOpcoesFrete();


        const entrega =
            document.querySelector(
                'input[name="entrega"]:checked'
            );


        if (
            entrega &&
            entrega.value ===
                "delivery"
        ) {

            mostrarFretePendente();

        }


        atualizarResumo();

    }


    /* ==========================================
       CALCULAR FRETE
    ========================================== */

    async function calcularFrete(
        cep,
        cidadeRecebida = "",
        estadoRecebido = ""
    ) {

        const entrega =
            document.querySelector(
                'input[name="entrega"]:checked'
            );


        /* RETIRADA */

        if (
            entrega &&
            entrega.value ===
                "retirada"
        ) {

            frete =
                0;

            freteCalculado =
                true;

            entregaGratis =
                true;

            calculandoFrete =
                false;


            freteSelecionado = {

                id:
                    "retirada",

                servico:
                    "Retirada na loja",

                transportadora:
                    "Santos Chefia",

                preco:
                    0,

                prazo:
                    null

            };


            esconderOpcoesFrete();

            mostrarFreteGratis();

            atualizarResumo();


            return true;

        }


        const cidade =
            cidadeRecebida ||
            pegarValor(
                "cidadeCliente"
            );


        const estado =
            estadoRecebido ||
            pegarValor(
                "estadoCliente"
            );


        const cidadeNormalizada =
            normalizarTexto(
                cidade
            );


        const estadoNormalizado =
            normalizarTexto(
                estado
            );


        /* LAJEDO */

        if (
            cidadeNormalizada ===
                "lajedo"
            &&
            estadoNormalizado ===
                "pe"
        ) {

            frete =
                0;

            freteCalculado =
                true;

            entregaGratis =
                true;

            calculandoFrete =
                false;


            freteSelecionado = {

                id:
                    "lajedo-gratis",

                servico:
                    "Entrega local",

                transportadora:
                    "Santos Chefia",

                preco:
                    0,

                prazo:
                    null

            };


            esconderOpcoesFrete();

            mostrarFreteGratis();

            atualizarResumo();


            return true;

        }


        return await calcularFreteMelhorEnvio(
            cep
        );

    }


    /* ==========================================
       MELHOR ENVIO
    ========================================== */

    async function calcularFreteMelhorEnvio(
        cep
    ) {

        if (
            calculandoFrete
        ) {

            return false;

        }


        calculandoFrete =
            true;

        frete =
            0;

        freteCalculado =
            false;

        entregaGratis =
            false;

        freteSelecionado =
            null;

        cotacoesFrete =
            [];


        esconderOpcoesFrete();

        mostrarCalculandoFrete();

        atualizarResumo();


        try {

            const resposta =
                await fetch(

                    `${URL_BACKEND}/melhor-envio/cotar`,

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                cep:
                                    cep,

                                produtos:
                                    carrinho

                            })

                    }

                );


            const dados =
                await resposta.json();


            if (
                !resposta.ok
            ) {

                throw new Error(
                    dados.mensagem ||
                    "Erro ao calcular frete."
                );

            }


            if (
                !dados.sucesso ||
                !Array.isArray(
                    dados.cotacoes
                ) ||
                dados.cotacoes.length === 0
            ) {

                throw new Error(
                    "Nenhuma opção de frete disponível."
                );

            }


            cotacoesFrete =
                dados.cotacoes
                    .filter(
                        function (
                            cotacao
                        ) {

                            return (
                                Number(
                                    cotacao.preco
                                )
                                >
                                0
                            );

                        }
                    )
                    .sort(
                        function (
                            a,
                            b
                        ) {

                            return (
                                Number(
                                    a.preco
                                )
                                -
                                Number(
                                    b.preco
                                )
                            );

                        }
                    );


            if (
                cotacoesFrete.length === 0
            ) {

                throw new Error(
                    "Nenhuma opção de frete disponível."
                );

            }


            calculandoFrete =
                false;


            selecionarFrete(
                cotacoesFrete[0]
            );


            mostrarOpcoesFrete();


            atualizarResumo();


            return true;

        }

        catch (erro) {

            console.error(
                "Erro Melhor Envio:",
                erro
            );


            frete =
                0;

            freteCalculado =
                false;

            entregaGratis =
                false;

            calculandoFrete =
                false;

            freteSelecionado =
                null;


            mostrarErroFrete(
                erro.message ||
                "Não foi possível calcular o frete."
            );


            atualizarResumo();


            return false;

        }

    }


    /* ==========================================
       SELECIONAR FRETE
    ========================================== */

    function selecionarFrete(
        cotacao
    ) {

        if (!cotacao) {

            return;

        }


        freteSelecionado = {

            id:
                cotacao.id,

            servico:
                cotacao.servico ||
                cotacao.nome ||
                "Frete",

            transportadora:
                cotacao.transportadora ||
                "",

            preco:
                Number(
                    cotacao.preco
                ) || 0,

            prazo:
                cotacao.prazo ||
                null,

            prazoMinimo:
                cotacao.prazoMinimo ||
                null,

            prazoMaximo:
                cotacao.prazoMaximo ||
                null

        };


        frete =
            freteSelecionado.preco;


        freteCalculado =
            true;


        entregaGratis =
            frete === 0;


        calculandoFrete =
            false;


        atualizarResumo();

    }


    /* ==========================================
       MOSTRAR OPÇÕES DE FRETE
    ========================================== */

    function mostrarOpcoesFrete() {

        opcoesFrete.innerHTML =
            "";


        const titulo =
            document.createElement(
                "p"
            );


        titulo.textContent =
            "Escolha uma opção de frete:";


        titulo.style.margin =
            "0 0 12px";

        titulo.style.fontSize =
            "12px";

        titulo.style.fontWeight =
            "700";

        titulo.style.color =
            "#aaa";


        opcoesFrete.appendChild(
            titulo
        );


        cotacoesFrete.forEach(
            function (
                cotacao,
                index
            ) {

                const linha =
                    document.createElement(
                        "label"
                    );


                linha.style.display =
                    "flex";

                linha.style.alignItems =
                    "center";

                linha.style.gap =
                    "12px";

                linha.style.padding =
                    "12px";

                linha.style.marginBottom =
                    "8px";

                linha.style.cursor =
                    "pointer";

                linha.style.background =
                    "#101010";

                linha.style.border =
                    "1px solid rgba(255,255,255,.08)";


                const radio =
                    document.createElement(
                        "input"
                    );


                radio.type =
                    "radio";

                radio.name =
                    "freteMelhorEnvio";

                radio.value =
                    String(
                        cotacao.id
                    );


                if (
                    index === 0
                ) {

                    radio.checked =
                        true;

                }


                radio.addEventListener(
                    "change",
                    function () {

                        if (
                            radio.checked
                        ) {

                            selecionarFrete(
                                cotacao
                            );

                        }

                    }
                );


                const conteudo =
                    document.createElement(
                        "div"
                    );


                conteudo.style.flex =
                    "1";


                const nome =
                    document.createElement(
                        "strong"
                    );


                nome.style.display =
                    "block";

                nome.style.fontSize =
                    "13px";

                nome.style.color =
                    "#fff";


                const nomeServico =
                    cotacao.servico ||
                    cotacao.nome ||
                    "Frete";


                const transportadora =
                    cotacao.transportadora ||
                    "";


                nome.textContent =
                    transportadora
                        ?
                        `${transportadora} - ${nomeServico}`
                        :
                        nomeServico;


                const prazo =
                    document.createElement(
                        "span"
                    );


                prazo.style.display =
                    "block";

                prazo.style.marginTop =
                    "4px";

                prazo.style.fontSize =
                    "11px";

                prazo.style.color =
                    "#777";


                if (
                    cotacao.prazo
                ) {

                    prazo.textContent =
                        `Prazo estimado: ${cotacao.prazo} dia(s)`;

                }

                else if (
                    cotacao.prazoMinimo &&
                    cotacao.prazoMaximo
                ) {

                    prazo.textContent =
                        `Prazo estimado: ${cotacao.prazoMinimo} a ${cotacao.prazoMaximo} dias`;

                }

                else {

                    prazo.textContent =
                        "Prazo informado pela transportadora";

                }


                const preco =
                    document.createElement(
                        "strong"
                    );


                preco.textContent =
                    formatarMoeda(
                        cotacao.preco
                    );


                preco.style.color =
                    "#ff6900";

                preco.style.whiteSpace =
                    "nowrap";


                conteudo.appendChild(
                    nome
                );

                conteudo.appendChild(
                    prazo
                );

                linha.appendChild(
                    radio
                );

                linha.appendChild(
                    conteudo
                );

                linha.appendChild(
                    preco
                );


                opcoesFrete.appendChild(
                    linha
                );

            }
        );


        opcoesFrete.style.display =
            "block";

    }


    /* ==========================================
       ESCONDER OPÇÕES
    ========================================== */

    function esconderOpcoesFrete() {

        opcoesFrete.style.display =
            "none";

        opcoesFrete.innerHTML =
            "";

    }


    /* ==========================================
       MOSTRAR GRÁTIS
    ========================================== */

    function mostrarFreteGratis() {

        if (valorFrete) {

            valorFrete.textContent =
                "Grátis";

        }


        if (resumoFrete) {

            resumoFrete.textContent =
                "Grátis";

        }

    }


    /* ==========================================
       MOSTRAR PENDENTE
    ========================================== */

    function mostrarFretePendente() {

        if (valorFrete) {

            valorFrete.textContent =
                "A calcular";

        }


        if (resumoFrete) {

            resumoFrete.textContent =
                "A calcular";

        }

    }


    /* ==========================================
       MOSTRAR CALCULANDO
    ========================================== */

    function mostrarCalculandoFrete() {

        if (valorFrete) {

            valorFrete.textContent =
                "Calculando...";

        }


        if (resumoFrete) {

            resumoFrete.textContent =
                "Calculando...";

        }

    }


    /* ==========================================
       MOSTRAR ERRO
    ========================================== */

    function mostrarErroFrete(
        mensagem
    ) {

        if (valorFrete) {

            valorFrete.textContent =
                "Indisponível";

        }


        if (resumoFrete) {

            resumoFrete.textContent =
                "Indisponível";

        }


        opcoesFrete.style.display =
            "block";


        opcoesFrete.innerHTML = `

            <p
                style="
                    margin:0;
                    color:#ff7777;
                    font-size:12px;
                    line-height:1.5;
                "
            >

                ${escapeHtml(
                    mensagem
                )}

            </p>

        `;

    }


    /* ==========================================
       ENTREGA / RETIRADA
    ========================================== */

    document
        .querySelectorAll(
            'input[name="entrega"]'
        )
        .forEach(
            function (
                radio
            ) {

                radio.addEventListener(
                    "change",
                    async function () {

                        if (
                            !radio.checked
                        ) {

                            return;

                        }


                        if (
                            radio.value ===
                                "retirada"
                        ) {

                            frete =
                                0;

                            freteCalculado =
                                true;

                            entregaGratis =
                                true;

                            calculandoFrete =
                                false;


                            freteSelecionado = {

                                id:
                                    "retirada",

                                servico:
                                    "Retirada na loja",

                                transportadora:
                                    "Santos Chefia",

                                preco:
                                    0,

                                prazo:
                                    null

                            };


                            esconderOpcoesFrete();

                            mostrarFreteGratis();

                            atualizarResumo();


                            return;

                        }


                        if (
                            radio.value ===
                                "delivery"
                        ) {

                            limparFrete();


                            if (!cepInput) {

                                return;

                            }


                            const cep =
                                cepInput.value
                                    .replace(
                                        /\D/g,
                                        ""
                                    );


                            if (
                                cep.length !== 8
                            ) {

                                mostrarFretePendente();

                                atualizarResumo();

                                return;

                            }


                            const cidade =
                                pegarValor(
                                    "cidadeCliente"
                                );


                            const estado =
                                pegarValor(
                                    "estadoCliente"
                                );


                            await calcularFrete(
                                cep,
                                cidade,
                                estado
                            );

                        }

                    }
                );

            }
        );


    /* ==========================================
       FORMATAR MOEDA
    ========================================== */

    function formatarMoeda(
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
       ATUALIZAR RESUMO
    ========================================== */

    function atualizarResumo() {

        if (resumoSubtotal) {

            resumoSubtotal.textContent =
                formatarMoeda(
                    subtotal
                );

        }


        const entrega =
            document.querySelector(
                'input[name="entrega"]:checked'
            );


        if (
            calculandoFrete
        ) {

            mostrarCalculandoFrete();

        }

        else if (
            entrega &&
            entrega.value ===
                "retirada"
        ) {

            mostrarFreteGratis();

        }

        else if (
            entregaGratis
        ) {

            mostrarFreteGratis();

        }

        else if (
            freteCalculado &&
            freteSelecionado
        ) {

            if (valorFrete) {

                valorFrete.textContent =
                    formatarMoeda(
                        frete
                    );

            }


            if (resumoFrete) {

                resumoFrete.textContent =
                    formatarMoeda(
                        frete
                    );

            }

        }

        else {

            mostrarFretePendente();

        }


        if (resumoTotal) {

            resumoTotal.textContent =
                formatarMoeda(
                    subtotal +
                    frete
                );

        }

    }


    /* ==========================================
       CARREGAR CARRINHO
    ========================================== */

    function carregarCarrinho() {

        const carrinhoSalvo =
            localStorage.getItem(
                CHAVE_CARRINHO
            );


        if (!carrinhoSalvo) {

            carrinho =
                [];

            mostrarCarrinhoVazio();

            return;

        }


        try {

            const dados =
                JSON.parse(
                    carrinhoSalvo
                );


            if (
                !Array.isArray(
                    dados
                ) ||
                dados.length === 0
            ) {

                carrinho =
                    [];

                mostrarCarrinhoVazio();

                return;

            }


            carrinho =
                dados.map(
                    function (
                        produto
                    ) {

                        return {

                            ...produto,

                            id:
                                String(
                                    produto.id ?? ""
                                ),

                            preco:
                                Number(
                                    produto.preco
                                ) || 0,

                            quantidade:
                                Number(
                                    produto.quantidade
                                ) || 1

                        };

                    }
                );


            mostrarProdutosCarrinho();

        }

        catch (erro) {

            console.error(
                "Erro ao carregar carrinho:",
                erro
            );


            carrinho =
                [];

            mostrarCarrinhoVazio();

        }

    }


    /* ==========================================
       CARRINHO VAZIO
    ========================================== */

    function mostrarCarrinhoVazio() {

        subtotal =
            0;


        if (resumoProdutos) {

            resumoProdutos.innerHTML = `

                <p class="carrinho-vazio">

                    Seu carrinho está vazio.

                </p>

            `;

        }


        atualizarResumo();

    }


    /* ==========================================
       PRODUTOS DO CARRINHO
    ========================================== */

    function mostrarProdutosCarrinho() {

        if (!resumoProdutos) {

            return;

        }


        resumoProdutos.innerHTML =
            "";


        subtotal =
            0;


        carrinho.forEach(
            function (
                produto
            ) {

                const quantidade =
                    Number(
                        produto.quantidade
                    ) || 1;


                const preco =
                    Number(
                        produto.preco
                    ) || 0;


                const totalProduto =
                    preco *
                    quantidade;


                subtotal +=
                    totalProduto;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "resumo-produto";


                item.innerHTML = `

                    ${
                        produto.imagem
                            ?
                            `

                            <img
                                class="resumo-produto-imagem"
                                src="${produto.imagem}"
                                alt="${escapeHtml(
                                    produto.nome ||
                                    "Produto"
                                )}"
                            >

                            `
                            :
                            ""
                    }


                    <div class="resumo-produto-info">


                        <strong>

                            ${escapeHtml(
                                produto.nome ||
                                "Produto"
                            )}

                        </strong>


                        <span>

                            ${quantidade}x

                            ${
                                produto.tamanho
                                    ?
                                    ` • Tam. ${escapeHtml(
                                        produto.tamanho
                                    )}`
                                    :
                                    ""
                            }

                        </span>


                    </div>


                    <strong class="resumo-produto-preco">

                        ${formatarMoeda(
                            totalProduto
                        )}

                    </strong>

                `;


                resumoProdutos.appendChild(
                    item
                );

            }
        );


        atualizarResumo();

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


            return (
                Array.isArray(
                    dados
                )
                    ?
                    dados
                    :
                    []
            );

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
       GERAR NÚMERO PEDIDO
    ========================================== */

    function gerarNumeroPedido() {

        const agora =
            new Date();


        const ano =
            String(
                agora.getFullYear()
            )
                .slice(
                    -2
                );


        const mes =
            String(
                agora.getMonth() + 1
            )
                .padStart(
                    2,
                    "0"
                );


        const dia =
            String(
                agora.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        const numero =
            String(
                Date.now()
            )
                .slice(
                    -6
                );


        return (
            `SC${ano}${mes}${dia}-${numero}`
        );

    }


    /* ==========================================
       STATUS INICIAL
    ========================================== */

    function definirStatusInicial(
        pagamento
    ) {

        if (
            pagamento ===
                "dinheiro"
        ) {

            return (
                "Novo pedido"
            );

        }


        return (
            "Aguardando pagamento"
        );

    }


    /* ==========================================
       NOME PAGAMENTO
    ========================================== */

    function nomePagamento(
        pagamento
    ) {

        const nomes = {

            pix:
                "Pix",

            credito:
                "Cartão de crédito",

            debito:
                "Cartão de débito",

            dinheiro:
                "Dinheiro"

        };


        return (
            nomes[pagamento] ||
            pagamento
        );

    }


    /* ==========================================
       NOME ENTREGA
    ========================================== */

    function nomeEntrega(
        entrega
    ) {

        if (
            entrega ===
                "retirada"
        ) {

            return (
                "Retirada na loja"
            );

        }


        return (
            "Entrega"
        );

    }


    /* ==========================================
       FINALIZAR PEDIDO
    ========================================== */

    if (finalizarBtn) {

        finalizarBtn.addEventListener(
            "click",
            async function () {

                if (
                    carrinho.length === 0
                ) {

                    alert(
                        "Seu carrinho está vazio."
                    );

                    return;

                }


                const nome =
                    pegarValor(
                        "nomeCliente"
                    );


                const cpf =
                    cpfInput
                        ?
                        cpfInput.value.trim()
                        :
                        "";


                const whatsapp =
                    whatsappInput
                        ?
                        whatsappInput.value.trim()
                        :
                        "";


                const email =
                    pegarValor(
                        "emailCliente"
                    );


                const entregaSelecionada =
                    document.querySelector(
                        'input[name="entrega"]:checked'
                    );


                const pagamentoSelecionado =
                    document.querySelector(
                        'input[name="pagamento"]:checked'
                    );


                /* VALIDAÇÕES */

                if (!nome) {

                    alert(
                        "Digite seu nome completo."
                    );

                    focarCampo(
                        "nomeCliente"
                    );

                    return;

                }


                if (
                    !validarCPF(cpf)
                ) {

                    alert(
                        "Digite um CPF válido."
                    );


                    if (cpfInput) {

                        cpfInput.focus();

                    }


                    return;

                }


                if (!whatsapp) {

                    alert(
                        "Digite seu WhatsApp."
                    );


                    if (whatsappInput) {

                        whatsappInput.focus();

                    }


                    return;

                }


                if (!email) {

                    alert(
                        "Digite seu e-mail."
                    );

                    focarCampo(
                        "emailCliente"
                    );

                    return;

                }


                if (
                    !entregaSelecionada
                ) {

                    alert(
                        "Escolha entrega ou retirada."
                    );

                    return;

                }


                if (
                    !pagamentoSelecionado
                ) {

                    alert(
                        "Escolha uma forma de pagamento."
                    );

                    return;

                }


                const entrega =
                    entregaSelecionada.value;


                const pagamento =
                    pagamentoSelecionado.value;


                let endereco =
                    null;


                /* ==========================================
                   ENTREGA
                ========================================== */

                if (
                    entrega ===
                        "delivery"
                ) {

                    const cep =
                        cepInput
                            ?
                            cepInput.value.trim()
                            :
                            "";


                    const cepLimpo =
                        cep.replace(
                            /\D/g,
                            ""
                        );


                    const rua =
                        pegarValor(
                            "ruaCliente"
                        );


                    const numero =
                        pegarValor(
                            "numeroCliente"
                        );


                    const complemento =
                        pegarValor(
                            "complementoCliente"
                        );


                    const bairro =
                        pegarValor(
                            "bairroCliente"
                        );


                    const cidade =
                        pegarValor(
                            "cidadeCliente"
                        );


                    const estado =
                        pegarValor(
                            "estadoCliente"
                        );


                    if (
                        cepLimpo.length !== 8
                    ) {

                        alert(
                            "Digite um CEP válido."
                        );


                        if (cepInput) {

                            cepInput.focus();

                        }


                        return;

                    }


                    if (
                        !rua ||
                        !numero ||
                        !bairro ||
                        !cidade ||
                        !estado
                    ) {

                        alert(
                            "Preencha o endereço completo."
                        );

                        return;

                    }


                    endereco = {

                        cep:
                            cep,

                        rua:
                            rua,

                        numero:
                            numero,

                        complemento:
                            complemento,

                        bairro:
                            bairro,

                        cidade:
                            cidade,

                        estado:
                            estado

                    };


                    if (
                        !freteCalculado ||
                        !freteSelecionado
                    ) {

                        finalizarBtn.disabled =
                            true;


                        finalizarBtn.textContent =
                            "CALCULANDO FRETE...";


                        const sucessoFrete =
                            await calcularFrete(
                                cepLimpo,
                                cidade,
                                estado
                            );


                        finalizarBtn.disabled =
                            false;


                        finalizarBtn.textContent =
                            "Continuar para pagamento";


                        if (
                            !sucessoFrete ||
                            !freteCalculado ||
                            !freteSelecionado
                        ) {

                            alert(
                                "Não foi possível calcular o frete. Confira sua conexão e tente novamente."
                            );

                            return;

                        }

                    }

                }

                else {

                    frete =
                        0;

                    freteCalculado =
                        true;

                    entregaGratis =
                        true;

                    calculandoFrete =
                        false;


                    freteSelecionado = {

                        id:
                            "retirada",

                        servico:
                            "Retirada na loja",

                        transportadora:
                            "Santos Chefia",

                        preco:
                            0,

                        prazo:
                            null

                    };


                    endereco = {

                        tipo:
                            "retirada",

                        local:
                            "Santos Chefia - Lajedo/PE"

                    };

                }


                /* ==========================================
                   CRIAR PEDIDO
                ========================================== */

                const numeroPedido =
                    gerarNumeroPedido();


                const pedido = {

                    id:
                        String(
                            Date.now()
                        ),

                    numero:
                        numeroPedido,


                    cliente: {

                        nome:
                            nome,

                        cpf:
                            cpf,

                        whatsapp:
                            whatsapp,

                        email:
                            email

                    },


                    endereco:
                        endereco,


                    entrega:
                        entrega,


                    entregaNome:
                        nomeEntrega(
                            entrega
                        ),


                    freteOpcao:
                        freteSelecionado
                            ?
                            {

                                id:
                                    freteSelecionado.id,

                                servico:
                                    freteSelecionado.servico,

                                transportadora:
                                    freteSelecionado.transportadora,

                                prazo:
                                    freteSelecionado.prazo,

                                prazoMinimo:
                                    freteSelecionado.prazoMinimo
                                    ||
                                    null,

                                prazoMaximo:
                                    freteSelecionado.prazoMaximo
                                    ||
                                    null,

                                preco:
                                    Number(
                                        freteSelecionado.preco
                                    )

                            }
                            :
                            null,


                    pagamento:
                        pagamento,


                    pagamentoNome:
                        nomePagamento(
                            pagamento
                        ),


                    produtos:
                        carrinho.map(
                            function (
                                produto
                            ) {

                                return {

                                    id:
                                        String(
                                            produto.id ?? ""
                                        ),

                                    nome:
                                        produto.nome ||
                                        "Produto",

                                    categoria:
                                        produto.categoria ||
                                        "",

                                    preco:
                                        Number(
                                            produto.preco
                                        ) || 0,

                                    imagem:
                                        produto.imagem ||
                                        "",

                                    tamanho:
                                        produto.tamanho ||
                                        "",

                                    quantidade:
                                        Number(
                                            produto.quantidade
                                        ) || 1

                                };

                            }
                        ),


                    subtotal:
                        Number(
                            subtotal
                        ),


                    frete:
                        Number(
                            frete
                        ),


                    total:
                        Number(
                            subtotal +
                            frete
                        ),


                    status:
                        definirStatusInicial(
                            pagamento
                        ),


                    data:
                        new Date()
                            .toISOString()

                };


                /* ==========================================
                   SALVAR PEDIDO
                ========================================== */

                const pedidos =
                    pegarPedidos();


                pedidos.unshift(
                    pedido
                );


                localStorage.setItem(
                    CHAVE_PEDIDOS,
                    JSON.stringify(
                        pedidos
                    )
                );


                localStorage.setItem(
                    CHAVE_PEDIDO_ATUAL,
                    JSON.stringify(
                        pedido
                    )
                );


                /* ==========================================
                   LIMPAR CARRINHO
                ========================================== */

                localStorage.removeItem(
                    CHAVE_CARRINHO
                );


                carrinho =
                    [];

                subtotal =
                    0;


                /* ==========================================
                   MENSAGEM
                ========================================== */

                let mensagem =

                    `Pedido ${numeroPedido} registrado com sucesso!\n\n`;


                if (
                    freteSelecionado &&
                    freteSelecionado.transportadora &&
                    frete > 0
                ) {

                    mensagem +=

                        `Frete: ${freteSelecionado.transportadora} - ${freteSelecionado.servico}\n`;


                    mensagem +=

                        `Valor: ${formatarMoeda(frete)}\n`;


                    if (
                        freteSelecionado.prazo
                    ) {

                        mensagem +=

                            `Prazo estimado: ${freteSelecionado.prazo} dia(s)\n\n`;

                    }

                    else {

                        mensagem +=
                            "\n";

                    }

                }


                if (
                    pagamento ===
                        "pix"
                ) {

                    mensagem +=
                        "O pedido está aguardando pagamento via Pix.";

                }

                else if (
                    pagamento ===
                        "credito"
                ) {

                    mensagem +=
                        "O pedido está aguardando pagamento com cartão de crédito.";

                }

                else if (
                    pagamento ===
                        "debito"
                ) {

                    mensagem +=
                        "O pedido está aguardando pagamento com cartão de débito.";

                }

                else {

                    mensagem +=
                        "Pagamento em dinheiro selecionado.";

                }


                mensagem +=
                    "\n\nNesta versão de demonstração, o pedido já aparecerá no painel administrativo.";


                alert(
                    mensagem
                );


                esconderOpcoesFrete();


                mostrarCarrinhoVazio();


                finalizarBtn.disabled =
                    true;


                finalizarBtn.textContent =
                    "PEDIDO REGISTRADO";

            }
        );

    }


    /* ==========================================
       PEGAR VALOR
    ========================================== */

    function pegarValor(
        id
    ) {

        const campo =
            document.getElementById(
                id
            );


        return (
            campo
                ?
                campo.value.trim()
                :
                ""
        );

    }


    /* ==========================================
       FOCAR CAMPO
    ========================================== */

    function focarCampo(
        id
    ) {

        const campo =
            document.getElementById(
                id
            );


        if (campo) {

            campo.focus();

        }

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


        return (
            div.innerHTML
        );

    }


    /* ==========================================
       INICIAR
    ========================================== */

    carregarCarrinho();

});