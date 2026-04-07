import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class ChatService {
  private groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  async getResponse(message: string, auth?: string): Promise<{ message: string }> {
    try {
      // Step 1: Detect intent
      const intentCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an intent classifier for CropCloud, an agricultural marketplace.
Respond ONLY in this exact JSON format with no extra text, no markdown:
{"intent": "GENERAL_CHAT"}
Possible intents:
- GET_PRODUCTS (ONLY when user explicitly says "show products", "list products", "get products", "browse products")
- GET_CART (ONLY when user explicitly asks to see their cart or cart items)
- GET_WISHLIST (ONLY when user explicitly asks to see their wishlist or saved items)
- TRACK_ORDER (ONLY when user explicitly asks to track or see their orders)
- GENERAL_CHAT (everything else — market prices, crop advice, weather, greetings, farming tips, price questions)`,
          },
          { role: 'user', content: message },
        ],
        model: 'llama-3.1-8b-instant',
      });

      const aiResponse = intentCompletion.choices[0]?.message?.content || '{}';
      console.log('AI RAW:', aiResponse);

      let parsed: { intent?: string } = {};
      try {
        const clean = aiResponse.replace(/```json|```/g, '').trim();
        parsed = JSON.parse(clean);
      } catch {
        parsed = { intent: 'GENERAL_CHAT' };
      }

      switch (parsed.intent) {
        case 'GET_PRODUCTS': {
          try {
            const res = await fetch('http://127.0.0.1:4000/api/v1/products');
            if (!res.ok) return { message: '⚠️ Could not fetch products right now.' };
            const data = await res.json();
            const items: any[] = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];
            if (items.length === 0) return { message: 'No products found at the moment.' };
            const productList = items
              .slice(0, 3)
              .map((p: any) => `• ${p.name ?? 'Unnamed'} - ₹${p.price ?? 'N/A'}\n  ${p.description?.slice(0, 60) ?? ''}...`)
              .join('\n\n');
            return { message: `Here are some products:\n\n${productList}` };
          } catch {
            return { message: '⚠️ Failed to load products. Please try again later.' };
          }
        }

        case 'GET_CART': {
          if (!auth) return { message: '🔒 Please log in to view your cart.' };
          try {
            const res = await fetch('http://127.0.0.1:4000/api/v1/cart', {
              headers: { Authorization: auth },
            });
            if (!res.ok) return { message: '⚠️ Could not fetch your cart. Please try again.' };
            const data = await res.json();
            const items: any[] = data?.items ?? [];
            if (items.length === 0) return { message: '🛒 Your cart is empty. Browse our products to add items!' };
            const cartList = items
              .map((item: any) => `• ${item.product?.name ?? 'Item'} x${item.quantity} - ₹${(item.product?.price ?? 0) * item.quantity}`)
              .join('\n');
            const total = items.reduce((sum: number, item: any) => sum + (item.product?.price ?? 0) * item.quantity, 0);
            return { message: `🛒 Your cart:\n\n${cartList}\n\nTotal: ₹${total}` };
          } catch {
            return { message: '⚠️ Failed to load your cart. Please try again.' };
          }
        }

        case 'GET_WISHLIST': {
          if (!auth) return { message: '🔒 Please log in to view your wishlist.' };
          try {
            const res = await fetch('http://127.0.0.1:4000/api/v1/wishlist', {
              headers: { Authorization: auth },
            });
            if (!res.ok) return { message: '⚠️ Could not fetch your wishlist. Please try again.' };
            const data = await res.json();
            const items: any[] = data?.items ?? [];
            if (items.length === 0) return { message: '❤️ Your wishlist is empty. Save products you like!' };
            const wishList = items
              .map((item: any) => `• ${item.product?.name ?? 'Item'} - ₹${item.product?.price ?? 'N/A'}`)
              .join('\n');
            return { message: `❤️ Your wishlist:\n\n${wishList}` };
          } catch {
            return { message: '⚠️ Failed to load your wishlist. Please try again.' };
          }
        }

        case 'TRACK_ORDER': {
          if (!auth) return { message: '🔒 Please log in to track your orders.' };
          try {
            const res = await fetch('http://127.0.0.1:4000/api/v1/orders', {
              headers: { Authorization: auth },
            });
            if (!res.ok) return { message: '⚠️ Could not fetch your orders. Please try again.' };
            const data = await res.json();
            const orders: any[] = Array.isArray(data) ? data : data?.items ?? [];
            if (orders.length === 0) return { message: '📦 You have no orders yet.' };
            const orderList = orders
              .slice(0, 3)
              .map((o: any) => `• Order #${o.orderNumber ?? o.id?.slice(0, 8)} — ${o.status ?? 'Unknown'} — ₹${o.total ?? 'N/A'}`)
              .join('\n');
            return { message: `📦 Your recent orders:\n\n${orderList}` };
          } catch {
            return { message: '⚠️ Failed to load your orders. Please try again.' };
          }
        }

        case 'GENERAL_CHAT':
        default: {
          const chatCompletion = await this.groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are CropCloud AI, a helpful assistant for an agricultural marketplace in India.
You help with crop advice, market prices, weather guidance, product sourcing, and agricultural knowledge.
Keep responses concise (2-4 sentences), friendly, and practical.
Always relate answers to Indian agriculture when relevant.
Do not make up specific prices or data — give general guidance instead.`,
              },
              { role: 'user', content: message },
            ],
            model: 'llama-3.1-8b-instant',
            max_tokens: 200,
          });
          const reply = chatCompletion.choices[0]?.message?.content?.trim();
          return { message: reply || '🌾 How can I help you with farming or sourcing today?' };
        }
      }
    } catch (error) {
      console.error('ChatService error:', error);
      return { message: '❌ An error occurred. Please try again.' };
    }
  }
}
