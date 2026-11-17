// ==========================
// VARIÁVEIS GLOBAIS
// ==========================

// Referências aos elementos do DOM (serão atribuídas após o carregamento da página)
let productList;
let cartList;
let totalEl;

// Elementos do mini carrinho
let cartCount;
let miniList;
let miniTotal;

let btnFinalizar;
let mensagemCompra;
let abaPagamento;
let btnConfirmarPagamento;
let btnCancelarPagamento;

// Array que representa o estado atual do carrinho
let carrinho = [];


// ==========================
// DADOS DOS PRODUTOS
// ==========================

// Lista de produtos simulando um "banco de dados" local
const produtos = [
  { id: 1, nome: "Smartphone", preco: 1500, imagem: "" },
  { id: 2, nome: "Camiseta", preco: 80, imagem: "" },
  { id: 3, nome: "Relógio", preco: 250, imagem: "" }
];

const novosProdutos = produtos.push({
    id: 4, nome: "Tênis", preco: 700, imagem: ""
})

// ==========================
// RENDERIZAÇÃO DOS PRODUTOS
// ==========================

// Função responsável por exibir os produtos na tela
function renderizarProdutos() {

  // Limpa o container antes de renderizar novamente
  productList.innerHTML = "";

  // Percorre o array de produtos
  produtos.forEach(produto => {

    // Cria um elemento HTML para o card
    const card = document.createElement("div");
    card.classList.add("product-card");

    // Define o conteúdo do card
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco}</p>
      <button>Adicionar ao carrinho</button>
    `;

    // Adiciona evento ao botão
    card.querySelector("button").addEventListener("click", () => {
      adicionarAoCarrinho(produto.id);
    });

    // Insere o card no DOM
    productList.appendChild(card);
  });
}


// ==========================
// ADICIONAR PRODUTO AO CARRINHO
// ==========================

// Recebe o ID do produto e adiciona ao carrinho
function adicionarAoCarrinho(id) {
    // 1. Verifica se o produto já existe no carrinho
    const itemNoCarrinho = carrinho.find(item => item.id === id);
  
    if (itemNoCarrinho) {
      // 2. Se já existe, apenas incrementa a quantidade
      itemNoCarrinho.quantidade += 1;
    } else {
      // 3. Se não existe, busca nos produtos e adiciona com quantidade: 1
      const produto = produtos.find(p => p.id === id);
      carrinho.push({ ...produto, quantidade: 1 });
    }
  
    // Atualiza sistema
    salvarCarrinho();
  }
  

// ==========================
// RENDERIZAÇÃO DO CARRINHO PRINCIPAL
// ==========================

// Exibe os itens no carrinho principal
function renderizarCarrinho() {
    cartList.innerHTML = "";
    let total = 0;
  
    carrinho.forEach((item, index) => {
      // Calcula o subtotal deste item
      const subtotal = item.preco * item.quantidade;
      total += subtotal;
  
      const li = document.createElement("li");
  
      // Exibe no formato "Relógio 2x - R$ 500"
      li.innerHTML = `
        ${item.nome} ${item.quantidade}x - R$ ${subtotal}
        <button>Remover</button>
      `;
  
      li.querySelector("button").addEventListener("click", () => {
        carrinho.splice(index, 1);
        salvarCarrinho();
      });
  
      cartList.appendChild(li);
    });
  
    totalEl.textContent = `Total: R$ ${total}`;
  }
  


// ==========================
// MINI CARRINHO
// ==========================

// Atualiza o mini carrinho (ícone no topo)
function atualizarMiniCarrinho() {

  // Atualiza contador de itens
  cartCount.textContent = carrinho.length;

  // Limpa lista
  miniList.innerHTML = "";

  let total = 0;

  // Percorre itens
  carrinho.forEach(item => {

    total += item.preco;

    // Cria item da lista
    const li = document.createElement("li");
    li.textContent = `${item.nome} R$ ${item.preco}`;

    miniList.appendChild(li);
  });

  // Atualiza total
  miniTotal.textContent = `Total: R$ ${total}`;
}


// ==========================
// FINALIZAR COMPRA
// ==========================

// Simula finalização de compra
function finalizarCompra() {

  // Validação: carrinho vazio
  if (carrinho.length === 0) {
    mensagemCompra.textContent = "Seu carrinho está vazio!";
    mensagemCompra.style.color = "red";
    return;
  }

  // Mensagem de sucesso
  mensagemCompra.textContent = "Compra realizada com sucesso!";
  mensagemCompra.style.color = "green";

  // Limpa carrinho
  carrinho = [];

  salvarCarrinho();
}
// ==========================
// ABRIR ABA DE PAGAMENTO
// ==========================

function abrirPagamento() {
    if (carrinho.length === 0) {
      mensagemCompra.textContent = "Seu carrinho está vazio!";
      mensagemCompra.style.color = "red";
      return;
    }
  
    mensagemCompra.textContent = "";
    abaPagamento.style.display = "block";
  }
  
  function confirmarPagamento() {
    const opcaoSelecionada = document.querySelector('input[name="pagamento"]:checked').value;
  
    mensagemCompra.textContent = `Compra realizada com sucesso via ${opcaoSelecionada}!`;
    mensagemCompra.style.color = "green";
  
    abaPagamento.style.display = "none";
  
    carrinho = [];
    salvarCarrinho();
  }
  

// ==========================
// PERSISTÊNCIA (LOCALSTORAGE)
// ==========================

// Salva o carrinho no navegador e atualiza interface
function salvarCarrinho() {

  // Salva no localStorage
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  // Atualiza telas
  renderizarCarrinho();
  atualizarMiniCarrinho();
}


// ==========================
// INICIALIZAÇÃO DO SISTEMA
// ==========================


document.addEventListener("DOMContentLoaded", () => {
    // Captura elementos do DOM
    productList = document.getElementById("product-list");
    cartList = document.getElementById("cart-list");
    totalEl = document.getElementById("total");
  
    cartCount = document.getElementById("cart-count");
    miniList = document.getElementById("mini-cart-list");
    miniTotal = document.getElementById("mini-total");
  
    // Elementos do checkout e pagamento
    btnFinalizar = document.getElementById("finalizar-compra");
    mensagemCompra = document.getElementById("mensagem-compra");
    abaPagamento = document.getElementById("aba-pagamento");
    btnConfirmarPagamento = document.getElementById("confirmar-pagamento");
    btnCancelarPagamento = document.getElementById("cancelar-pagamento");
  
    // Recupera dados salvos
    carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  
    // Renderização inicial
    renderizarProdutos();
    renderizarCarrinho();
    atualizarMiniCarrinho();

  // Eventos dos botões de compra e pagamento (ATUALIZADO AQUI)
  btnFinalizar.addEventListener("click", abrirPagamento);
  btnConfirmarPagamento.addEventListener("click", confirmarPagamento);
  btnCancelarPagamento.addEventListener("click", () => {
    abaPagamento.style.display = "none";
  });
});