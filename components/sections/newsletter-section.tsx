"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { addNewsLetterContact } from "@/app/actions/news-letter-contact-actions";

interface NewsletterSectionProps {
  t: any;
  user: User | null | undefined;
}

export default function NewsletterSection({ t, user }: NewsletterSectionProps) {
  const addNewsLetterContactWithTranslation = addNewsLetterContact.bind(
    null,
    t
  );
  const [state, formAction, isPending] = useActionState(
    addNewsLetterContactWithTranslation,
    null
  );

  const [email, setEmail] = useState(
    user?.emailAddresses[0].emailAddress || ""
  );

  return (
    <section className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-gray-200 dark:bg-gray-700">
      <div className="section-content text-center">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">
            {t.newsletterTitle}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            {t.newsletterSubtitle}
          </p>
          <form
            action={formAction}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder={t.enterYourEmail}
              className="flex-1 text-sm sm:text-base"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={email === "" || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t?.processing || "Processing..."}
                </>
              ) : (
                t.subscribe || "Subscribe"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
