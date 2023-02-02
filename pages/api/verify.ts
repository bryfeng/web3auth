// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import * as jose from "jose"

export default async ( req: NextApiRequest, res: NextApiResponse)  => {
  if (req.method === "POST") {

    try{
      console.log(req.body)
      const idToken = JSON.parse(req.body.idToken);
      // Get the JWK set used to sign the JWT issued by Web3Auth
      const jwks = jose.createRemoteJWKSet(new URL("https://api.openlogin.com/jwks"));
      const jwtDecoded = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });
      console.log(jwtDecoded.payload)

      

      // Return the response from the external API to the original request
      res.status(200).json(jwtDecoded.payload);}
    catch(error: any) {
      res.status(500).json({ message: "internal error" });
    }

    
    
  } 
  
  else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
