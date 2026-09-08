// ==========================================
// SANTOS CHEFIA
// BACKEND
// ASAAS + MELHOR ENVIO + SUPABASE
// ==========================================

const path = require("path");
const fs = require("fs");


// ==========================================
// .ENV
// ==========================================

const caminhoEnv = path.resolve(
    __dirname,
    ".env"
);

require("dotenv").config({
    path: caminhoEnv,
    override: true
});


// ==========================================
// DEPENDÊNCIAS
// ==========================================

const express = require("express");
const cors = require("cors");
const axios = require("axios");


// ==========================================
// APP
// ==========================================

const app = express();

const PORT =
    process.env.PORT || 3000;


// ==========================================
// MIDDLEWARES
// ==========================================

app.use(
    cors()
);

app.use(
    express.json({
        limit: "10mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);


// ==========================================
// CATEGORIAS
// ==========================================

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


// ==========================================
// FRETE PADRÃO
// ==========================================

const DIMENSOES_PADRAO_ROUPA = {

    peso: 0.5,
    comprimento: 30,
    largura: 20,
    altura: 10

};


// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    process.env.SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY;


function supabaseConfigurado() {

    return Boolean(
        SUPABASE_URL
        &&
        SUPABASE_SERVICE_ROLE_KEY
    );

}


const supabase = axios.create({

    baseURL:
        SUPABASE_URL
            ?
            `${SUPABASE_URL}/rest/v1`
            :
            "http://localhost",

    headers: {

        "Content-Type":
            "application/json",

        "Accept":
            "application/json",

        "apikey":
            SUPABASE_SERVICE_ROLE_KEY || "",

        "Authorization":
            `Bearer ${SUPABASE_SERVICE_ROLE_KEY || ""}`

    }

});


// ==========================================
// NORMALIZAR PRODUTO DO BANCO
// ==========================================

function normalizarProdutoBanco(
    produto
) {

    return {

        id:
            String(
                produto.id ?? ""
            ),

        nome:
            produto.nome || "",

        categoria:
            produto.categoria || "Início",

        preco:
            Number(
                produto.preco || 0
            ),

        estoque:
            Number(
                produto.estoque || 0
            ),

        tamanhos:
            Array.isArray(
                produto.tamanhos
            )
                ?
                produto.tamanhos
                :
                [],

        imagem:
            produto.imagem || "",

        frete:
            produto.frete
            ||
            {
                ...DIMENSOES_PADRAO_ROUPA
            },

        criadoEm:
            produto.created_at || null

    };

}


// ==========================================
// VALIDAR PRODUTO
// ==========================================

function validarProduto(
    produto
) {

    const nome =
        String(
            produto.nome || ""
        ).trim();

    const categoria =
        String(
            produto.categoria || ""
        ).trim();

    const preco =
        Number(
            produto.preco
        );

    const estoque =
        Number(
            produto.estoque
        );

    const tamanhos =
        Array.isArray(
            produto.tamanhos
        )
            ?
            produto.tamanhos
            :
            [];


    if (!nome) {

        return {
            valido: false,
            mensagem:
                "Nome do produto não informado."
        };

    }


    if (
        !CATEGORIAS_SANTOS_CHEFIA.includes(
            categoria
        )
    ) {

        return {
            valido: false,
            mensagem:
                "Categoria inválida."
        };

    }


    if (
        !Number.isFinite(
            preco
        )
        ||
        preco <= 0
    ) {

        return {
            valido: false,
            mensagem:
                "Preço inválido."
        };

    }


    if (
        !Number.isFinite(
            estoque
        )
        ||
        estoque < 0
    ) {

        return {
            valido: false,
            mensagem:
                "Estoque inválido."
        };

    }


    if (
        tamanhos.length === 0
    ) {

        return {
            valido: false,
            mensagem:
                "Selecione pelo menos um tamanho."
        };

    }


    return {
        valido: true
    };

}


// ==========================================
// OBJETO PARA O BANCO
// ==========================================

function prepararProdutoBanco(
    produto,
    idExistente = null
) {

    return {

        id:
            String(
                idExistente
                ||
                produto.id
                ||
                Date.now()
            ),

        nome:
            String(
                produto.nome || ""
            ).trim(),

        categoria:
            String(
                produto.categoria || ""
            ).trim(),

        preco:
            Number(
                produto.preco
            ),

        estoque:
            Number(
                produto.estoque
            ),

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
            produto.imagem
            ?
            String(
                produto.imagem
            )
            :
            null,

        frete:
            produto.frete
            ||
            {
                ...DIMENSOES_PADRAO_ROUPA
            }

    };

}


// ==========================================
// MELHOR ENVIO
// ==========================================

const MELHOR_ENVIO_BASE_URL =
    "https://sandbox.melhorenvio.com.br";

const SERVICOS_MELHOR_ENVIO =
    "1,2,3,4";


function pegarUserAgentMelhorEnvio() {

    const email =
        process.env.MELHOR_ENVIO_EMAIL
        ||
        "suporte@santoschefia.com.br";

    return (
        `Santos Chefia (${email})`
    );

}


function pegarCepOrigem() {

    return String(
        process.env.CEP_ORIGEM
        ||
        "55385000"
    )
        .replace(
            /\D/g,
            ""
        );

}


// ==========================================
// LOG
// ==========================================

console.log("");
console.log("==================================");
console.log("SANTOS CHEFIA - CONFIGURAÇÕES");
console.log("==================================");

console.log(
    "Supabase:",
    supabaseConfigurado()
        ?
        "CARREGADO"
        :
        "NÃO CONFIGURADO"
);

console.log(
    "Asaas:",
    process.env.ASAAS_API_KEY
        ?
        "CARREGADO"
        :
        "NÃO CONFIGURADO"
);

console.log(
    "Melhor Envio:",
    process.env.MELHOR_ENVIO_TOKEN
        ?
        "CARREGADO"
        :
        "NÃO CONFIGURADO"
);

console.log(
    "CEP origem:",
    pegarCepOrigem()
);

console.log(
    "Serviços:",
    SERVICOS_MELHOR_ENVIO
);

console.log("==================================");
console.log("");


// ==========================================
// ASAAS
// ==========================================

const asaas = axios.create({

    baseURL:
        "https://api-sandbox.asaas.com/v3",

    headers: {

        "Content-Type":
            "application/json",

        access_token:
            process.env.ASAAS_API_KEY

    }

});


// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get(
    "/",
    function (
        req,
        res
    ) {

        res.json({

            sucesso: true,

            mensagem:
                "Servidor Santos Chefia funcionando.",

            ambiente: {

                asaas:
                    "sandbox",

                melhorEnvio:
                    "sandbox",

                supabase:
                    supabaseConfigurado()
                        ?
                        "conectado"
                        :
                        "não configurado"

            }

        });

    }
);


// ==========================================
// TESTAR ENV
// ==========================================

app.get(
    "/teste-env",
    function (
        req,
        res
    ) {

        res.json({

            sucesso: true,

            asaas:
                Boolean(
                    process.env.ASAAS_API_KEY
                ),

            melhorEnvio:
                Boolean(
                    process.env.MELHOR_ENVIO_TOKEN
                ),

            supabase: {

                url:
                    Boolean(
                        process.env.SUPABASE_URL
                    ),

                serviceRole:
                    Boolean(
                        process.env
                            .SUPABASE_SERVICE_ROLE_KEY
                    )

            }

        });

    }
);


// ==========================================
// TESTAR SUPABASE
// ==========================================

app.get(
    "/teste-supabase",
    async function (
        req,
        res
    ) {

        try {

            if (
                !supabaseConfigurado()
            ) {

                return res
                    .status(500)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Supabase não configurado."

                    });

            }


            const resposta =
                await supabase.get(
                    "/produtos?select=id&limit=1"
                );


            res.json({

                sucesso: true,

                mensagem:
                    "Supabase conectado com sucesso.",

                registros:
                    Array.isArray(
                        resposta.data
                    )
                        ?
                        resposta.data.length
                        :
                        0

            });

        }

        catch (erro) {

            console.error(
                "Erro Supabase:",
                erro.response?.data
                ||
                erro.message
            );


            res
                .status(
                    erro.response?.status
                    ||
                    500
                )
                .json({

                    sucesso: false,

                    mensagem:
                        "Erro ao conectar com Supabase.",

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// PRODUTOS
// LISTAR
// ==========================================

app.get(
    "/produtos",
    async function (
        req,
        res
    ) {

        try {

            if (
                !supabaseConfigurado()
            ) {

                return res
                    .status(500)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Supabase não configurado."

                    });

            }


            const resposta =
                await supabase.get(

                    "/produtos?select=*&order=created_at.desc"

                );


            const produtos =
                Array.isArray(
                    resposta.data
                )
                    ?
                    resposta.data.map(
                        normalizarProdutoBanco
                    )
                    :
                    [];


            res.json({

                sucesso: true,

                produtos:
                    produtos

            });

        }

        catch (erro) {

            console.error(
                "Erro ao listar produtos:",
                erro.response?.data
                ||
                erro.message
            );


            res
                .status(
                    erro.response?.status
                    ||
                    500
                )
                .json({

                    sucesso: false,

                    mensagem:
                        "Não foi possível carregar os produtos.",

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// PRODUTOS
// BUSCAR UM
// ==========================================

app.get(
    "/produtos/:id",
    async function (
        req,
        res
    ) {

        try {

            const id =
                String(
                    req.params.id
                );


            const resposta =
                await supabase.get(

                    `/produtos?id=eq.${encodeURIComponent(id)}&select=*`

                );


            const produto =
                Array.isArray(
                    resposta.data
                )
                    ?
                    resposta.data[0]
                    :
                    null;


            if (!produto) {

                return res
                    .status(404)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Produto não encontrado."

                    });

            }


            res.json({

                sucesso: true,

                produto:
                    normalizarProdutoBanco(
                        produto
                    )

            });

        }

        catch (erro) {

            res
                .status(500)
                .json({

                    sucesso: false,

                    mensagem:
                        "Erro ao buscar produto.",

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// PRODUTOS
// CADASTRAR
// ==========================================

app.post(
    "/produtos",
    async function (
        req,
        res
    ) {

        try {

            const validacao =
                validarProduto(
                    req.body
                );


            if (
                !validacao.valido
            ) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            validacao.mensagem

                    });

            }


            const produtoBanco =
                prepararProdutoBanco(
                    req.body
                );


            const resposta =
                await supabase.post(

                    "/produtos",

                    produtoBanco,

                    {

                        headers: {

                            Prefer:
                                "return=representation"

                        }

                    }

                );


            const produto =
                Array.isArray(
                    resposta.data
                )
                    ?
                    resposta.data[0]
                    :
                    resposta.data;


            res
                .status(201)
                .json({

                    sucesso: true,

                    mensagem:
                        "Produto cadastrado com sucesso.",

                    produto:
                        normalizarProdutoBanco(
                            produto
                        )

                });

        }

        catch (erro) {

            console.error(
                "Erro ao cadastrar produto:",
                erro.response?.data
                ||
                erro.message
            );


            res
                .status(
                    erro.response?.status
                    ||
                    500
                )
                .json({

                    sucesso: false,

                    mensagem:
                        "Não foi possível cadastrar o produto.",

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// PRODUTOS
// ATUALIZAR
// ==========================================

app.put(
    "/produtos/:id",
    async function (
        req,
        res
    ) {

        try {

            const id =
                String(
                    req.params.id
                );


            const validacao =
                validarProduto(
                    req.body
                );


            if (
                !validacao.valido
            ) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            validacao.mensagem

                    });

            }


            const produtoBanco =
                prepararProdutoBanco(
                    req.body,
                    id
                );


            /*
               O ID NÃO PRECISA SER ALTERADO
               DURANTE O UPDATE.
            */

            delete produtoBanco.id;


            const resposta =
                await supabase.patch(

                    `/produtos?id=eq.${encodeURIComponent(id)}`,

                    produtoBanco,

                    {

                        headers: {

                            Prefer:
                                "return=representation"

                        }

                    }

                );


            const produto =
                Array.isArray(
                    resposta.data
                )
                    ?
                    resposta.data[0]
                    :
                    resposta.data;


            if (!produto) {

                return res
                    .status(404)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Produto não encontrado."

                    });

            }


            res.json({

                sucesso: true,

                mensagem:
                    "Produto atualizado com sucesso.",

                produto:
                    normalizarProdutoBanco(
                        produto
                    )

            });

        }

        catch (erro) {

            console.error(
                "Erro ao atualizar produto:",
                erro.response?.data
                ||
                erro.message
            );


            res
                .status(
                    erro.response?.status
                    ||
                    500
                )
                .json({

                    sucesso: false,

                    mensagem:
                        "Não foi possível atualizar o produto.",

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// PRODUTOS
// EXCLUIR
// ==========================================

app.delete(
    "/produtos/:id",
    async function (
        req,
        res
    ) {

        try {

            const id =
                String(
                    req.params.id
                );


            const resposta =
                await supabase.delete(

                    `/produtos?id=eq.${encodeURIComponent(id)}`,

                    {

                        headers: {

                            Prefer:
                                "return=representation"

                        }

                    }

                );


            const excluidos =
                Array.isArray(
                    resposta.data
                )
                    ?
                    resposta.data
                    :
                    [];


            if (
                excluidos.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Produto não encontrado."

                    });

            }


            res.json({

                sucesso: true,

                mensagem:
                    "Produto excluído com sucesso."

            });

        }

        catch (erro) {

            console.error(
                "Erro ao excluir produto:",
                erro.response?.data
                ||
                erro.message
            );


            res
                .status(
                    erro.response?.status
                    ||
                    500
                )
                .json({

                    sucesso: false,

                    mensagem:
                        "Não foi possível excluir o produto.",

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// TESTAR ASAAS
// ==========================================

app.get(
    "/teste-asaas",
    async function (
        req,
        res
    ) {

        try {

            const resposta =
                await asaas.get(
                    "/customers?limit=1"
                );


            res.json({

                sucesso: true,

                mensagem:
                    "Conexão com Asaas funcionando.",

                dados:
                    resposta.data

            });

        }

        catch (erro) {

            console.error(
                "Erro no teste Asaas:",
                erro.response?.data
                ||
                erro.message
            );


            res
                .status(500)
                .json({

                    sucesso: false,

                    mensagem:
                        "Erro ao conectar com Asaas.",

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// STATUS ASAAS
// ==========================================

app.get(
    "/status-conta",
    async function (
        req,
        res
    ) {

        try {

            const resposta =
                await asaas.get(
                    "/myAccount/status"
                );


            res.json({

                sucesso: true,

                status:
                    resposta.data

            });

        }

        catch (erro) {

            res
                .status(500)
                .json({

                    sucesso: false,

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// DATA DE VENCIMENTO
// ==========================================

function gerarDataVencimento() {

    const hoje =
        new Date();


    hoje.setDate(
        hoje.getDate() + 1
    );


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    const dia =
        String(
            hoje.getDate()
        )
            .padStart(
                2,
                "0"
            );


    return (
        `${ano}-${mes}-${dia}`
    );

}


// ==========================================
// CRIAR PIX
// ==========================================

app.post(
    "/criar-pix",
    async function (
        req,
        res
    ) {

        try {

            const {

                nome,
                cpf,
                email,
                whatsapp,
                valor

            } = req.body;


            const cpfLimpo =
                String(
                    cpf || ""
                )
                    .replace(
                        /\D/g,
                        ""
                    );


            const whatsappLimpo =
                String(
                    whatsapp || ""
                )
                    .replace(
                        /\D/g,
                        ""
                    );


            const valorNumerico =
                Number(
                    valor
                );


            if (!nome) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Nome não informado."

                    });

            }


            if (
                cpfLimpo.length !== 11
            ) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "CPF inválido."

                    });

            }


            if (!email) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "E-mail não informado."

                    });

            }


            if (
                !valorNumerico
                ||
                valorNumerico <= 0
            ) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Valor inválido."

                    });

            }


            const clienteResposta =
                await asaas.post(

                    "/customers",

                    {

                        name:
                            nome,

                        cpfCnpj:
                            cpfLimpo,

                        email:
                            email,

                        mobilePhone:
                            whatsappLimpo

                    }

                );


            const cliente =
                clienteResposta.data;


            const pagamentoResposta =
                await asaas.post(

                    "/payments",

                    {

                        customer:
                            cliente.id,

                        billingType:
                            "PIX",

                        value:
                            Number(
                                valorNumerico
                                    .toFixed(2)
                            ),

                        dueDate:
                            gerarDataVencimento(),

                        description:
                            "Pedido Santos Chefia"

                    }

                );


            const pagamento =
                pagamentoResposta.data;


            const qrCodeResposta =
                await asaas.get(

                    `/payments/${pagamento.id}/pixQrCode`

                );


            const pix =
                qrCodeResposta.data;


            res.json({

                sucesso: true,

                cliente: {

                    id:
                        cliente.id

                },

                pagamento: {

                    id:
                        pagamento.id,

                    status:
                        pagamento.status,

                    valor:
                        pagamento.value,

                    vencimento:
                        pagamento.dueDate

                },

                pix: {

                    qrCode:
                        pix.encodedImage,

                    copiaECola:
                        pix.payload,

                    expiracao:
                        pix.expirationDate

                }

            });

        }

        catch (erro) {

            const detalhes =
                erro.response?.data
                ||
                erro.message;


            console.error(
                "Erro ao criar Pix:",
                detalhes
            );


            res
                .status(500)
                .json({

                    sucesso: false,

                    mensagem:
                        "Não foi possível criar o Pix.",

                    erro:
                        detalhes

                });

        }

    }
);


// ==========================================
// CRIAR PAGAMENTO
// ==========================================

app.post(
    "/criar-pagamento",
    async function (
        req,
        res
    ) {

        try {

            const {

                nome,
                cpf,
                email,
                whatsapp,
                valor,
                formaPagamento

            } = req.body;


            const cpfLimpo =
                String(
                    cpf || ""
                )
                    .replace(
                        /\D/g,
                        ""
                    );


            if (
                cpfLimpo.length !== 11
            ) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "CPF inválido."

                    });

            }


            let billingType;


            if (
                formaPagamento ===
                "pix"
            ) {

                billingType =
                    "PIX";

            }

            else if (
                formaPagamento ===
                "credito"
            ) {

                billingType =
                    "CREDIT_CARD";

            }

            else {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Forma de pagamento não suportada."

                    });

            }


            const clienteResposta =
                await asaas.post(

                    "/customers",

                    {

                        name:
                            nome,

                        cpfCnpj:
                            cpfLimpo,

                        email:
                            email,

                        mobilePhone:
                            String(
                                whatsapp || ""
                            )
                                .replace(
                                    /\D/g,
                                    ""
                                )

                    }

                );


            const cliente =
                clienteResposta.data;


            const pagamentoResposta =
                await asaas.post(

                    "/payments",

                    {

                        customer:
                            cliente.id,

                        billingType:
                            billingType,

                        value:
                            Number(
                                valor
                            ),

                        dueDate:
                            gerarDataVencimento(),

                        description:
                            "Pedido Santos Chefia"

                    }

                );


            res.json({

                sucesso: true,

                pagamento:
                    pagamentoResposta.data

            });

        }

        catch (erro) {

            res
                .status(500)
                .json({

                    sucesso: false,

                    mensagem:
                        "Não foi possível criar o pagamento.",

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// VERIFICAR MELHOR ENVIO
// ==========================================

function verificarMelhorEnvio() {

    const faltando =
        [];


    const variaveis = [

        "MELHOR_ENVIO_CLIENT_ID",
        "MELHOR_ENVIO_CLIENT_SECRET",
        "MELHOR_ENVIO_REDIRECT_URI",
        "MELHOR_ENVIO_EMAIL",
        "CEP_ORIGEM"

    ];


    variaveis.forEach(
        function (
            variavel
        ) {

            if (
                !process.env[variavel]
            ) {

                faltando.push(
                    variavel
                );

            }

        }
    );


    return faltando;

}


// ==========================================
// SALVAR NO .ENV
// ==========================================

function salvarNoEnv(
    chave,
    valor
) {

    let conteudo =
        "";


    if (
        fs.existsSync(
            caminhoEnv
        )
    ) {

        conteudo =
            fs.readFileSync(
                caminhoEnv,
                "utf8"
            );

    }


    const valorSeguro =
        String(
            valor
        )
            .replace(
                /\r/g,
                ""
            )
            .replace(
                /\n/g,
                ""
            );


    const novaLinha =
        `${chave}=${valorSeguro}`;


    const regex =
        new RegExp(
            `^${chave}=.*$`,
            "m"
        );


    if (
        regex.test(
            conteudo
        )
    ) {

        conteudo =
            conteudo.replace(
                regex,
                novaLinha
            );

    }

    else {

        if (
            conteudo
            &&
            !conteudo.endsWith(
                "\n"
            )
        ) {

            conteudo +=
                "\n";

        }


        conteudo +=
            `${novaLinha}\n`;

    }


    fs.writeFileSync(
        caminhoEnv,
        conteudo,
        "utf8"
    );


    process.env[chave] =
        valorSeguro;

}


// ==========================================
// EXTRAIR CODE
// ==========================================

function extrairCode(
    valor
) {

    let code =
        String(
            valor || ""
        )
            .trim();


    if (
        code.includes(
            "?code="
        )
    ) {

        try {

            const url =
                new URL(
                    code
                );


            const codeUrl =
                url.searchParams.get(
                    "code"
                );


            if (codeUrl) {

                code =
                    codeUrl;

            }

        }

        catch (erro) {

            const depoisCode =
                code.split(
                    "?code="
                )[1];


            if (
                depoisCode
            ) {

                code =
                    depoisCode
                        .split(
                            "&"
                        )[0];

            }

        }

    }


    return code;

}


// ==========================================
// AUTORIZAR MELHOR ENVIO
// ==========================================

app.get(
    "/melhor-envio/autorizar",
    function (
        req,
        res
    ) {

        const faltando =
            verificarMelhorEnvio();


        if (
            faltando.length > 0
        ) {

            return res
                .status(500)
                .send(`

                    <body
                        style="
                            background:#080808;
                            color:white;
                            font-family:Arial;
                            padding:40px;
                        "
                    >

                        <h1>
                            Configuração incompleta
                        </h1>

                        <pre>
${faltando.join("\n")}
                        </pre>

                    </body>

                `);

        }


        res.send(`

            <!DOCTYPE html>

            <html lang="pt-BR">

            <head>

                <meta charset="UTF-8">

                <title>
                    Melhor Envio
                </title>

            </head>

            <body
                style="
                    background:#080808;
                    color:white;
                    font-family:Arial;
                    padding:50px;
                "
            >

                <h1>
                    Melhor Envio
                </h1>

                <form
                    action="/melhor-envio/token"
                    method="POST"
                >

                    <textarea
                        name="code"
                        required
                        style="
                            width:100%;
                            max-width:600px;
                            height:130px;
                        "
                    ></textarea>

                    <br><br>

                    <button
                        type="submit"
                    >
                        GERAR TOKEN
                    </button>

                </form>

            </body>

            </html>

        `);

    }
);


// ==========================================
// GERAR TOKEN MELHOR ENVIO
// ==========================================

app.post(
    "/melhor-envio/token",
    async function (
        req,
        res
    ) {

        try {

            const code =
                extrairCode(
                    req.body.code
                );


            if (!code) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Code não informado."

                    });

            }


            const dados =
                new URLSearchParams();


            dados.append(
                "grant_type",
                "authorization_code"
            );

            dados.append(
                "client_id",
                process.env
                    .MELHOR_ENVIO_CLIENT_ID
            );

            dados.append(
                "client_secret",
                process.env
                    .MELHOR_ENVIO_CLIENT_SECRET
            );

            dados.append(
                "redirect_uri",
                process.env
                    .MELHOR_ENVIO_REDIRECT_URI
            );

            dados.append(
                "code",
                code
            );


            const resposta =
                await axios.post(

                    `${MELHOR_ENVIO_BASE_URL}/oauth/token`,

                    dados.toString(),

                    {

                        headers: {

                            "Accept":
                                "application/json",

                            "Content-Type":
                                "application/x-www-form-urlencoded",

                            "User-Agent":
                                pegarUserAgentMelhorEnvio()

                        }

                    }

                );


            salvarNoEnv(
                "MELHOR_ENVIO_TOKEN",
                resposta.data.access_token
            );


            if (
                resposta.data.refresh_token
            ) {

                salvarNoEnv(
                    "MELHOR_ENVIO_REFRESH_TOKEN",
                    resposta.data.refresh_token
                );

            }


            res.send(`

                <body
                    style="
                        background:#080808;
                        color:white;
                        font-family:Arial;
                        text-align:center;
                        padding:80px;
                    "
                >

                    <h1>
                        ✓ Melhor Envio autorizado
                    </h1>

                </body>

            `);

        }

        catch (erro) {

            res
                .status(500)
                .json({

                    sucesso: false,

                    mensagem:
                        "Não foi possível gerar o token.",

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// RENOVAR TOKEN
// ==========================================

app.post(
    "/melhor-envio/renovar-token",
    async function (
        req,
        res
    ) {

        try {

            const refreshToken =
                process.env
                    .MELHOR_ENVIO_REFRESH_TOKEN;


            if (!refreshToken) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Refresh token não encontrado."

                    });

            }


            const dados =
                new URLSearchParams();


            dados.append(
                "grant_type",
                "refresh_token"
            );

            dados.append(
                "client_id",
                process.env
                    .MELHOR_ENVIO_CLIENT_ID
            );

            dados.append(
                "client_secret",
                process.env
                    .MELHOR_ENVIO_CLIENT_SECRET
            );

            dados.append(
                "refresh_token",
                refreshToken
            );


            const resposta =
                await axios.post(

                    `${MELHOR_ENVIO_BASE_URL}/oauth/token`,

                    dados.toString(),

                    {

                        headers: {

                            "Accept":
                                "application/json",

                            "Content-Type":
                                "application/x-www-form-urlencoded",

                            "User-Agent":
                                pegarUserAgentMelhorEnvio()

                        }

                    }

                );


            if (
                resposta.data.access_token
            ) {

                salvarNoEnv(
                    "MELHOR_ENVIO_TOKEN",
                    resposta.data.access_token
                );

            }


            if (
                resposta.data.refresh_token
            ) {

                salvarNoEnv(
                    "MELHOR_ENVIO_REFRESH_TOKEN",
                    resposta.data.refresh_token
                );

            }


            res.json({

                sucesso: true,

                mensagem:
                    "Token renovado."

            });

        }

        catch (erro) {

            res
                .status(500)
                .json({

                    sucesso: false,

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// LISTAR SERVIÇOS
// ==========================================

app.get(
    "/melhor-envio/servicos",
    async function (
        req,
        res
    ) {

        try {

            const token =
                process.env
                    .MELHOR_ENVIO_TOKEN;


            const resposta =
                await axios.get(

                    `${MELHOR_ENVIO_BASE_URL}/api/v2/me/shipment/services`,

                    {

                        headers: {

                            "Authorization":
                                `Bearer ${token}`,

                            "Accept":
                                "application/json",

                            "User-Agent":
                                pegarUserAgentMelhorEnvio()

                        },

                        validateStatus:
                            () => true

                    }

                );


            res
                .status(
                    resposta.status
                )
                .json({

                    sucesso:
                        resposta.status >= 200
                        &&
                        resposta.status < 300,

                    status:
                        resposta.status,

                    servicos:
                        resposta.data

                });

        }

        catch (erro) {

            res
                .status(500)
                .json({

                    sucesso: false,

                    erro:
                        erro.response?.data
                        ||
                        erro.message

                });

        }

    }
);


// ==========================================
// CALCULAR FRETE
// ==========================================

app.post(
    "/melhor-envio/cotar",
    async function (
        req,
        res
    ) {

        try {

            const token =
                process.env
                    .MELHOR_ENVIO_TOKEN;


            if (!token) {

                return res
                    .status(401)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Melhor Envio ainda não autorizado."

                    });

            }


            const cepDestino =
                String(
                    req.body.cep || ""
                )
                    .replace(
                        /\D/g,
                        ""
                    );


            if (
                cepDestino.length !== 8
            ) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "CEP inválido."

                    });

            }


            const produtosRecebidos =
                Array.isArray(
                    req.body.produtos
                )
                    ?
                    req.body.produtos
                    :
                    [];


            if (
                produtosRecebidos.length === 0
            ) {

                return res
                    .status(400)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Nenhum produto informado."

                    });

            }


            const produtos =
                produtosRecebidos.map(
                    function (
                        produto,
                        index
                    ) {

                        const dadosFrete =
                            produto.frete
                            ||
                            {};


                        return {

                            id:
                                String(
                                    produto.id
                                    ||
                                    index + 1
                                ),

                            width:
                                Number(
                                    dadosFrete.largura
                                    ||
                                    produto.largura
                                    ||
                                    20
                                ),

                            height:
                                Number(
                                    dadosFrete.altura
                                    ||
                                    produto.altura
                                    ||
                                    10
                                ),

                            length:
                                Number(
                                    dadosFrete.comprimento
                                    ||
                                    produto.comprimento
                                    ||
                                    30
                                ),

                            weight:
                                Number(
                                    dadosFrete.peso
                                    ||
                                    produto.peso
                                    ||
                                    0.5
                                ),

                            insurance_value:
                                Number(
                                    Number(
                                        produto.preco
                                        ||
                                        0
                                    )
                                        .toFixed(2)
                                ),

                            quantity:
                                Math.max(
                                    1,
                                    Number(
                                        produto.quantidade
                                        ||
                                        1
                                    )
                                )

                        };

                    }
                );


            const payload = {

                from: {

                    postal_code:
                        pegarCepOrigem()

                },

                to: {

                    postal_code:
                        cepDestino

                },

                products:
                    produtos,

                services:
                    SERVICOS_MELHOR_ENVIO,

                options: {

                    receipt:
                        false,

                    own_hand:
                        false,

                    collect:
                        false

                }

            };


            const resposta =
                await axios.post(

                    `${MELHOR_ENVIO_BASE_URL}/api/v2/me/shipment/calculate`,

                    payload,

                    {

                        headers: {

                            "Authorization":
                                `Bearer ${token}`,

                            "Accept":
                                "application/json",

                            "Content-Type":
                                "application/json",

                            "User-Agent":
                                pegarUserAgentMelhorEnvio()

                        },

                        validateStatus:
                            () => true

                    }

                );


            if (
                resposta.status < 200
                ||
                resposta.status >= 300
            ) {

                return res
                    .status(
                        resposta.status
                    )
                    .json({

                        sucesso: false,

                        mensagem:
                            "O Melhor Envio recusou a cotação.",

                        detalhes:
                            resposta.data

                    });

            }


            const dados =
                Array.isArray(
                    resposta.data
                )
                    ?
                    resposta.data
                    :
                    [];


            const cotacoes =
                dados
                    .filter(
                        function (
                            item
                        ) {

                            return (
                                !item.error
                                &&
                                item.price
                            );

                        }
                    )
                    .map(
                        function (
                            item
                        ) {

                            return {

                                id:
                                    item.id,

                                servico:
                                    item.name || "",

                                transportadora:
                                    item.company?.name
                                    ||
                                    "",

                                preco:
                                    Number(
                                        item.price
                                    ),

                                prazo:
                                    item.delivery_time
                                    ||
                                    null,

                                prazoMinimo:
                                    item.delivery_range?.min
                                    ||
                                    null,

                                prazoMaximo:
                                    item.delivery_range?.max
                                    ||
                                    null,

                                logo:
                                    item.company?.picture
                                    ||
                                    ""

                            };

                        }
                    );


            if (
                cotacoes.length === 0
            ) {

                return res
                    .status(422)
                    .json({

                        sucesso: false,

                        mensagem:
                            "Nenhuma opção de frete disponível.",

                        detalhes:
                            dados

                    });

            }


            res.json({

                sucesso: true,

                origem:
                    pegarCepOrigem(),

                destino:
                    cepDestino,

                cotacoes:
                    cotacoes

            });

        }

        catch (erro) {

            const detalhes =
                erro.response?.data
                ||
                erro.message;


            console.error(
                "ERRO FRETE:",
                detalhes
            );


            res
                .status(500)
                .json({

                    sucesso: false,

                    mensagem:
                        "Não foi possível calcular o frete.",

                    erro:
                        detalhes

                });

        }

    }
);


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(
    PORT,
    function () {

        console.log("");
        console.log("==================================");
        console.log("SANTOS CHEFIA - SERVIDOR");
        console.log("==================================");

        console.log(
            `Servidor: http://localhost:${PORT}`
        );

        console.log(
            "Supabase:",
            supabaseConfigurado()
                ?
                "CONECTADO"
                :
                "NÃO CONFIGURADO"
        );

        console.log(
            "Asaas: SANDBOX"
        );

        console.log(
            "Melhor Envio: SANDBOX"
        );

        console.log(
            "Serviços: PAC, SEDEX, Jadlog .Package, Jadlog .Com"
        );

        console.log("==================================");
        console.log("");

    }
);