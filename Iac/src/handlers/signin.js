// src/handlers/signin.js
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

// CORS 설정
const corsHeaders = {
    "Access-Control-Allow-Origin": "https://devton.ahimmoyak.click",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Expose-Headers": "Set-Cookie",
};

export const handler = async (event) => {
    try {
        const { username, password } = JSON.parse(event.body);
        const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        });
        const response = await client.send(command);

        // Extract the tokens from the response
        const { AccessToken, IdToken, RefreshToken } = response.AuthenticationResult;

        // Create a secure, HTTP-only cookie with the access token
        const access_cookieOptions = {
            domain: ".ahimmoyak.click",
            httpOnly: true,
            secure: true, // 로컬 환경에서는 false
            sameSite: "Lax", // sameSite 제한을 완화
            maxAge: 3600 * 1000, // 1 hour
            path: "/",
        };

        const id_cookieOptions = {
            domain: ".ahimmoyak.click",
            httpOnly: true,
            secure: true, // 로컬 환경에서는 false
            sameSite: "Lax", // sameSite 제한을 완화
            maxAge: 3600 * 1000, // 1 hour
            path: "/",
        };

        const refresh_cookieOptions = {
            domain: ".ahimmoyak.click",
            httpOnly: true,
            secure: true, // 로컬 환경에서는 false
            sameSite: "Lax", // sameSite 제한을 완화
            maxAge: 14 * 24 * 3600 * 1000, // 14 day
            path: "/",
        };

        return {
            statusCode: 200,
            headers: {
                ...corsHeaders,
                "Set-Cookie": `accessToken=${AccessToken}; ${Object.entries(access_cookieOptions)
                    .map(([key, value]) => `${key}=${value}`)
                    .join("; ")}`,
            },
            multiValueHeaders: {
                "Set-Cookie": [
                    `idToken=${IdToken}; ${Object.entries(id_cookieOptions)
                        .map(([key, value]) => `${key}=${value}`)
                        .join("; ")}`,
                    `refreshToken=${RefreshToken}; ${Object.entries(refresh_cookieOptions)
                        .map(([key, value]) => `${key}=${value}`)
                        .join("; ")}`,
                ],
            },
            body: JSON.stringify({
                message: "Login successful",
            }),
        };
    } catch (error) {
        console.error("Signin error:", error);
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
