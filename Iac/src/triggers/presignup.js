import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

export const handler = async (event) => {
    const userPoolId = event.userPoolId;
    const email = event.request.userAttributes.email;

    const params = {
        UserPoolId: userPoolId,
        Filter: `email = "${email}"`,
    };

    try {
        const command = new ListUsersCommand(params);
        const data = await cognitoClient.send(command);

        if (data.Users && data.Users.length > 0) {
            throw new Error("Email Already Exists");
        }
    } catch (error) {
        throw error;
    }

    // 이메일 중복이 없고 가입을 허용할 경우 설정
    event.response = {
        autoConfirmUser: false, // 자동으로 사용자 확인
        autoVerifyEmail: false, // 자동으로 이메일 확인
    };
    return event;
};
