import React, {useState, useEffect} from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import KryptoBird from "../abis/KryptoBird.json";
import Card from "./Card";
import "./App.css";

function App(){
    const [account, setAccount] = useState("connecting to wallet...");
    const [contract, setContract] = useState(null);
    const [totalSupply, setTotalSupply] = useState(0);
    const [kryptobirdz, setKryptobirdz] = useState([]);
    const [fileLocation, setFileLocation] = useState("");
    
    useEffect(() => {
        loadWeb3();
        loadBlockchainData();
    }, []);

    useEffect(()=>{
        console.log("totalSupply of nfts:" + totalSupply);
    },[totalSupply]);

    useEffect(()=>{
        console.log(kryptobirdz);
    },[kryptobirdz]);
    
    // first to detect etherum provider
    async function loadWeb3() {
        const provider = await detectEthereumProvider();

        // check modern browers
        if(provider){
            console.log("ethereum wallet is connected");
            window.web3 = new Web3(provider);
        }
        else{
            console.log("failed");
        }
    }
    
    async function loadBlockchainData(){
        await window.ethereum.request({ method: 'eth_accounts' }).then((message)=>{
            setAccount(message[0]);
        }).catch(()=>{
            console.log("rejected");
        });

        const networkId = await window.ethereum.request({ method: 'net_version' });
        const networkData = KryptoBird.networks[networkId];
        if(networkData){
            const abi = KryptoBird.abi;
            const address = networkData.address;
            let provider = window.ethereum;
            if (provider){
                await provider.request({ method: "eth_requestAccounts" });
                const contract = new window.web3.eth.Contract(abi, address);
                setContract(contract);
                const gottontotalSupply = await contract.methods.totalSupply().call();
                setTotalSupply(gottontotalSupply);
                let temp = [];
                for(let i = 1; i <= gottontotalSupply; i++){
                    const KryptoBird = await contract.methods.kryptoBirdz(i-1).call();
                    temp.push(KryptoBird);
                }
                setKryptobirdz(temp);
            }
        }
        else{
            window.alert("Smart contract not deployed");
        }
    }

    // with minting, we are sending infromation, and we need to specify account
    function mint(kryptoBird){
        contract.methods.mint(kryptoBird).send({from:account}).once("receipt",(receipt)=>{});
    }
    

    return (
        <div className="container-filled">
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <div style={{color:"white"}} className="navbar-brand col-sm-3 col-md-3 mr-0">
                    KryptoBirdz NFTs
                </div>
                <ul className="navbar-nav px3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block"></li>
                    <small className="text-white mr-5">
                        {account}
                    </small>
                </ul>
            </nav>
            <div className="container-fluid mt-1">
                <div className="row">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto" style={{opacity:"0.8"}}>
                            <h1 style={{color:"black"}}>KryptoBird - NFT Marketplace</h1>
                            <form onSubmit={(event)=>{
                                event.preventDefault();
                                mint(fileLocation);
                                }}>
                                <input type="text" placeholder="add file location" value={fileLocation} onChange={(event)=>{
                                    setFileLocation(event.target.value);
                                }} className="form-control mb-1"/>
                                <button type="submit" className="btn btn-primary btn-black">MINT</button> 
                            </form>
                        </div>
                    </main>
                </div>
                <hr />
                <div className="custom-margin">
                    <div className="row text-center">
                        {kryptobirdz.map((KBird, idx)=>{
                            return (<Card dataURL = {KBird} key = {idx} name = {"kryptoBirdz"}/>);
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

/*
file locations:
https://i.ibb.co/2n0Rk1t/k1.png
https://i.ibb.co/tsbDZd4/k2.png
https://i.ibb.co/bR3wDnH/k3.png
https://i.ibb.co/hKMTC4R/k4.png
https://i.ibb.co/9VD6L8N/k5.png
https://i.ibb.co/FY8PQ1n/k6.png
https://i.ibb.co/tbfnzZB/k7.png
https://i.ibb.co/HTkjX4g/k8.png
https://i.ibb.co/YXq1GrX/k9.png
https://i.ibb.co/mRyvbsg/k10.png
https://i.ibb.co/XVkGmYh/k11.png

to clear up all the nfts:
run in terminal: truffle migrate --reset
*/