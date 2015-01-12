var js2xml = require('data2xml');

var convertToXml = js2xml({ xmlDecl: false , attrProp: '$', valProp: '_' });

var Builder = function(options){

    this.json = {
        $: {"TipoValidacao": "Transparente"}
    };

}

Builder.prototype.build = function(){

    return convertToXml('EnviarInstrucao', {
        "InstrucaoUnica":this.json
    });

}

Builder.prototype.setRazao = function(razao){

    this.json["Razao"] = razao;

    return this;

}

Builder.prototype.setIdProprio = function(razao){

    this.json["IdProprio"] = razao;

    return this;

}

Builder.prototype.setURLNotificacao = function(urlNotificacao){

    this.json["URLNotificacao"] = urlNotificacao;

    return this;

}

Builder.prototype.setURLRetorno = function(urlRetorno){

    this.json["URLRetorno"] = urlRetorno;

    return this;

}

Builder.prototype.setValores = function(valor, acrescimo, deducao, moeda){

    moeda = moeda || "BRL";

    var valores = {
        "Valor": {
            $: { moeda : moeda },
            _: valor.toFixed(2)
        }
    };

    if(acrescimo){
        valores["Acrescimo"] = {
            $: { moeda : moeda },
            _: acrescimo.toFixed(2)
        }
    }

    if(deducao){
        valores["Deducao"] = {
            $: { moeda : moeda },
            _: deducao.toFixed(2)
        }
    }

    this.json["Valores"] = valores;

    return this;

}

/**
 *
 * @param minParcelas int min 2 max is 12
 * @param maxParcelas int min 2 max is 12
 * @param recebimento constant string "AVista" or "Parcelado"
 * @param juros float
 * @param repassar boolean
 * @returns {Builder}
 */
Builder.prototype.addParcelamento = function(minParcelas, maxParcelas, recebimento, juros, repassar){

    if(!this.json["Parcelamentos"]){
        this.json["Parcelamentos"] = {
            "Parcelamento": []
        };
    }

    this.json["Parcelamentos"]["Parcelamento"].push({
        "MinimoParcelas": minParcelas,
        "MaximoParcelas": maxParcelas,
        "Recebimento": recebimento,
        "Juros": juros?juros.toFixed(2):undefined,
        "Repassar": repassar || false
    });

    return this;

}

/**
 *
 * @param loginMoIP string
 * @param apelido string
 * @returns {Builder}
 */
Builder.prototype.setRecebedor = function(loginMoIP, apelido){

    this.json["Recebedor"] = {
       "LoginMoIP": loginMoIP,
       "Apelido": apelido
    }

    return this;

}

Builder.prototype.setPagador = function(nome, email, idPagador, endereco){

    endereco = endereco || {};

    this.json["Pagador"] = {
        "Nome": nome,
        "Email": email,
        "IdPagador": idPagador,
        "EnderecoCobranca": endereco
    }

    return this;

}

Builder.prototype.setPagadorEnderecoCobranca = function(logradouro, numero, complemento, bairro, cidade, estado, pais, cep, telefone){

    var endereco = {
        "Logradouro": logradouro,
        "Numero": numero,
        "Complemento": complemento,
        "Bairro": bairro,
        "Cidade": cidade,
        "Estado": estado,
        "Pais": pais,
        "CEP": cep,
        "TelefoneFixo": telefone
    }

    if(!this.json["Pagador"] ){
        this.json["Pagador"] = {
            "EnderecoCobranca": {}
        }
    }

    this.json["Pagador"]["EnderecoCobranca"] = endereco;

    return this;

}

/**
 *
 * @param formaPagamento string BoletoBancario or CartaoDeCredito or CartaoCredito or DebitoBancario or CartaoDeDebito or CartaoDebito or FinanciamentoBancario or CarteiraMoIP
 * @returns {Builder}
 */
Builder.prototype.addFormaPagamento = function(formaPagamento){

    if(!this.json["FormasPagamento"] ){
        this.json["FormasPagamento"] = {
            "FormaPagamento": []
        }
    }

    this.json["FormasPagamento"]["FormaPagamento"].push(formaPagamento);

    return this;

}

Builder.prototype.addMensagem = function(mensagem){

    if(!this.json["Mensagens"] ){
        this.json["Mensagens"] = {
            "Mensagem": []
        }
    }

    this.json["Mensagens"]["Mensagem"].push(mensagem);

    return this;

}

Builder.prototype.setBoleto = function(dataVencimento, diasExpiracao, tipoDiasExpiracao, urlLogo, instrucao1, instrucao2, instrucao3){

    this.json["Boleto"] = {
        "DataVencimento": dataVencimento,
        "DiasExpiracao": {
            $: {"Tipo": tipoDiasExpiracao},
            _: diasExpiracao
        },
        "URLLogo": urlLogo,
        "Instrucao1": instrucao1,
        "Instrucao2": instrucao2,
        "Instrucao3": instrucao3

    };

    return this;

}

module.exports = Builder;