import { CognitoIdentityProviderClient, AdminInitiateAuthCommand, RespondToAuthChallengeCommand } from "@aws-sdk/client-cognito-identity-provider";
import fetch from "node-fetch";

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const userPoolClientId = process.env.COGNITO_USER_POOL_CLIENT_ID;

export const handler = async (event) => {
    try {
        const { idToken } = JSON.parse(event.body);

        if (!idToken) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "ID Token is required" }),
            };
        }

        // Step 1: Verify Google ID Token
        const googleTokenInfo = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        const googlePayload = await googleTokenInfo.json();

        if (googlePayload.error || googlePayload.aud !== userPoolClientId) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid Google ID Token" }),
            };
        }

        const { email, sub: googleId } = googlePayload;

        // Step 2: Start Custom Auth Flow with Cognito
        const authParams = {
            AuthFlow: "CUSTOM_AUTH",
            ClientId: userPoolClientId,
            AuthParameters: {
                USERNAME: email,
                googleToken: googleId,
            },
        };

        const authResponse = await cognitoClient.send(new AdminInitiateAuthCommand(authParams));

        if (!authResponse.Session) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Session is required to continue authentication." }),
            };
        }

        // Step 3: Respond to Custom Challenge
        const respondParams = {
            ChallengeName: "CUSTOM_CHALLENGE",
            ClientId: userPoolClientId,
            ChallengeResponses: {
                USERNAME: email,
                ANSWER: idToken,
            },
            Session: authResponse.Session,
        };

        const respondResponse = await cognitoClient.send(new RespondToAuthChallengeCommand(respondParams));

        // Step 4: Return Tokens
        return {
            statusCode: 200,
            body: JSON.stringify({
                accessToken: respondResponse.AuthenticationResult.AccessToken,
                idToken: respondResponse.AuthenticationResult.IdToken,
                refreshToken: respondResponse.AuthenticationResult.RefreshToken,
            }),
        };
    } catch (error) {
        console.error("Error during Custom Auth Flow:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
        };
    }
};
