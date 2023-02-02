import { Web3Auth } from "@web3auth/modal";
import React, { useEffect,useState } from "react";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import * as jose from "jose"


const clientId = "BKaZJjoyi-71czH2j-rGTypUzDRI4ZZQanNuCmwmKK_TDSwSvpLaiMM0OpbjHH-wQgSZAU99liqCBkjXBf6hEQw";



export default function AuthButton(){
    const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const [userInfo, setUserInfo] = useState("")
    const [idToken, setIdToken] = useState("")
    const [tokenInfo, setTokenInfo] = useState("")

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
        const info = await web3auth.getUserInfo()
        setUserInfo(JSON.stringify(info, null, '\t'))
        console.log("id token: "+info.idToken)
        setIdToken(JSON.stringify(info.idToken, null, '\t'));

      };

    const logout = async () => {
        await web3auth?.logout()
        setProvider(null);
      };

    const logoutButton = (
        <>
        <button onClick={logout}>Log Out</button>
        </>
    )

    const unwrap = async () => {
        const res = await fetch("/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });

        if (res.ok){
            const tokenResult = await res.json()
            setTokenInfo(JSON.stringify(tokenResult, null,'\t'))
        }


    }

    



    

    return (
        <>
        <div> {provider ? logoutButton : <></>}</div>
        <button onClick={login}>
            Log In with Web3Auth
        </button>
        <br/>
        <br/>
        <button onClick={getUserInfo}>
            getUserInfo
        </button>
        <pre>{userInfo}</pre>
        
        <br/>
        <br/>
        <button onClick={unwrap}>
            unwrap Id token
        </button>
        <pre>{tokenInfo}</pre>
        
        </>
    )
}