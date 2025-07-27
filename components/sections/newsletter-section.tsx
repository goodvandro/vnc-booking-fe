"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface NewsletterSectionProps {
  t: any // Translation object
}

export default function NewsletterSection({ t }: NewsletterSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-gray-200 dark:bg-gray-700">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">{t.newsletterTitle}</h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            {t.newsletterSubtitle}
          </p>
          <form className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
            <Input type="email" placeholder={t.enterYourEmail} className="flex-1 text-sm sm:text-base" />
            <Button type="submit" className="w-full sm:w-auto">
              {t.subscribe}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
