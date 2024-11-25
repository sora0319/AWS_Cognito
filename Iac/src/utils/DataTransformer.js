export default class DataTransformer {
    decoding(state) {
        try {
            // state decodeing 하여 조건 확인
            const decodedString = Buffer.from(state, "base64").toString("utf-8");

            const parsedData = JSON.parse(decodedString);

            const randomData = parsedData.random;
            const requireMode = parsedData.requireMode;
            const jsonMode = JSON.parse(requireMode);

            return jsonMode.mode;
        } catch (error) {
            console.error("Failed to decode token:", error.message);
            throw error; // 에러 발생 시 호출한 쪽에서 처리하도록 재던짐
        }
    }
}
