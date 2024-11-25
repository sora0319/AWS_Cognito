export const handler = async (event) => {
    if (event.request.session.length === 0) {
        // 첫 번째 인증 시도에서는 사용자에게 CUSTOM_CHALLENGE를 주도록 설정
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = "CUSTOM_CHALLENGE";
    } else {
        // 올바르게 챌린지를 통과한 경우 토큰 발급
        event.response.issueTokens = true;
        event.response.failAuthentication = false;
    }
    return event;
};
