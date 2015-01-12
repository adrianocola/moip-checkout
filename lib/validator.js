
var Validator = function(){

    this.errors = [];

}

//### validações do json ###
Validator.prototype.validarJson = function(json) {

    this.errors = [];

    var token = json.pagamentoWidget.token;
    var pagamento = json.pagamentoWidget.dadosPagamento;

    this.validarToken(token);
    this.validarFormaDePagamento(pagamento);
};

Validator.prototype.validarToken = function(token) {

    if(this.naoInformou(token)) {
        this.adicionarErro(914, "Informe o token da Instrução");
    }
};

Validator.prototype.validarFormaDePagamento = function(pagamento) {

    var forma = pagamento.Forma;

    if(this["validar" + forma]) {
        this.adicionarErro(900, "Forma de pagamento inválida");
        return;
    }

    var fn = this["validar" + forma];
    fn(pagamento);
};

//### validações por forma de pagamento ###
Validator.prototype.validarCartaoCredito = function(pagamento) {
    this.validarInstituicao(pagamento.Instituicao);
    this.validarParcelas(pagamento.Parcelas);
    this.validarPagamentoCartao(pagamento);
};

Validator.prototype.validarDebitoBancario = function(pagamento) {
    this.validarInstituicao(pagamento.Instituicao);
};

Validator.prototype.validarBoletoBancario = function(pagamento) {
};

//### validações dos dados de cartão de crédito ###
Validator.prototype.validarPagamentoCartao = function(pagamento) {

    var cartao = pagamento.CartaoCredito;
    var cofre = pagamento.CartaoCredito.Cofre;
    var instituicao = pagamento.Instituicao;

    if (this.naoInformou(cartao)) {
        this.adicionarErro(905, "Informe os dados do cartão de crédito");
    }
    //cofre
    else if (informou(cofre)) {
        this.validarCofre(cartao, instituicao);
        //cartão de crédito
    } else {
        this.validarCartao(cartao, instituicao);
    }
};

Validator.prototype.validarInstituicao = function(instituicao) {

    if (this.naoInformou(instituicao)) {
        this.adicionarErro(901, "Informe a instituição de pagamento");
    }
};

Validator.prototype.validarCofre = function(cartao, instituicao) {

    var cofre = cartao.Cofre;
    var cvv = cartao.CodigoSeguranca;

    if (this.naoInformou(cofre)) {
        this.adicionarErro(913, "Informe o cofre a ser utilizado");
    }

    if (this.naoInformou(cvv)) {
        this.adicionarErro(907, "Informe o código de segurança do cartão");

    } else {
        var qtdCaracteres = String(cvv).length;

        if (isNaN(cvv)) {
            this.adicionarErro(907, "Código de segurança inválido");
        }
        else if (qtdCaracteres < 3 || qtdCaracteres > 4) {
            this.adicionarErro(907, "Código de segurança inválido");
        }
    }
};

Validator.prototype.validarCartao = function(cartao, instituicao) {

    var numero = cartao.Numero;

    if (this.informou(numero)) {
        cartao.Numero = String(numero).replace(/\D/g, "");
    }

    this.validarNumeroDoCartao(cartao, instituicao);
    this.validarCvv(cartao.CodigoSeguranca, instituicao);
    this.validarDataDeExpiracao(cartao.Expiracao);
    this.validarPortador(cartao.Portador);
};

Validator.prototype.validarNumeroDoCartao = function(cartao, instituicao) {

    var numero = cartao.Numero;

    if (this.naoInformou(numero)) {
        this.adicionarErro(905, "Informe o número do cartão");

    } else {
        var qtdCaracteres = String(numero).length;

        if (instituicao == "Visa" && qtdCaracteres != 16) {
            this.adicionarErro(905, "Número de cartão inválido");
        }
        else if (instituicao == "Mastercard" && qtdCaracteres != 16) {
            this.adicionarErro(905, "Número de cartão inválido");
        }
        else if (instituicao == "AmericanExpress" && (qtdCaracteres < 15 || qtdCaracteres > 16)) {
            this.adicionarErro(905, "Número de cartão inválido");
        }
        else if (instituicao == "Diners" && qtdCaracteres != 14) {
            this.adicionarErro(905, "Número de cartão inválido");
        }
        else if (instituicao == "Hipercard" && (qtdCaracteres < 13 || qtdCaracteres > 19 || qtdCaracteres == 17 ||qtdCaracteres == 18)) {
            this.adicionarErro(905, "Número de cartão inválido");
        }
    }
};

Validator.prototype.validarCvv = function(cvv, instituicao) {

    if (this.naoInformou(cvv)) {
        this.adicionarErro(907, "Informe o código de segurança do cartão");

    } else {
        var qtdCaracteres = String(cvv).length;

        if (isNaN(cvv)) {
            this.adicionarErro(907, "Código de segurança inválido");
        }
        else if (instituicao == "AmericanExpress" && qtdCaracteres != 4) {
            this.adicionarErro(907, "Código de segurança inválido");
        }
        else if (instituicao != "AmericanExpress" && qtdCaracteres != 3) {
            this.adicionarErro(907, "Código de segurança inválido");
        }
    }
};

Validator.prototype.validarParcelas = function(parcelas){

    if (this.naoInformou(parcelas)) {
        this.adicionarErro(902, "Informe a quantidade de parcelas");

    } else if (isNaN(parcelas) || parcelas < 1 || parcelas > 12){
        this.adicionarErro(902, "Quantidade de parcelas deve ser entre 1 e 12");
    }
};

Validator.prototype.validarPortador = function(portador){

    if (this.naoInformou(portador)) {
        this.adicionarErro(908, "Informe os dados do portador do cartão");

    } else {
        if (this.naoInformou(portador.Nome)) {
            this.adicionarErro(909, "Informe o nome do portador como está no cartão");
        }

        if(this.naoInformou(portador.DataNascimento)) {
            this.adicionarErro(910, "Informe a data de nascimento do portador");

        } else if(!this.dataDeNascimentoEhValida(portador.DataNascimento)) {
            this.adicionarErro(910, "Data de nascimento do portador deve estar no formato DD/MM/AAAA");
        }

        if(this.naoInformou(portador.Telefone)) {
            this.adicionarErro(911, "Informe o telefone do portador");

        } else if(!this.telefoneEhValido(portador.Telefone)) {
            this.adicionarErro(911, "O telefone do portador é inválido");
        }

        if(this.naoInformou(portador.Identidade)) {
            this.adicionarErro(912, "Informe o CPF do portador");

        } else if(!this.cpfEhValido(portador.Identidade)) {
            this.adicionarErro(912, "O CPF do portador inválido");
        }
    }
};

Validator.prototype.telefoneEhValido = function(telefone) {

    telefone = String(telefone).replace(/\D/g, "");

    if (telefone.length < 8) {
        return false;
    }
    return true;
};

Validator.prototype.cpfEhValido = function(cpf) {

    cpf = String(cpf).replace(/\D/g, "");

    if (cpf.length != 11) {
        return false;
    }
    return true;
};

Validator.prototype.dataDeNascimentoEhValida = function(data) {

    var barras = data.split("/");
    if (barras.length == 3) {
        var dia = barras[0];
        var mes = barras[1];
        var ano = barras[2];

        if(!this.diaEhValido(dia) || !this.mesEhValido(mes) || !this.anoEhValido(ano)) {
            return false;

        } else {
            return true;
        }
    }
    return false;
};

Validator.prototype.validarDataDeExpiracao = function(data) {

    var dataDeExpiracao = String(data);

    if(this.naoInformou(dataDeExpiracao)) {
        this.adicionarErro(906, "Informe a data de expiração do cartão");

    } else if(dataDeExpiracao.indexOf("/") < 0) {
        return this.adicionarErro(906, "Data de expiração deve estar no formato 'MM/AA'");

    } else {
        var partes = dataDeExpiracao.split("/");

        if(partes.length == 2) {
            var mes = partes[0];
            var ano = partes[1];

            if (!this.mesEhValido || !this.anoEhValido) {
                this.adicionarErro(906, "Data de expiração deve estar no formato 'MM/AA'");
            }
        } else {
            this.adicionarErro(906, "Data de expiração deve estar no formato 'MM/AA'");
        }
    }
};

Validator.prototype.diaEhValido = function(dia) {
    return !isNaN(dia) && dia >= 1 && dia <= 31;
};

Validator.prototype.mesEhValido = function(mes) {
    return !isNaN(mes) && mes >= 1 && mes <= 12;
};

Validator.prototype.anoEhValido = function(ano) {
    return !isNaN(ano) && ano.length == 4;
};

Validator.prototype.informou = function(dado) {
    return !naoInformou(dado);
};

Validator.prototype.naoInformou = function(dado) {
    return dado == undefined || String(dado) == '';
};

Validator.prototype.adicionarErro = function(codigoErro, mensagemErro) {
    var erro = {
        Codigo: codigoErro,
        Mensagem: mensagemErro
    };
    this.errors.push(erro);
};

module.exports = new Validator();