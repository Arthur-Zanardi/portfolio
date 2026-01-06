// 1. Mapear os elementos da interface
const btnConverter = document.getElementById('btnConverter');
const inputQuantia = document.getElementById('quantia');
const selectOrigem = document.getElementById('moedaOrigem');
const selectDestino = document.getElementById('moedaDestino');
const resultadoTexto = document.getElementById('resultadoTexto');
const spinner = document.getElementById('spinner');

// 2. Função principal que consulta a API
async function converter() {
    const valor = inputQuantia.value;
    const moedaOrigem = selectOrigem.value;
    const moedaDestino = selectDestino.value;

    if (valor === "" || valor <= 0) return;

    resultadoTexto.classList.add('hidden'); // Esconde o texto anterior
    spinner.classList.remove('hidden');    // Mostra o spinner

    try {
        const url = `https://economia.awesomeapi.com.br/last/${moedaOrigem}-${moedaDestino}`;

        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Par de moedas não encontrado");

        if (moedaOrigem === moedaDestino) throw new Error("Selecione Moedas diferentes");

        
        const data = await response.json();
        
        // Log para você ver no F12 o que a API mandou:
        console.log("Dados da API:", data);

        // A chave as vezes vem como 'USDBRL' ou 'USDBRLB'
        // Pegamos a primeira chave do objeto para não errar o nome
        const chave = Object.keys(data)[0];
        const cotacao = data[chave].bid;
        
        const resultadoFinal = valor * cotacao;
        await new Promise(resolve => setTimeout(resolve, 200)); // Simula um pequeno delay para deixar mais intuitivo
 
        resultadoTexto.innerText = `${valor} ${moedaOrigem} = ${resultadoFinal.toLocaleString('pt-br', {
            style: 'currency',
            currency: moedaDestino
        })}`;

    } catch (error) {
        console.error("Erro detalhado:", error);
       if (moedaOrigem === moedaDestino) {
        resultadoTexto.innerText = "Selecione moedas diferentes para conversão.";
       } else {
        resultadoTexto.innerText = "Moeda não suportada ou erro de rede.";
    }
    } finally {
        // --- ESTADO FINAL ---
        spinner.classList.add('hidden');       // Esconde o spinner
        resultadoTexto.classList.remove('hidden'); // Mostra o resultado
    }
}

// 3. Adicionar o evento de clique ao botão
btnConverter.addEventListener('click', converter);

// BÔNUS: Permitir que o usuário aperte "Enter" no teclado para converter
inputQuantia.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        converter();
    }
});