// app/actions/sendMessageToBot.ts - FINAL SUPERCHARGED CODE

"use server";

import { getSingleProduct, searchProducts } from "@/sanity/lib/queries";
import { auth } from "@/app/auth"; 
import SanityProduct from "@/sanity/types/product_types";

// --- TypeScript Interfaces ---
interface ChatMessage {
    role: "user" | "assistant" | "tool";
    content?: string | null;
    tool_calls?: {
        id: string;
        type: 'function';
        function: {
            name: string;
            arguments: string;
        };
    }[];
    tool_call_id?: string;
    name?: string;
}

// --- Python Server ka URL ---
const PYTHON_API_URL = "http://127.0.0.1:8000/api/chat";

// --- Main Server Action ---
export async function sendMessageToBot(history: ChatMessage[]) {
    // 1. Pehli request Python server ko bhejna
    let response = await fetch(PYTHON_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Python server error (1st call):", errorText);
        throw new Error("Python server se response nahi mila.");
    }
    
    let botMessage: ChatMessage = await response.json();

    // 2. Check karna ke Gemini ne koi tool istemal karne ko kaha hai ya nahi.
    if (botMessage.tool_calls && botMessage.tool_calls.length > 0) {
        const toolCall = botMessage.tool_calls[0];
        const functionName = toolCall.function.name;
        
        console.log(`Gemini wants to use tool: ${functionName}`);

        let functionArgs: any = {};
        try {
            if (toolCall.function.arguments) {
                functionArgs = JSON.parse(toolCall.function.arguments);
            }
        } catch (e) {
            console.error("Error parsing tool arguments:", toolCall.function.arguments, e);
            return "Maaf kijiye, main aapke sawal ko theek se samajh nahi paya.";
        }
        
        let toolResultContent = "Maaf kijiye, iske baray mein maaloomaat nahi mil saki.";

        // 3. Sahi tool ko run karna
        if (functionName === 'getReturnPolicy') {
            toolResultContent = "Hamari 7 din ki easy return policy hai. Item original condition mein box ke sath hona chahiye. Fragrances aur sale wali items return nahi ho sakti.";
        } 
        else if (functionName === 'searchProducts') {
            const products = await searchProducts((functionArgs as any).searchTerm);
            
            if (products && products.length > 0) {
                // === YAHAN ASAL, MUKAMMAL AUR NAYI LOGIC HAI ===
                const simplifiedProducts = products
                    // Hifazati check: Sirf un products ko process karein jin mein default variant ho
                    .filter((p: { defaultVariant: any; }) => p.defaultVariant) 
                    .map((p: SanityProduct) => ({
                        title: p.title,
                        // Price aur inStock ab defaultVariant se aayegi
                        price: p.defaultVariant.salePrice ?? p.defaultVariant.price,
                        inStock: p.defaultVariant.inStock,
                        slug: p.slug
                    }));
                toolResultContent = JSON.stringify(simplifiedProducts);
            } else {
                toolResultContent = `Maaf kijiye, "${(functionArgs as any).searchTerm}" ke naam se koi product nahi mila. Kya aap spelling check kar sakte hain?`;
            }
        }
        else if (functionName === 'getSingleProduct') {
            const product = await getSingleProduct(functionArgs.slug);
            // getSingleProduct ab naya structure return karti hai, jo bilkul theek hai
            toolResultContent = product ? JSON.stringify(product) : `"${functionArgs.slug}" wala product nahi mila.`;
        }
        else if (functionName === 'getSingleUserOrder') {
            const session = await auth();
            if (!session?.user?.id) {
                toolResultContent = "Apna order dekhne ke liye, aapko pehle login karna hoga.";
            } else {
                toolResultContent = "Order tracking feature abhi tayyar ho raha hai. Jald hi available hoga.";
            }
        }

        // 4. Gemini ko tool ka result wapis bhejna
        const toolResponseMessage: ChatMessage = {
            role: 'tool',
            tool_call_id: toolCall.id,
            name: functionName,
            content: toolResultContent,
        };
        
        const historyForNextCall = [...history, botMessage, toolResponseMessage];

        response = await fetch(PYTHON_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: historyForNextCall }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Python server error (2nd call):", errorText);
            throw new Error("Tool result ke baad Python server se response nahi mila.");
        }

        botMessage = await response.json();
    }
    
    // 5. Final, insani jawab wapis UI ko bhejna.
    return botMessage.content || "Maaf kijiye, main isay samajh nahi saka.";
}