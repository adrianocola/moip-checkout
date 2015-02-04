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

Moip.prototype.identification = function(xml, fn){

    // Efetua a requisição pro servidor do MoIP
    request({uri: this.options.url + "/ws/alpha/EnviarInstrucao/Unica",
            method:'POST',
            headers: {"Authorization":"Basic "+ this.options.auth},
            body:xml},
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

Moip.prototype.payment = function(json, token,fn){

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


module.exports = Moip;