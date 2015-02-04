var Builder = require("../lib/builder");
var Payment = require("../lib/payment");
var MoIP = require("../lib/moip");
var rewire = require("rewire");

describe('MoIP', function () {

    describe('identification', function () {

        it('should fail on MoIP server error (500)', function (done) {

            var xml = "<test>123</test>";
            var MoIP = rewire("../lib/moip");

            var request = function(opts,cb){

                opts.should.have.property("body");

                cb(null, {"statusCode": 500});

            };

            MoIP.__set__("request", request);

            var moip = new MoIP({sandbox: true});

            moip.identification(xml,function(err,resp){

                err.should.be.eql("MoIp returned error 500");

                done();

            });

        });

        it.skip('should send identification to sandbox', function (done) {
            this.timeout(10000);

            var b = new Builder();
            b.setRazao("Razão / Motivo do pagamento");
            b.setIdProprio(+new Date());
            b.setValores(1);
            b.setPagador("José da Silva","abc123@abc.com","cliente_1234");
            b.setPagadorEnderecoCobranca(
                "Avenida Brigadeiro Faria Lima",
                "12345",
                "casa 2",
                "Pinheiros",
                "São Paulo",
                "SP",
                "BRA",
                "03961-090",
                "(11)4321-8765"
            );

            var moip = new MoIP({sandbox: true});

            moip.identification(b.build(),function(err,resp){

                resp.should.have.property("ID");
                resp.should.have.property("Status","Sucesso");
                resp.should.have.property("Token");

                done();

            });


        });


        it.skip('should send payment to sandbox', function (done) {
            this.timeout(10000);

            var b = new Builder();
            b.setRazao("Razão / Motivo do pagamento");
            b.setIdProprio(+new Date());
            b.setValores(1);
            b.setPagador("José da Silva","abc123@abc.com","cliente_1234");
            b.setPagadorEnderecoCobranca(
                "Avenida Brigadeiro Faria Lima",
                "12345",
                "casa 2",
                "Pinheiros",
                "São Paulo",
                "SP",
                "BRA",
                "03961-090",
                "(11)4321-8765"
            );

            var moip = new MoIP({sandbox: true});

            moip.identification(b.build(),function(err,resp){

                var p = new Payment();
                p.setInstituicao("Visa");
                p.setParcelas(1);
                p.setCartaoCredito("4000000000000004","12/16","123","Nome Sobrenome","30/12/1987","(11)3165-4020","222.222.222-22");

                moip.payment(p.build(),resp.Token,function(err,resp){

                    resp.should.have.property("Status","EmAnalise");
                    resp.should.have.property("TaxaMoIP","0.46");
                    resp.should.have.property("StatusPagamento","Sucesso");
                    resp.should.have.property("CodigoMoIP");
                    resp.should.have.property("Mensagem","Requisição processada com sucesso");
                    resp.should.have.property("TotalPago","1.00");

                    done();

                });



            });






        });

    });

});