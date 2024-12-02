// cognito-authorizer.js
import CognitoJwtValidator from "./cognito-jwt-validator.js";

export const handler = async (event) => {
    const validator = new CognitoJwtValidator();

    try {
        // Bearer 토큰 추출
        const token = event.authorizationToken;
        if (!token || !token.startsWith("Bearer ")) {
            throw new Error("Unauthorized: Invalid or missing token");
        }
        const actualToken = token.split(" ")[1];

        // 토큰 검증
        const decodedToken = await validator.validateToken(actualToken);
        console.log(decodedToken);
        // IAM 정책 생성
        const policy = generateIAMPolicy(decodedToken.sub, "Allow", event.methodArn, {
            email: decodedToken.email,
            username: decodedToken.username,
        });

        return policy;
    } catch (error) {
        console.error("Authorization failed:", error);
        throw new Error("Unauthorized");
    }
};

// IAM 정책 생성 함수
const generateIAMPolicy = (principalId, effect, resource, context) => {
    return {
        principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
        context,
    };
};
