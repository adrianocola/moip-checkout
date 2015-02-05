var IdentificationBuilder = require('./identificationBuilder');
var PaymentBuilder = require('./paymentBuilder');

var https = require('https'),
    xml2js = require('xml2js'),
    js2xml = require('data2xml'),
    request = require('request'),
    _ = require('lodash');

var convertToXml = js2xml({ xmlDecl: false , attrProp: '$', valProp: '_' });

var Moip = function (options) {
    var defaultOptions = {
        token:      '01010101010101010101010101010101',
        key:        'ABABABABABABABABABABABABABABABABABABABAB',
        sandbox:    false,
        sandboxUrl:        'https://desenvolvedor.moip.com.br/sandbox',
        productionUrl:     'https://www.moip.com.br'
    };

    this.options = _.merge(defaultOptions, options);

    this.options.auth = new Buffer(this.options.token + ':' + this.options.key).toString('base64');
    this.options.url = this.options.sandbox?this.options.sandboxUrl:this.options.productionUrl;
};

Moip.prototype.identificationBuilder = function(){
    return new IdentificationBuilder();
}

Moip.prototype.paymentBuilder = function(){
    return new PaymentBuilder();
}

/**
 * Do an identification
 * @param xml string or IdentificationBuilder
 * @param fn
 */
Moip.prototype.identification = function(xml, fn){

    //allow the identification function to accept an IdentificationBuilder object
    if(typeof xml.build === "function"){
        xml = xml.build();
    }

    // Efetua a requisição pro servidor do MoIP
    request({uri: this.options.url + "/ws/alpha/EnviarInstrucao/Unica",
            method:'POST',
            headers: {"Authorization":"Basic "+ this.options.auth},
            body:xml
        },
        function(error,response,body){

            if(error) return fn(error);

            if(response.statusCode !== 200) return fn("MoIp returned error " + response.statusCode);

            var parser = new xml2js.Parser({mergeAttrs: true, explicitArray: false, explicitRoot: false});
            parser.addListener('end', function(result) {

                var data = result.Resposta;

                if (data.Status=='Sucesso'){
                    if(fn) fn(null,data);
                }else{
                    console.log(data.Erro);
                    if(fn) fn(data.Erro,data);
                }
            });

            parser.parseString(body);

        });
};

/**
 * Do a payment
 * @param json string or PaymentBuilder
 * @param token
 * @param fn
 */
Moip.prototype.payment = function(json, token,fn){

    //allow the payment function to accept an PaymentBuilder object
    if(typeof json.build === "function"){
        json = json.build();
    }

    var param = {
        pagamentoWidget:{
            referer : "http://test.com",
            token : token,
            dadosPagamento: json
        }
    };

    request({uri: this.options.url + "/rest/pagamento?callback=",
            method:'GET',
            headers: {
                "Content-Type": "application/json"
            },
            qs: {
                "pagamentoWidget":JSON.stringify(param)
            }
        },
        function(error,response,body){

            if(error) return fn(error);

            if(response.statusCode !== 200) return fn("MoIp returned error " + response.statusCode);

            try{
                var data = JSON.parse(body.substr(1,body.length-2));

                if (data.StatusPagamento=='Sucesso'){
                    if(fn) return fn(null,data);
                }else{
                    if(fn) return fn(data.Mensagem,data);
                }

            }catch(e){
                if(fn) return fn("Error parsing Moip response");
            }

        });
};

Moip.prototype.status = function(token,fn){

    request({uri: this.options.url + "/ws/alpha/ConsultarInstrucao/" + token,
            method:'GET',
            headers: {"Authorization":"Basic "+ this.options.auth}
        },
        function(error,response,body){

            if(error) return fn(error);

            if(response.statusCode !== 200) return fn("MoIp returned error " + response.statusCode);

            var parser = new xml2js.Parser({mergeAttrs: true, explicitArray: false, explicitRoot: false});
            parser.addListener('end', function(result) {

                var data = result.RespostaConsultar;

                if (data.Status=='Sucesso'){
                    if(fn) fn(null,data);
                }else{
                    console.log(data.Erro);
                    if(fn) fn(data.Erro,data);
                }
            });

            parser.parseString(body);

        });

};

Moip.prototype.processNASP = function(req,res,fn){

    //TODO need to parse request and make a new request to check the real status (never trust this first request!)

};


module.exports = Moip;