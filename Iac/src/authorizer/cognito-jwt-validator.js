import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

class CognitoJwtValidator {
    constructor() {
        const { AWS_REGION, COGNITO_USER_POOL_ID } = process.env;

        if (!AWS_REGION || !COGNITO_USER_POOL_ID) {
            throw new Error("AWS_REGION and COGNITO_USER_POOL_ID must be defined in environment variables");
        }

        this.cognitoConfig = {
            region: AWS_REGION,
            userPoolId: COGNITO_USER_POOL_ID,
        };

        // JWKS 클라이언트 초기화 (캐시 비활성화)
        this.jwksClient = jwksClient({
            jwksUri: `https://cognito-idp.${this.cognitoConfig.region}.amazonaws.com/${this.cognitoConfig.userPoolId}/.well-known/jwks.json`,
            cache: false, // 캐시 비활성화
        });
    }

    // JWT 토큰 검증
    async validateToken(token) {
        try {
            const decodedToken = jwt.decode(token, { complete: true });
            if (!decodedToken) {
                throw new Error("Invalid token");
            }

            const key = await this.getSigningKey(decodedToken.header.kid);
            return jwt.verify(token, key.publicKey, {
                algorithms: ["RS256"],
                issuer: `https://cognito-idp.${this.cognitoConfig.region}.amazonaws.com/${this.cognitoConfig.userPoolId}`,
            });
        } catch (error) {
            console.error("Token validation failed:", error);
            throw error;
        }
    }

    // 서명 키 조회
    async getSigningKey(kid) {
        return new Promise((resolve, reject) => {
            this.jwksClient.getSigningKey(kid, (err, key) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(key);
                }
            });
        });
    }
}

export default CognitoJwtValidator;