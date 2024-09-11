import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import os from 'os'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use OpenAI's API key
})

export async function POST(req: NextRequest) {
  console.log('Transcription request received')

  try {
    const formData = await req.formData()
    console.log('FormData keys:', Array.from(formData.keys()))
    const file = formData.get('file') as File | null

    if (!file) {
      console.error('No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('File received:', file.name)

    // Save the file temporarily
    const tempDir = os.tmpdir()
    const tempFilePath = path.join(tempDir, file.name)
    const bytes = await file.arrayBuffer()
    fs.writeFileSync(tempFilePath, Buffer.from(bytes))

    console.log('Temporary file saved:', tempFilePath)

    // Implement Whisper API call
    console.log('Starting transcription process')
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1", // or the appropriate Whisper model
    })

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath)

    console.log('Transcription completed')

    return NextResponse.json({ transcription: transcription.text })
  } catch (error) {
    console.error('Error during transcription:', error)
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
  }
}