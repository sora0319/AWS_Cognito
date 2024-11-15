import { CognitoIdentityProviderClient, AdminGetUserCommand, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

export const handler = async (event) => {
    try {
        const { username } = JSON.parse(event.body);

        const getUserCommand = new AdminGetUserCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: username,
        });

        const userData = await client.send(getUserCommand);

        if (userData.UserStatus !== "UNCONFIRMED") {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "User is already confirmed or does not require verification.",
                }),
            };
        }

        // 인증 코드 재발급
        const resendCommand = new ResendConfirmationCodeCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: username,
        });

        await client.send(resendCommand);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Confirmation code has been resent.",
            }),
        };
    } catch (error) {
        console.error("Error resending confirmation code:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to resend confirmation code.",
                error: error.message,
            }),
        };
    }
};
