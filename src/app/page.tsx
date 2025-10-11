import Hero from "@/app/components/layout/Hero";
import { Card } from "@/app/components/ui/Card";
import { CalendarDays, Brain, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20">
      <Hero />

      <section className="grid sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 pb-16">
        <Card>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[var(--moteva-blue)]" />
            Skapa dagordning
          </h3>
          <p className="text-[var(--moteva-subtext)]">
            Ange mötesinfo – Moteva genererar en färdig dagordning på svenska direkt.
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-[var(--moteva-green)]" />
            AI som förstår föreningar
          </h3>
          <p className="text-[var(--moteva-subtext)]">
            Tränad på svensk möteskultur – AI skriver som en sekreterare.
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--moteva-blue)]" />
            Exportera som PDF
          </h3>
          <p className="text-[var(--moteva-subtext)]">
            Ladda ner eller dela dina protokoll direkt – snyggt och formellt.
          </p>
        </Card>
      </section>
    </div>
  );
}
