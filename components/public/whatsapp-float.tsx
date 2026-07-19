"use client";

import { MessageCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrialBookingForm } from "@/components/public/trial-booking-form";
import { EnquiryForm } from "@/components/public/enquiry-form";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type ProgramOption = { name: string; slug: string };

type WhatsAppFloatProps = {
  phone: string;
  academyName: string;
  programOptions: ProgramOption[];
};

export function WhatsAppFloat({
  phone,
  academyName,
  programOptions,
}: WhatsAppFloatProps) {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Book a trial or enquire"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vmk-green"
      >
        <MessageCircle className="size-7" fill="currentColor" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border bg-vmk-green px-4 py-5 text-left text-white">
          <SheetTitle className="font-display text-lg font-bold text-white">
            Get in touch
          </SheetTitle>
          <SheetDescription className="text-white/75">
            Book a free trial or send an enquiry — same forms as on our contact
            page.
          </SheetDescription>
        </SheetHeader>

        <div className="p-4">
          <Tabs defaultValue="trial" className="gap-4">
            <TabsList className="grid h-auto w-full grid-cols-2 p-1">
              <TabsTrigger
                value="trial"
                className="px-3 py-2 data-active:bg-vmk-green data-active:text-white"
              >
                Book a trial
              </TabsTrigger>
              <TabsTrigger
                value="enquiry"
                className="px-3 py-2 data-active:bg-vmk-green data-active:text-white"
              >
                Enquiry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trial" className="mt-0">
              <TrialBookingForm
                programOptions={programOptions}
                idPrefix="float-trial"
                showAnchor={false}
                className="border-0 p-0 shadow-none sm:p-0"
              />
            </TabsContent>

            <TabsContent value="enquiry" className="mt-0">
              <EnquiryForm
                programOptions={programOptions}
                idPrefix="float-enquiry"
                showAnchor={false}
                className="border-0 p-0 shadow-none sm:p-0"
              />
            </TabsContent>
          </Tabs>

          <a
            href={whatsappHref(
              phone,
              `Hi ${academyName}, I'd like to know more about your programs.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "mt-6 w-full justify-center border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10"
            )}
          >
            <MessageCircle className="size-4" />
            Or chat on WhatsApp
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
