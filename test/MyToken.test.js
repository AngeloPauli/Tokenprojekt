const Token = artifacts.require("MyToken");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require('dotenv').config({path: '../.env'});

contract("Token test", function(accounts) {
    const [ initialHolder, recipient, anotherAccount ] = accounts;

    beforeEach(async () => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    });

    it("All tokens should be in my account", async () => {
        //let instance = await Token.deployed();
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();

        expect(instance.balanceOf(initialHolder)).to.eventually.eventually.a.bignumber.equal(totalSupply);
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("I can send tokens from Account x to Account y", async () => {
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("It is not possible to send more tokens than account x has", async () => {
        let instance = this.myToken; 
        let balanceOfAccount = await instance.balanceOf(initialHolder);
        expect(instance.transfer(recipient, new BN(balanceOfAccount+1))).to.eventually.be.rejected;

        // check if the balance ist still the same 
        expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfAccount);
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfAccount);
    });
})

