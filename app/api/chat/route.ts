import Anthropic from '@anthropic-ai/sdk'
import { ANIMALS } from '@/app/gifts/_lib/animals'
import type { AnimalKey } from '@/app/gifts/_lib/types'

const client = new Anthropic()

export async function POST(req: Request) {
  const { messages, animalKey, recipientName } = await req.json()

  const animal = ANIMALS[animalKey as AnimalKey]
  const systemPrompt = `You are a gift advisor helping someone shop for ${recipientName}. Their personality archetype is "${animal.name}" — ${animal.description}

Be conversational, opinionated, and direct. Keep responses to 2–4 sentences. If they share a gift idea, give honest feedback on whether it fits. Never ask multiple questions at once.`

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: systemPrompt,
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(event.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
