var balance = 0;
var balanceDisplay = document.getElementById("balance");

function updateBalanceDisplay() {
    balanceDisplay.textContent = "R$" + balance.toFixed(2);
}

function deposit() {
    var amountStr = prompt("Faça um Depósito na sua Conta:");
    if (amountStr === null) return; 
    var amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        alert("Por favor, insira um valor numérico válido e positivo.");
        return;
    }
    balance += amount;
    updateBalanceDisplay();
}

function withdraw() {
    var amountStr = prompt("Quanto quer retirar da sua Conta:");
    if (amountStr === null) return; // Usuário cancelou
    var amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        alert("Por favor, insira um valor numérico válido e positivo.");
        return;
    }
    if (amount > balance) {
        alert("Saldo insuficiente.");
        return;
    }
    balance -= amount;
    updateBalanceDisplay();
}

function checkBalance() {
    alert("Seu saldo atual é: R$" + balance.toFixed(2));
}

function processTransaction() {
    var type = document.getElementById("transactionType").value;

    switch (type) {
        case "deposit":
            deposit();
            break;
        case "withdraw":
            withdraw();
            break;
        case "checkBalance":
            checkBalance();
            break;
        default:
            alert("Serviço não reconhecido.");
    }
}

// Inicializa a exibição do saldo
updateBalanceDisplay();
