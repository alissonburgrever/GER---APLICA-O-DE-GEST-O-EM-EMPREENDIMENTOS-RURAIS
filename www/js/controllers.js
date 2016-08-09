angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  var gerarNoZero = function() { return { ano: 1, receita: null, custo: null, investimento: 10000 } };
    $scope.dados = [];
    $scope.dados[0] = gerarNoZero();
    $scope.taxasDeDesconto = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    $scope.numeroDeAnos = '1';

    $scope.alterarNumeroDeAnos = function(numeroDeAnos) {
      $scope.dados = [];
      //$scope.dados[0] = gerarNoZero();

      for (var i = 0; i < numeroDeAnos; i++)
        $scope.dados.push({ ano: $scope.dados.length, ano: i+1, receita: 15000, custo: 9000, investimento: null });
    }

    /*$scope.calcularSomaDaReceita = function() {
      var soma = 0;
      for (var i = 0; i < $scope.dados.length; i++) {
        soma += $scope.dados[i].receita;
      }
      return soma;
    }

    $scope.calcularSomaDoCusto = function() {
      var soma = 0;
      for (var i = 0; i < $scope.dados.length; i++) {
        soma += $scope.dados[i].custo;
      }
      return soma;
    }

    $scope.calcularSomaDoFluxoDeCaixa = function() {
      var soma = 0;
      for (var i = 0; i < $scope.dados.length; i++) {
        soma += $scope.dados[i].receita - $scope.dados[i].custo;
      }
      return soma;
    }*/

    $scope.calcularSomaDaPorcentagem = function(porcentagem) {
      var soma = 0;
      for (var i = 0; i < $scope.dados.length; i++) {
        var fluxoDeCaixa = $scope.dados[i].receita - $scope.dados[i].custo;
        var fator = Math.pow(porcentagem, $scope.dados[i].ano);
        soma += fluxoDeCaixa / fator;
      }
      return soma;
    }

    $scope.calcularTaxaDeDesconto = function(linha, taxaIndex) {
      var fluxoDeCaixa = linha.receita - linha.custo;
      var inicial = 1 + ($scope.taxasDeDesconto[taxaIndex] / 100);
      var fator = Math.pow(inicial, linha.ano);
      //($scope.taxasDeDesconto[1] / 100) + 1;
      return fluxoDeCaixa / fator;
    }

    $scope.calcularVPL = function(porcentagem) {
      var total = 0;
      var investimento = $scope.dados[0].investimento;
      for (var i = 0; i < $scope.dados.length; i++) {
        var fluxoDeCaixa = $scope.dados[i].receita - $scope.dados[i].custo;
        var fator = Math.pow(porcentagem, $scope.dados[i].ano);
        total += (fluxoDeCaixa / fator);
      }
      return total  - investimento;
      

    }

    $scope.calcularIL = function(porcentagem) {
      var total = 0;
      var investimento = $scope.dados[0].investimento;
      for (var i = 0; i < $scope.dados.length; i++) {
        var fluxoDeCaixa = $scope.dados[i].receita - $scope.dados[i].custo;
        var fator = Math.pow(porcentagem, $scope.dados[i].ano);
        total += (fluxoDeCaixa / fator);
      }
      return total  / investimento;
    }


    //MFUNÇÃO VPL PARA TESTE
    function calcularVPLTeste(taxa, montantes) {
      var ret = montantes[0];

      for (var i=1; i<montantes.length; i++)
        ret += montantes[i] / Math.pow( (1.0 + taxa), i);
      return ret;
    }




    // FUNÇÃO TIR PARA TESTE
    function calcularTIR(montantes) {
      var ret = -1000000000.0;
      var juros_inicial = -1.0;
      var juros_medio = 0.0;
      var juros_final = 1.0;
      var vpl_inicial = 0.0;
      var vpl_final = 0.0;
      var vf = 0.0;
      var erro = 1e-5;

      for (var i=0; i<100; i++) {
        vpl_inicial = calcularVPLTeste(juros_inicial, montantes);
        vpl_final = calcularVPLTeste(juros_final, montantes);
        if (sinal(vpl_inicial) != sinal(vpl_final))
            break;
        juros_inicial -= 1.0;
        juros_final += 1.0;
      };

      var count = 0;

      for (;;) {
        // Busca por Bisseção
        var juros_medio = (juros_inicial + juros_final) / 2.0;
        var vpl_medio = calcularVPLTeste(juros_medio, montantes)

        if (Math.abs(vpl_medio) <= erro) {
            // Resultado foi encontrado
            return juros_medio*100.0;
        };
        if (sinal(vpl_inicial) == sinal(vpl_medio)) {
            juros_inicial = juros_medio;
            vpl_inicial = calcularVPLTeste(juros_medio, montantes);
        } else {
            juros_final = juros_medio;
            vpl_final = calcularVPLTeste(juros_medio, montantes);
        };
        if (++count > 10000)
            return null;
            //throw "looping inválido";
      };
      return ret;

    }

    // FUNÇÃO DE TESTE PARA CALCULAR A TIR
    /*$scope.calcula = function() {
      var taxa_campo = document.getElementById('desc');
      var montantes_campo = document.getElementById('mont');
      var result_vpl_campo = document.getElementById('result_vpl');
      var result_tir_campo = document.getElementById('result_tir');
      var taxa = 0.0;
      var montantes = [];
      var sinal_inicio = 0;

      if (taxa_campo.value == "") {
          alert("Taxa não pode ser nula.");
          return;
      };
      taxa = parseFloat(taxa_campo.value);

      if (montantes_campo.value == "") {
          alert("Montantes não pode ser nulo.");
          return;
      };
      montantes = montantes_campo.value.split(',').map(parseFloat);
      if (montantes.length < 2) {
          alert("Número insuficientes de montantes.");
          return;
      };
      // Chama as funções para cálculos
      document.getElementById('result_vpl').value = calcularVPLTeste(taxa, montantes).toFixed(2);
      document.getElementById('result_tir').value = calcularTIRTeste(montantes).toFixed(6);
    }*/

    // FUNÇÃO QUE FAZ PARTE BDAS FUNÇÕES DE TESTE
    function sinal(x) {
      return x < 0.0 ? -1 : 1;
    }


    $scope.calcularTIR = function() {
      var montantes = [];

      var investimento = -$scope.dados[0].investimento;

      
      montantes.push(investimento);

      for (var i = 0; i < $scope.dados.length; i++) {
        var fluxoDeCaixa = $scope.dados[i].receita - $scope.dados[i].custo;
        montantes.push(fluxoDeCaixa);
      }

      return calcularTIR(montantes);
  

    }


    $scope.calcularR25 = function() {
      var somaTotal = 0;
      var somaCusto = 0;
      var somaReceita = 0;
      var investimento = $scope.dados[0].investimento;
      for (var i = 0; i < $scope.dados.length; i++) {
        somaCusto += $scope.dados[i].custo;
        somaReceita += $scope.dados[i].receita;
      }
      somaTotal = somaCusto + investimento;
      
      return somaReceita / somaTotal;
    }
})

.controller('ChatsCtrl', function($scope, Chats) {
   $scope.calcularTaxaDeDesconto = function(linha, taxaIndex) {
      var fluxoDeCaixa = linha.receita - linha.custo;
      var inicial = 1 + ($scope.taxasDeDesconto[taxaIndex] / 100);
      var fator = Math.pow(inicial, linha.ano);
      //($scope.taxasDeDesconto[1] / 100) + 1;
      return fluxoDeCaixa / fator;
    }
  //$scope.$on('$ionicView.enter', function(e) {
  //});

/*
  FUNCOES DON ARUQUIVO CHAT-DETAIL.HTML
*/

/*$scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };*/
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

function calc(){
  if(document.getElementById('popup').style.display == 'block')
    document.getElementById('popup').style.display = 'none';
  else
    document.getElementById('popup').style.display = 'block';
}
