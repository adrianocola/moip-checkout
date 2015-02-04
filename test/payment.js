var should = require('should');
var Payment = require('../lib/payment');

describe('Payment', function () {

    describe('JSON', function () {

        it('should set Instituicao', function () {

            var p = new Payment();
            p.setInstituicao("Visa");

            p.json.should.have.property("Instituicao","Visa");

        });

        it('should set Parcelas', function () {

            var p = new Payment();
            p.setParcelas(1);

            p.json.should.have.property("Parcelas","1");

        });

        it('should set CartaoCredito', function () {

            var p = new Payment();
            p.setCartaoCredito("4000000000000004","12/16","123","Nome Sobrenome","30/12/1987","(11)3165-4020","222.222.222-22");

            p.json.should.have.property("CartaoCredito",{
                Numero: "4000000000000004",
                Expiracao: "12/16",
                CodigoSeguranca: "123",
                Portador: {
                    Nome: "Nome Sobrenome",
                    DataNascimento: "30/12/1987",
                    Telefone: "(11)3165-4020",
                    Identidade: "222.222.222-22"
                }
            });

        });

        it('should set Cofre', function () {

            var p = new Payment();
            p.setCofre("0b2118bc-fdca-4a57-9886-366326a8a647","123");

            p.json.should.have.property("CartaoCredito",{Cofre: "0b2118bc-fdca-4a57-9886-366326a8a647", CodigoSeguranca: "123"});

        });

    });

    describe('Build', function () {

        it('should generate base JSON', function () {

            var p = new Payment();

            var json = p.build();

            json.should.eql({ Forma: 'CartaoCredito' });

        });

        it('should generate full JSON with Cofre', function () {

            var p = new Payment();
            p.setInstituicao("Visa");
            p.setParcelas(1);
            p.setCofre("0b2118bc-fdca-4a57-9886-366326a8a647","123");

            var json = p.build();

            json.should.eql(
                {
                    CartaoCredito: {
                        CodigoSeguranca: '123',
                        Cofre: '0b2118bc-fdca-4a57-9886-366326a8a647'
                    },
                    Forma: 'CartaoCredito',
                    Instituicao: 'Visa',
                    Parcelas: '1'
                }
            );

        });

        it('should generate full JSON with CartaoCredito', function () {

            var p = new Payment();
            p.setInstituicao("Visa");
            p.setParcelas(1);
            p.setCartaoCredito("4000000000000004","12/16","123","Nome Sobrenome","30/12/1987","(11)3165-4020","222.222.222-22");

            var json = p.build();

            json.should.eql(
                {
                    CartaoCredito: {
                        CodigoSeguranca: '123',
                        Expiracao: '12/16',
                        Numero: '4000000000000004',
                        Portador: {
                            DataNascimento: '30/12/1987',
                            Identidade: '222.222.222-22',
                            Nome: 'Nome Sobrenome',
                            Telefone: '(11)3165-4020'
                        }
                    },
                    Forma: 'CartaoCredito',
                    Instituicao: 'Visa',
                    Parcelas: '1'
                }
            );

        });

    });


});

