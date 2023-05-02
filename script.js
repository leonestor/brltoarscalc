const valorBRLInput = document.getElementById("valor-brl");
const resultadoDiv = document.getElementById("resultado");

async function obterCotacao() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/BRL");
    const data = await response.json();
    return ((data.rates.ARS * 2)*1.003797).toFixed(4);
  } catch (error) {
    throw new Error("Não foi possível obter a cotação do peso argentino. Tente novamente mais tarde.");
  }
}

function calcularCambio() {
  const valorBRL = parseFloat(valorBRLInput.value);

  if (isNaN(valorBRL) || valorBRL <= 0) {
    alert("Digite um valor válido em BRL.");
    return;
  }

  obterCotacao()
    .then(cotacaoARS => {
      const valorRecebidoARS = valorBRL * cotacaoARS;
      let valorTarifa = 0;
        if (valorBRL >= 0 && valorBRL <= 250) {
        valorTarifa = 9.9;
        } else if (valorBRL >= 250.01 && valorBRL <= 600) {
        valorTarifa = 20;
        } else if (valorBRL >= 600.01 && valorBRL <= 1000) {
        valorTarifa = 30;
        } else if (valorBRL >= 1000.01 && valorBRL <= 2000) {
        valorTarifa = 40;
        } else if (valorBRL >= 2000.01 && valorBRL <= 5000) {
        valorTarifa = 50;
        } else if (valorBRL > 5000) {
        valorTarifa = 75;
        }
      const valorIOF = valorBRL * 0.0036;
      const valorTotalPagoBRL = valorBRL + valorTarifa + valorIOF;
      const valorTotalRecebidoARS = valorRecebidoARS.toFixed(2);

      const resultado = `
        Tarifa: BRL ${valorTarifa.toFixed(2)}<br>
        IOF: BRL ${valorIOF.toFixed(2)}<br>
        Total a pagar: BRL ${valorTotalPagoBRL.toFixed(2)}<br><br>
        Total a receber: ARS ${valorTotalRecebidoARS}<br><br>
        Valor da cotação: ARS ${cotacaoARS}<br>
        Valor efetivo da cotação: ARS ${(valorTotalRecebidoARS/valorTotalPagoBRL).toFixed(2)}<br></br>`

      resultadoDiv.innerHTML = resultado;
    })
    .catch(error => {
      alert(error.message);
      console.error(error);
    });
}
