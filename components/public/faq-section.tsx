import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Faq = {
  id: string;
  question: string;
  answer: string;
};

type FaqSectionProps = {
  faqs: Faq[];
};

export function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vmk-green">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vmk-ink sm:text-4xl">
            Answers before you step on court
          </h2>
        </div>

        <Accordion className="mt-10">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="py-4 text-base font-medium text-vmk-ink hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
