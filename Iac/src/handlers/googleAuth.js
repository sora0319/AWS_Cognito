import { CognitoIdentityProviderClient, AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { randomBytes } from "crypto";
import axios from "axios";

// Cognito client init
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

// Google Oauth URL
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// Google login URL init
const generateGoogleLoginUrl = (clientId, redirectUri) => {
    const state = randomBytes(16).toString("hex"); // CSRF 방지를 위한 상태 토큰 생성
    const scope = "openid email profile"; // 요청할 Google 사용자 정보 범위

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: scope,
        state: state,
    });

    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

export const handler = async (event) => {
    if (event.httpMethod === "GET" && event.path === "/auth/google") {
        // Google 로그인 URL 생성 및 리디렉션
        const loginUrl = generateGoogleLoginUrl(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_REDIRECT_URI);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ loginUrl }),
        };
    }

    if (event.httpMethod === "GET" && event.path === "/auth/google/callback") {
        // Google OAuth 콜백 처리
        const code = event.queryStringParameters?.code;
        console.log("post start");

        try {
            // Google 인증 코드를 토큰으로 교환
            const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
            });

            const idToken = tokenResponse.data.id_token;

            // Google token 유효성 검사
            const googleTokenInfoResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo`, {
                params: {
                    id_token: idToken,
                },
            });

            if (googlePayload.error) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: "Invalid Google ID Token" }),
                };
            }

            const googlePayload = googleTokenInfoResponse.data;
            const { email, sub: googleId } = googlePayload;

            //Cognito 에 이미 같은 username의 사용자 확인 및 등록
            const createUserParams = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: email,
                UserAttributes: [
                    { Name: "email", Value: email },
                    { Name: "email_verified", Value: "true" },
                    { Name: "custom:googleIdToken", Value: googleId }, // Mark email as verified
                ],
                MessageAction: "SUPPRESS", // Suppress email invitation
            };

            try {
                // Attempt to create a new Cognito user
                await cognitoClient.send(new AdminCreateUserCommand(createUserParams));
            } catch (error) {
                if (error.name !== "UsernameExistsException") {
                    throw error; // Ignore user already exists error
                }
            }

            // 사용자를 구글 그룹에 추가
            const addToGroupParams = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                GroupName: process.env.GOOGLE_GROUP_NAME,
                Username: email,
            };

            await cognitoClient.send(new AdminAddUserToGroupCommand(addToGroupParams));

            const cookieOptions = {
                httpOnly: true, // JavaScript에서 쿠키에 접근할 수 없도록 설정
                secure: true, // HTTPS를 통해서만 쿠키 전송
                sameSite: "Strict", // CSRF 공격 방지
                maxAge: 3600, // 쿠키 유효 기간 1시간
            };

            return {
                statusCode: 200,
                headers: {
                    "Set-Cookie": `accessToken=${AccessToken}; ${Object.entries(cookieOptions)
                        .map(([key, value]) => `${key}=${value}`)
                        .join("; ")}`,
                    "Access-Control-Allow-Origin": event.headers.origin,
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({
                    message: "Google SignUp Success",
                    idToken: idToken,
                    refreshToken: RefreshToken,
                }),
            };
        } catch (error) {
            console.error("Google Login Error:", error);
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": event.headers.origin,
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({ error: error.message }),
            };
        }
    }

    // 지원되지 않는 HTTP 메서드에 대한 처리
    return {
        statusCode: 405,
        body: JSON.stringify({ error: "Not Allowed HTTP Method" }),
    };
};
