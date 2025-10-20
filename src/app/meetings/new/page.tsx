"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StepIndicator } from "@/app/components/meetings/StepIndicator"
import { toast } from "sonner"
import { Sparkles, Loader2, Plus, Calendar as CalendarIcon, Clock } from "lucide-react"

export default function NewMeetingPage() {
  const [step, setStep] = useState(1)
  const [loadingAI, setLoadingAI] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    agenda: "",
  })

  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const next = () => setStep((s) => Math.min(s + 1, 3))
  const prev = () => setStep((s) => Math.max(s - 1, 1))

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    try {
      const dateTime = formData.time
        ? new Date(`${formData.date}T${formData.time}`)
        : new Date(formData.date)

      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          date: dateTime,
          agenda: formData.agenda,
        }),
      })
      if (!res.ok) throw new Error("Kunde inte skapa mötet.")
      const newMeeting = await res.json()
      toast.success("✅ Mötet skapades!")
      router.push(`/meetings/${newMeeting.id}`)
    } catch {
      toast.error("Något gick fel vid skapande av mötet.")
    }
  }

  async function handleGenerateAgenda() {
    if (!formData.title.trim()) {
      toast.error("Ange en mötestitel först!")
      return
    }

    setLoadingAI(true)
    try {
      const res = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.title }),
      })
      const data = await res.json()
      if (data.agenda) {
        setFormData((prev) => ({ ...prev, agenda: data.agenda }))
        toast.success("✅ AI-förslag infogat!")
        setTimeout(() => textareaRef.current?.focus(), 200)
      } else {
        toast.error("Inget AI-förslag kunde genereras.")
      }
    } catch {
      toast.error("Fel vid AI-generering.")
    } finally {
      setLoadingAI(false)
    }
  }

  async function handleImproveAgenda() {
    if (!formData.agenda.trim()) {
      toast.error("Ingen dagordning att förbättra.")
      return
    }

    setLoadingAI(true)
    try {
      const res = await fetch("/api/agenda/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agenda: formData.agenda }),
      })
      const data = await res.json()
      if (data.agenda) {
        setFormData((prev) => ({ ...prev, agenda: data.agenda }))
        toast.success("✅ Dagordningen förbättrades!")
        setTimeout(() => textareaRef.current?.focus(), 200)
      } else {
        toast.error("Kunde inte förbättra dagordningen.")
      }
    } catch {
      toast.error("Fel vid språkförbättring.")
    } finally {
      setLoadingAI(false)
    }
  }

  const handleAddPoint = () => {
    const lines = formData.agenda.split("\n").filter((l) => l.trim() !== "")
    const nextNumber = lines.length + 1
    setFormData((prev) => ({
      ...prev,
      agenda:
        prev.agenda +
        (prev.agenda ? "\n" : "") +
        `${nextNumber}. `,
    }))
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-10 bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <motion.div
        className="w-full max-w-3xl rounded-3xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-md shadow-xl border border-white/30 dark:border-gray-800/50 p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Skapa nytt möte
          </h1>
        </div>

        <StepIndicator
          current={step}
          steps={["Grunduppgifter", "Dagordning", "Bekräfta"]}
        />

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {step === 1 && (
            <div className="space-y-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                1. Grunduppgifter
              </h2>
              <Input
                name="title"
                placeholder="Titel på mötet"
                value={formData.title}
                onChange={handleChange}
              />
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <CalendarIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="pl-10 hover:shadow-md transition-all duration-300"
                  />
                </div>
                <div className="relative flex-1">
                  <Clock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <Input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="pl-10 hover:shadow-md transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={next}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-6"
                >
                  Nästa steg →
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                2. Dagordning
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  💡 Tips: Du kan skriva egna punkter eller låta AI föreslå!
                </p>
                <div className="ml-auto flex gap-2">
                  <Button
                    onClick={handleAddPoint}
                    variant="outline"
                    className="rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Lägg till punkt
                  </Button>
                  <Button
                    onClick={handleGenerateAgenda}
                    disabled={loadingAI}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-4"
                  >
                    {loadingAI ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1" /> Föreslå med AI
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Textarea
                ref={textareaRef}
                name="agenda"
                rows={14}
                placeholder="Skriv eller låt AI skapa dagordningen..."
                value={formData.agenda}
                onChange={handleChange}
                className="transition-all duration-300 focus:ring-2 focus:ring-indigo-400 min-h-[300px]"
              />

              {loadingAI && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-indigo-500 flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI arbetar med din dagordning...
                </motion.div>
              )}

              {formData.agenda && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ✏️ {formData.agenda.split("\n").filter(Boolean).length} punkter i dagordningen
                </p>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prev}
                  className="rounded-full border-gray-300 dark:border-gray-700"
                >
                  ← Tillbaka
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleImproveAgenda}
                    disabled={loadingAI}
                    className="rounded-full border-gray-300 dark:border-gray-700"
                  >
                    ✨ Förbättra språk
                  </Button>
                  <Button
                    onClick={next}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-6"
                  >
                    Nästa steg →
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                3. Bekräfta & skapa möte
              </h2>
              <div className="p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
                <p>
                  <strong>Titel:</strong> {formData.title || "–"}
                </p>
                <p>
                  <strong>Datum:</strong> {formData.date || "–"}{" "}
                  {formData.time && `kl. ${formData.time}`}
                </p>
                <div>
                  <strong>Dagordning:</strong>
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground mt-1">
                    {formData.agenda || "Ingen dagordning angiven"}
                  </pre>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prev}
                  className="rounded-full border-gray-300 dark:border-gray-700"
                >
                  ← Tillbaka
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-6"
                >
                  ✅ Skapa möte
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
