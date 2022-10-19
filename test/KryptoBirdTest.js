const {assert} = require("chai");
const { FormControlStatic } = require("react-bootstrap");

const KryptoBird = artifacts.require("./KryptoBird");

// check for chai
require("chai").use(require("chai-as-promised")).should()
contract("KryptoBird", async (accounts) => {
    // let contract;
    // before(async ()=>{
    //     let contract = await KryptoBird.deployed();
    // });
    
    describe("deployment", async ()=>{
        it("deploys successfully", async ()=>{
            let contract = await KryptoBird.deployed();
            const address = contract.address;
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            assert.notEqual(address, 0x0);
        });
        it("has a name", async ()=>{
            let contract = await KryptoBird.deployed();
            const name = await contract.name();
            assert.equal(name, "KryptoBirdz");
        });
        it("has a symbol", async ()=>{
            let contract = await KryptoBird.deployed();
            const symbol = await contract.symbol();
            assert.equal(symbol,"KBIRDZ");
        });
    });
    describe("minting", async ()=>{
        it("creates a new token", async ()=>{
            let contract = await KryptoBird.deployed();
            const result = await contract.mint("https...1");
            const totalSupply = await contract.totalSupply();
            
            // success
            assert.equal(totalSupply, 1);
            const event = await result.logs[0].args;
            assert.equal(event._to, accounts[0], "to is msg.sender");

            // failure
            await contract.mint("https...1").should.be.rejected;
        });
    });
    describe("indexing", async ()=>{
        it("lists KryptoBirdz", async ()=>{
            let contract = await KryptoBird.deployed();
            await contract.mint("https...2");
            await contract.mint("https...3");
            await contract.mint("https...4");
            const totalSupply = await contract.totalSupply();
            let result = [];
            let KryptoBirdd;
            for(let i = 1; i <= totalSupply; i++){
                KryptoBirdd = await contract.kryptoBirdz(i-1);
                result.push(KryptoBirdd);
                console.log("kryptoBird:"+KryptoBirdd);
            }
            // console.log("result is:"+result);
            let expected = ["https...1","https...2","https...3","https...4"];
            assert.equal(result.join(","), expected.join(","));
        });
        
    });
});