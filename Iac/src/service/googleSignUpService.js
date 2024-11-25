import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand } from "@aws-sdk/client-cognito-identity-provider";

export default class GoogleCognitoSignUpService {
    constructor(region, userPoolId, googleGroupName) {
        this.cognitoClient = new CognitoIdentityProviderClient({ region });
        this.userPoolId = userPoolId;
        this.googleGroupName = googleGroupName;
    }

    async handleGoogleSignUp(email, googleId) {
        const createUserParams = {
            UserPoolId: this.userPoolId,
            Username: email,
            UserAttributes: [
                { Name: "email", Value: email },
                { Name: "email_verified", Value: "true" },
                { Name: "custom:googleIdToken", Value: googleId }, // Store Google ID
            ],
            MessageAction: "SUPPRESS", // Suppress email invitation
        };

        try {
            await this.cognitoClient.send(new AdminCreateUserCommand(createUserParams));
        } catch (error) {
            if (error.name !== "UsernameExistsException") {
                throw error; // Propagate other errors
            }
        }

        const addToGroupParams = {
            UserPoolId: this.userPoolId,
            GroupName: this.googleGroupName, // Google group defined in Cognito
            Username: email,
        };

        await this.cognitoClient.send(new AdminAddUserToGroupCommand(addToGroupParams));
    }
}
