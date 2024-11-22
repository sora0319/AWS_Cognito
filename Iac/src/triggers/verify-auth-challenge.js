import fetch from "node-fetch";

export const handler = async (event) => {
    console.log("Verify Auth Challenge Trigger Event:", JSON.stringify(event));

    const { privateChallengeParameters, challengeAnswer } = event.request;

    try {
        // Verify Google ID Token matches the challenge answer
        const googleTokenInfo = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${challengeAnswer}`);
        const googlePayload = await googleTokenInfo.json();

        if (googlePayload.error || googlePayload.sub !== privateChallengeParameters.googleIdToken) {
            event.response.answerCorrect = false; // Verification failed
        } else {
            event.response.answerCorrect = true; // Verification succeeded
        }
    } catch (error) {
        console.error("Error verifying Google ID Token:", error);
        event.response.answerCorrect = false;
    }

    return event;
};
