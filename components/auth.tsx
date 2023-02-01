import { Web3Auth } from "@web3auth/modal";
import React, { useEffect,useState } from "react";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";

const clientId = "BKaZJjoyi-71czH2j-rGTypUzDRI4ZZQanNuCmwmKK_TDSwSvpLaiMM0OpbjHH-wQgSZAU99liqCBkjXBf6hEQw";



export default function AuthButton(){
    const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const web3auth = new Web3Auth({
                    clientId, 
                    web3AuthNetwork: "testnet", // mainnet, aqua, celeste, cyan or testnet
                    chainConfig: {
                        chainNamespace: "eip155",
                        chainId: "0x1",
                        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
                    },
                });
    
                setWeb3auth(web3auth);
    
                await web3auth.initModal();
                setProvider(web3auth.provider);
            } catch (error) {
                console.error(error);
            }
        };
        init();
    }, []);

    const login = async () => {
        if (!web3auth) {
          console.log("web3auth not initialized yet");
          return;
        }
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
      };

      const getUserInfo = async () => {
        if (!web3auth) {
          console.log("web3auth not initialized yet");
          return;
        }
        console.log(await web3auth.getUserInfo())
      };

    

    return (
        <>
        <button onClick={login}>
            Log In with Web3Auth
        </button>
        <br/>
        <button onClick={getUserInfo}>
            getUserInfo
        </button>
        </>
    )
}