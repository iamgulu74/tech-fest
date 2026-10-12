const PYTHON_CHATBOT_URL = 'http://127.0.0.1:5002/predict';

export const aiService = {
    async analyzeSymptoms(message: string) {
        try {
            const response = await fetch(PYTHON_CHATBOT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (!response.ok) throw new Error('Chatbot response not OK');
            
            const data: any = await response.json();
            let content = "";

            if (data.answer && Array.isArray(data.answer)) {
                // The chatbot returns [tag, text, precaution] or [tag, text]
                // Handle different response types from chat.py
                const tag = data.answer[0];
                const text = data.answer[1];
                const extra = data.answer[2];
                
                if (tag === 'center') {
                    content = "Here are some nearby medical centers:\n\n";
                    const centers = data.answer.slice(1);
                    centers.forEach((c: any) => {
                        if (Array.isArray(c)) {
                            content += `- ${c[0]} (${c[1]}): ${c[2]}\n`;
                        }
                    });
                } else if (tag === 'not_understand') {
                    content = text || "I'm sorry, I didn't quite catch that. Could you rephrase?";
                } else if (extra) {
                    content = `${text}\n\nPrecaution: ${extra}`;
                } else {
                    content = text || "Hello! How can I help you today?";
                }
            } else {
                content = data.answer || "Unexpected response format from diagnosis engine.";
            }

            return {
                content: content,
                role: 'assistant'
            };
        } catch (error: any) {
            console.error('Python Chatbot Error:', error.message);
            // Fallback to simple response if python server is down
            return {
                content: "I'm having trouble reaching my specialized diagnosis engine. Please ensure the local chatbot service is running.",
                role: 'assistant'
            };
        }
    }
};
