import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });
    const { messages } = await req.json();
    
    // We can use NextResponse and node stream for streaming,
    // or standard Response with ReadableStream.
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      stream: true,
      max_tokens: 150,
      messages: [
        {
          role: 'system',
          content: `You are a concise AI assistant in Neel Kachhadia's portfolio. Answer about Neel only. Max 3 sentences. Be technical and direct.

Neel is a 2nd-year E&TC student at DJSCE Mumbai (2024–2028), Honours VLSI. Builds production AI systems.

Projects: Equity Research Platform (LangGraph + FastAPI + AWS EC2/S3), NeuroFin (sub-200ms Lambda, adaptive feedback loop, MERN + LangGraph), Mentora (OpenAI embeddings matching, Firebase chat).

Skills: Python, TypeScript, React, FastAPI, Node.js, LangGraph, OpenAI APIs, AWS, Firebase, GCP.

Hackathons: Mumbai Hacks, Google Hack2Skill, Odoo Hackathon.
Contact: neel1234kachhadia@gmail.com · github.com/Neel-Kachhadia`
        },
        ...messages
      ]
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      }
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
