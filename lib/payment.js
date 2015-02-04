var js2xml = require('data2xml');
var _ = require('lodash');

var Payment = function(options){

    this.json = {
        Forma: "CartaoCredito"
    };

}

Payment.prototype.build = function(){

    return _.clone(this.json);

}

Payment.prototype.setInstituicao = function(instituicao){

    this.json["Instituicao"] = instituicao;

    return this;

}

Payment.prototype.setParcelas = function(parcelas){

    try{
        this.json["Parcelas"] = parcelas.toString();
    }catch(e){
        delete this.json["Parcelas"];
    }


    return this;

}

/**
 * Set payment Credit Card information
 * @param numero string credit card number
 * @param expiracao string card expiration date in format MM/YY
 * @param cvv string card cvv
 * @param nome string card name
 * @param nasc string data in format "DD/MM/YYYY"
 * @param tel string phone number in format "(99)9999-9999"
 * @param cpf string cpf in formar "XXX.XXX.XXX-XX"
 * @returns {Payment}
 */
Payment.prototype.setCartaoCredito = function(numero, expiracao, cvv, nome, nasc, tel, cpf){

    this.json["CartaoCredito"] = {
        Numero: numero,
        Expiracao: expiracao,
        CodigoSeguranca: cvv,
        Portador: {
            Nome: nome,
            DataNascimento: nasc,
            Telefone: tel,
            Identidade: cpf
        }
    };

    return this;

}

Payment.prototype.setCofre = function(cofre, cvv){

    this.json["CartaoCredito"] = {
        Cofre: cofre,
        CodigoSeguranca: cvv
    };

    return this;

}

module.exports = Payment;

/* Cartão de Crédito
{
    "Forma": "CartaoCredito",
    "Instituicao": "Visa",
    "Parcelas": "1",
    "CartaoCredito": {
    "Numero": "4000000000000004",
        "Expiracao": "12/16",
        "CodigoSeguranca": "123",
        "Portador": {
        "Nome": "Nome Sobrenome",
            "DataNascimento": "30/12/1987",
            "Telefone": "(11)3165-4020",
            "Identidade": "222.222.222-22"
        }
    }
}
*/

/* Cofre
{
    "Forma": "CartaoCredito",
    "Instituicao": "Visa",
    "Parcelas": "1",
    "CartaoCredito": {
    "Cofre": "0b2118bc-fdca-4a57-9886-366326a8a647",
        "CodigoSeguranca": "123"
    }
}
*/