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


module.exports = Moip;