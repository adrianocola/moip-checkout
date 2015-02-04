var IdentificationBuilder = require('../lib/identificationBuilder');

describe('IdentificationBuilder', function () {

    describe('JSON', function () {

        it('should set Razao', function () {

            var i = new IdentificationBuilder();
            i.setRazao("123456789");

            i.json.should.have.property("Razao","123456789");

        });

        it('should set IdProprio', function () {

            var i = new IdentificationBuilder();
            i.setIdProprio("123456789");

            i.json.should.have.property("IdProprio","123456789");

        });

        it('should set URLNotificacao', function () {

            var i = new IdentificationBuilder();
            i.setURLNotificacao("http://test.com");

            i.json.should.have.property("URLNotificacao","http://test.com");

        });

        it('should set URLRetorno', function () {

            var i = new IdentificationBuilder();
            i.setURLRetorno("http://test.com");

            i.json.should.have.property("URLRetorno","http://test.com");

        });

        it('should set Valores Valor', function () {

            var i = new IdentificationBuilder();
            i.setValores(10);

            i.json["Valores"].should.eql({
                "Valor": {
                    "$": {"moeda": "BRL"},
                    _: "10.00"
                }

            });

        });

        it('should set Valores Acrescimo', function () {

            var i = new IdentificationBuilder();
            i.setValores(10, 2);

            i.json["Valores"].should.eql({
                "Valor": {
                    "$": {"moeda": "BRL"},
                    _: "10.00"
                },
                "Acrescimo": {
                    $: { moeda : "BRL" },
                    _: "2.00"
                }
            });

        });

        it('should set Valores Deducao', function () {

            var i = new IdentificationBuilder();
            i.setValores(10, 2, 1);

            i.json["Valores"].should.eql({
                "Valor": {
                    "$": {"moeda": "BRL"},
                    _: "10.00"
                },
                "Acrescimo": {
                    $: { moeda : "BRL" },
                    _: "2.00"
                },
                "Deducao": {
                    $: { moeda : "BRL" },
                    _: "1.00"
                }
            });

        });

        it('should set Valores Moeda', function () {

            var i = new IdentificationBuilder();
            i.setValores(10, 2, 1, "USD");

            i.json["Valores"].should.eql({
                "Valor": {
                    "$": {"moeda": "USD"},
                    _: "10.00"
                },
                "Acrescimo": {
                    $: { moeda : "USD" },
                    _: "2.00"
                },
                "Deducao": {
                    $: { moeda : "USD" },
                    _: "1.00"
                }
            });

        });

        it('should add Parcelamentos', function () {

            var i = new IdentificationBuilder();
            i.addParcelamento(2,10,"AVista",1.5,true);
            i.addParcelamento(5,8,"Parcelado");

            i.json["Parcelamentos"]["Parcelamento"][0].should.eql({
                "MinimoParcelas": 2,
                "MaximoParcelas": 10,
                "Recebimento": "AVista",
                "Juros": "1.50",
                "Repassar": true
            });

            i.json["Parcelamentos"]["Parcelamento"][1].should.eql({
                "MinimoParcelas": 5,
                "MaximoParcelas": 8,
                "Recebimento": "Parcelado",
                "Juros": undefined,
                "Repassar": false
            });

        });

        it('should set Recebedor', function () {

            var i = new IdentificationBuilder();
            i.setRecebedor("recebedor_secundario","apelido_recebedor");

            i.json["Recebedor"].should.eql({
                "LoginMoIP": "recebedor_secundario",
                "Apelido": "apelido_recebedor"
            });

        });

        it('should set Pagador', function () {

            var i = new IdentificationBuilder();
            i.setPagador("José da Silva","abc123@abc.com","cliente_1234");

            i.json["Pagador"].should.eql({
                "Nome": "José da Silva",
                "Email": "abc123@abc.com",
                "IdPagador": "cliente_1234",
                "EnderecoCobranca": {}
            });

        });

        it('should set Pagador Endereco Cobranca', function () {

            var i = new IdentificationBuilder();
            i.setPagadorEnderecoCobranca(
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

            i.json["Pagador"]["EnderecoCobranca"].should.eql({
                "Logradouro": "Avenida Brigadeiro Faria Lima",
                "Numero": "12345",
                "Complemento": "casa 2",
                "Bairro": "Pinheiros",
                "Cidade": "São Paulo",
                "Estado": "SP",
                "Pais": "BRA",
                "CEP": "03961-090",
                "TelefoneFixo": "(11)4321-8765"
            });

        });

        it('should add FormasPagamentos', function () {

            var i = new IdentificationBuilder();
            i.addFormaPagamento("BoletoBancario");
            i.addFormaPagamento("CartaoDeCredito");

            i.json["FormasPagamento"]["FormaPagamento"][0].should.eql("BoletoBancario");
            i.json["FormasPagamento"]["FormaPagamento"][1].should.eql("CartaoDeCredito");

        });

        it('should add Mensagem', function () {

            var i = new IdentificationBuilder();
            i.addMensagem("Message 1");
            i.addMensagem("Message 2");

            i.json["Mensagens"]["Mensagem"][0].should.eql("Message 1");
            i.json["Mensagens"]["Mensagem"][1].should.eql("Message 2");

        });

        it('should set Boleto', function () {

            var d = new Date();

            var i = new IdentificationBuilder();
            i.setBoleto(d, 10, "Corridos", "http://google.com","12345","12345","12345");

            i.json["Boleto"].should.eql({
                "DataVencimento": d,
                "DiasExpiracao": {
                    $: {"Tipo": "Corridos"},
                    _: 10
                },
                "URLLogo": "http://google.com",
                "Instrucao1": "12345",
                "Instrucao2": "12345",
                "Instrucao3": "12345"

            });

        });

    });

    describe('Build', function () {

        it('should generate base XML', function () {

            var i = new IdentificationBuilder();

            var xml = i.build();

            xml.should.be.equal(
                "<EnviarInstrucao>" +
                    "<InstrucaoUnica TipoValidacao=\"Transparente\"></InstrucaoUnica>" +
                "</EnviarInstrucao>"
            );

        });

        it('should generate full XML', function () {

            var d = new Date();

            var i = new IdentificationBuilder();
            i.setRazao("123456789");
            i.setIdProprio("123456789");
            i.setURLNotificacao("http://test.com");
            i.setURLRetorno("http://test.com");
            i.setValores(10, 2, 1);
            i.addParcelamento(2,10,"AVista",1.5,true);
            i.setRecebedor("recebedor_secundario","apelido_recebedor");
            i.setPagador("José da Silva","abc123@abc.com","cliente_1234");
            i.setPagadorEnderecoCobranca(
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
            i.addFormaPagamento("BoletoBancario");
            i.addFormaPagamento("CartaoDeCredito");
            i.addMensagem("Message 1");
            i.addMensagem("Message 2");
            i.setBoleto(d, 10, "Corridos", "http://teste.com/img.png","12345","12345","12345");

            var xml = i.build();

            xml.should.be.equal(
                "<EnviarInstrucao>" +
                    "<InstrucaoUnica TipoValidacao=\"Transparente\">" +
                        "<Razao>123456789</Razao>" +
                        "<IdProprio>123456789</IdProprio>" +
                        "<URLNotificacao>http://test.com</URLNotificacao>" +
                        "<URLRetorno>http://test.com</URLRetorno>" +
                        "<Valores>" +
                            "<Valor moeda=\"BRL\">10.00</Valor>" +
                            "<Acrescimo moeda=\"BRL\">2.00</Acrescimo>" +
                            "<Deducao moeda=\"BRL\">1.00</Deducao>" +
                        "</Valores>" +
                        "<Parcelamentos>" +
                            "<Parcelamento>" +
                                "<MinimoParcelas>2</MinimoParcelas>" +
                                "<MaximoParcelas>10</MaximoParcelas>" +
                                "<Recebimento>AVista</Recebimento>" +
                                "<Juros>1.50</Juros>" +
                                "<Repassar>true</Repassar>" +
                            "</Parcelamento>" +
                        "</Parcelamentos>" +
                        "<Recebedor>" +
                            "<LoginMoIP>recebedor_secundario</LoginMoIP>" +
                            "<Apelido>apelido_recebedor</Apelido>" +
                        "</Recebedor>" +
                        "<Pagador>" +
                            "<Nome>José da Silva</Nome>" +
                            "<Email>abc123@abc.com</Email>" +
                            "<IdPagador>cliente_1234</IdPagador>" +
                            "<EnderecoCobranca>" +
                                "<Logradouro>Avenida Brigadeiro Faria Lima</Logradouro>" +
                                "<Numero>12345</Numero>" +
                                "<Complemento>casa 2</Complemento>" +
                                "<Bairro>Pinheiros</Bairro>" +
                                "<Cidade>São Paulo</Cidade>" +
                                "<Estado>SP</Estado>" +
                                "<Pais>BRA</Pais>" +
                                "<CEP>03961-090</CEP>" +
                                "<TelefoneFixo>(11)4321-8765</TelefoneFixo>" +
                            "</EnderecoCobranca>" +
                        "</Pagador>" +
                        "<FormasPagamento>" +
                            "<FormaPagamento>BoletoBancario</FormaPagamento>" +
                            "<FormaPagamento>CartaoDeCredito</FormaPagamento>" +
                        "</FormasPagamento>" +
                        "<Mensagens>" +
                            "<Mensagem>Message 1</Mensagem>" +
                            "<Mensagem>Message 2</Mensagem>" +
                        "</Mensagens>" +
                        "<Boleto>" +
                            "<DataVencimento></DataVencimento>" +
                            "<DiasExpiracao Tipo=\"Corridos\">10</DiasExpiracao>" +
                            "<URLLogo>http://teste.com/img.png</URLLogo>" +
                            "<Instrucao1>12345</Instrucao1>" +
                            "<Instrucao2>12345</Instrucao2>" +
                            "<Instrucao3>12345</Instrucao3>" +
                        "</Boleto>" +
                    "</InstrucaoUnica>" +
                "</EnviarInstrucao>"
            );

        });

    });


});

