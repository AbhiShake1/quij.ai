"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlayCircle, Menu, Brain, LogOut, Check, X } from 'lucide-react'
import { createCounter } from '@/lib/helpers/counter'
import { isEqual } from 'lodash'
import { z } from 'zod'
import { questionSchema } from '@/schemas/question=schema'
import { api } from '@/trpc/react'

export type Question = z.infer<typeof questionSchema>

type Message = {
  role: 'assistant' | 'user';
  content: string;
  question?: Question;
  selectedAnswers?: number[];
}

export function QuizApp() {
  const [topic, setTopic] = useState('')
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>()
  const [selectedAnswers, setSelectedAnswers] = useState<number[] | undefined>()
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const lastSubmitRef = useRef<HTMLButtonElement>(null)
  const questionsQuery = api.quiz.getAll.useQuery({ lang: topic }, { enabled: isQuizStarted, initialData: [] })
  const questions = questionsQuery.data

  useEffect(() => {
    if (isQuizStarted) void questionsQuery.refetch()
  }, [isQuizStarted])

  const getQuestion = useMemo(() => createCounter(questions), [questions])

  const startQuiz = () => {
    if (topic.trim()) {
      setIsQuizStarted(true)
      setMessages([
        { role: 'assistant', content: `Great! Let's start the quiz on ${topic}. Here's your first question:` }
      ])
      generateQuestion()
    }
  }

  const generateQuestion = () => {
    // This is a mock question. In a real app, you'd fetch this from an API or database
    const newQuestion = getQuestion()
    setCurrentQuestion(newQuestion)
    setSelectedAnswers(undefined)
    setIsAnswerSubmitted(false)
  }

  const handleAnswerSelect = (index: number, correctAnswersLength: number) => {
    const selectedAnswersLength = selectedAnswers?.length ?? 0

    if (selectedAnswersLength >= correctAnswersLength) return setSelectedAnswers([index])

    if (!!selectedAnswers?.includes(index)) {
      return setSelectedAnswers((s = []) => s.filter(i => i !== index))
    }

    return setSelectedAnswers((s = []) => [...new Set([...s, index])])
  }

  const handleAnswerSubmit = async () => {
    if (!currentQuestion) return
    if (selectedAnswers === undefined) return

    setIsAnswerSubmitted(true)

    const isCorrect = isEqual(selectedAnswers, currentQuestion.correctAnswers)
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: selectedAnswers.map(selectedAnswer => currentQuestion.options[selectedAnswer]).join(', '),
        question: currentQuestion,
        selectedAnswers,
      },
      {
        role: 'assistant',
        content: isCorrect
          ? "Correct! Well done. Let's move on to the next question."
          : `Sorry, that's incorrect. The correct answer is ${currentQuestion.options[currentQuestion.correctAnswers?.[0] ?? 0]}. Let's try another question.`
      }
    ])

    generateQuestion()
    lastSubmitRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const Sidebar = () => (
    <></>
    // <motion.div
    //   className="w-64 h-full bg-background"
    //   initial={{ x: -100, opacity: 0 }}
    //   animate={{ x: 0, opacity: 1 }}
    //   transition={{ type: "spring", stiffness: 100, damping: 20 }}
    // >
    //   <div className="p-4">
    //     <h2 className="text-lg font-semibold mb-4">Quiz Topics</h2>
    //     <ul className="space-y-2">
    //       {['History', 'Science', 'Geography', 'Literature'].map((item, index) => (
    //         <motion.li key={item} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
    //           <Button variant="ghost" className="w-full justify-start">{item}</Button>
    //         </motion.li>
    //       ))}
    //     </ul>
    //   </div>
    // </motion.div>
  )

  return (
    <div className="flex h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <motion.header
          className="flex items-center justify-between p-4 border-b"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <motion.h1
              className="text-2xl font-bold ml-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              AI Quiz Chat
            </motion.h1>
          </div>
          {isQuizStarted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setIsQuizStarted(false)}
                aria-label="End Quiz"
                className="rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.header>
        <AnimatePresence mode="wait">
          {!isQuizStarted ? (
            <motion.div
              key="initial"
              className="flex-1 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <form action={startQuiz}>
                <div className="max-w-md w-full space-y-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Brain className="mx-auto h-16 w-16 text-primary" />
                    <h2 className="mt-6 text-3xl font-extrabold text-center">Start a New Quiz</h2>
                    <p className="mt-2 text-sm text-center text-muted-foreground">Enter a topic and let's begin your learning journey!</p>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Input
                      type="text"
                      placeholder="Enter quiz topic..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="text-lg"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      className="w-full text-lg py-6"
                      disabled={!topic.trim()}
                    >
                      <PlayCircle className="mr-2 h-6 w-6" />
                      Start Quiz
                    </Button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar>
                          <AvatarImage src={message.role === 'user' ? "/placeholder.svg?height=40&width=40" : "/placeholder.svg?height=40&width=40"} />
                          <AvatarFallback>{message.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                        </Avatar>
                        <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {message.content}
                          <QuizResult message={message} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {currentQuestion && !isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                  >
                    <h3 className="text-lg font-semibold mb-2">{currentQuestion.question}</h3>
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <motion.button
                          key={index}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${selectedAnswers?.includes(index)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'}`}
                          onClick={() => handleAnswerSelect(index, currentQuestion.correctAnswers.length)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-4"
                      ref={lastSubmitRef}
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswers === undefined}
                    >
                      Submit Answer
                    </Button>
                  </motion.div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function QuizResult({ message: { question, selectedAnswers } }: { message: Message }) {
  if (!question) return null
  const correctAnswers = question.correctAnswers

  return <>
    <div className="mt-2 space-y-1">
      <p className="font-semibold">{question.question}</p>
      {question.options.map((option, optionIndex) => {
        const isCorrect = correctAnswers.includes(optionIndex)
        const isSelected = selectedAnswers?.includes(optionIndex)
        return <div
          key={optionIndex}
          className={`flex items-center space-x-2 p-1 rounded ${isCorrect
            ? 'bg-green-500 text-white'
            : isSelected
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          {isCorrect && <Check className="h-4 w-4" />}
          {isSelected && !correctAnswers.includes(optionIndex) && <X className="h-4 w-4" />}
          <span>{option}</span>
        </div>
      })}
    </div>
  </>
}
