    var balance = 0;

    function updateBalance() {
      document.getElementById("balance").textContent = "R$" + balance.toFixed(2);
    }

    function deposit(amount) {
      balance += amount;
      updateBalance();
      alert(`Depósito de R$${amount.toFixed(2)} realizado com sucesso.`);
    }

    function withdraw(amount) {
      if (amount > balance) {
        alert("Saldo insuficiente para realizar o saque.");
        return;
      }
      balance -= amount;
      updateBalance();
      alert(`Saque de R$${amount.toFixed(2)} realizado com sucesso.`);
    }

    function checkBalance() {
      alert("Seu saldo atual é: R$" + balance.toFixed(2));
    }

    function processTransaction() {
      var type = document.getElementById("transactionType").value;
      var amount = 0;

      switch (type) {
        case "deposit":
          amount = parseFloat(prompt("Insira o valor do depósito:"));
          if (!isNaN(amount)) {
            deposit(amount);
          } else {
            alert("Por favor, insira um valor numérico válido para o depósito.");
          }
          break;
        case "withdraw":
          amount = parseFloat(prompt("Insira o valor do saque:"));
          if (!isNaN(amount)) {
            withdraw(amount);
          } else {
            alert("Por favor, insira um valor numérico válido para o saque.");
          }
          break;
        case "checkBalance":
          checkBalance();
          break;
        default:
          alert("Serviço não reconhecido.");
      }
    }

    // Inicializa o saldo na tela
    updateBalance();