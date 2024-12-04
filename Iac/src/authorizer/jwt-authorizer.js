// cognito-authorizer.js
import CognitoJwtValidator from "./cognito-jwt-validator.js";

export const handler = async (event) => {
    const validator = new CognitoJwtValidator();
    console.log(event);
    try {
        // Cookie에서 accessToken 추출
        const cookieHeader = event.authorizationToken;

        if (!cookieHeader) {
            throw new Error("Unauthorized: Missing cookie");
        }
        const cookies = parseCookies(cookieHeader);
        const token = cookies["accessToken"];

        if (!token) {
            throw new Error("Unauthorized: Missing accessToken");
        }

        // 토큰 검증
        const decodedToken = await validator.validateToken(token);
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

// 쿠키 파싱 함수
const parseCookies = (cookieHeader) => {
    return cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .reduce((acc, cookie) => {
            const [key, value] = cookie.split("=");
            acc[key] = value;
            return acc;
        }, {});
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
