'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Download, Mic } from "lucide-react"

export function NeonAudioTranscriber() {
  const [file, setFile] = useState<File | null>(null)
  const [transcription, setTranscription] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const data = await response.json()
      setTranscription(data.transcription)
    } catch (error) {
      console.error('Error:', error)
      setTranscription('Transcription failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([transcription], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcription.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Neon Audio Transcriber</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1 p-6 bg-gray-800 border-0 shadow-lg rounded-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="sr-only"
                    id="audio-file"
                  />
                  <label
                    htmlFor="audio-file"
                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Choose Audio File
                  </label>
                </div>
                <Button
                  type="submit"
                  disabled={!file || isLoading}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    'Transcribe Audio'
                  )}
                </Button>
              </form>
            </div>
          </Card>
          <Card className="flex-1 p-6 bg-gray-800 border-0 shadow-lg rounded-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative z-10 space-y-4">
              <h2 className="text-xl font-semibold text-white">Transcription</h2>
              {transcription ? (
                <>
                  <p className="text-sm text-gray-300">{transcription}</p>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Transcription
                  </Button>
                </>
              ) : (
                <p className="text-sm text-gray-400">No transcription available yet. Upload an audio file and click "Transcribe Audio" to get started.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}