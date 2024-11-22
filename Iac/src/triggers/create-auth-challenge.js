export const handler = async (event) => {
    console.log("Create Auth Challenge Trigger Event:", JSON.stringify(event));

    event.response.publicChallengeParameters = {};
    event.response.privateChallengeParameters = {
        googleIdToken: event.request.userAttributes["custom:googleIdToken"], // Pass stored Google ID
    };
    event.response.challengeMetadata = "CUSTOM_CHALLENGE";

    return event;
};
