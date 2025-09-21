"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import type { User } from "@clerk/nextjs/server";
import { createGetInTouch } from "@/app/actions/get-in-touch-actions";
import { Loader2 } from "lucide-react";

interface ContactSectionProps {
  t: any; // Translation object
  user: User | null | undefined;
}

export default function ContactSection({ t, user }: ContactSectionProps) {
  // Bind the translation object to the action
  const createGetInTouchWithTranslation = createGetInTouch.bind(null, t);
  const [state, formAction, isPending] = useActionState(createGetInTouchWithTranslation, null);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user?.firstName || "");
      setEmail(user?.emailAddresses[0].emailAddress || "");
    }
  }, [user]);

  return (
    <section
      id="contact-form"
      className="section-container w-full py-12 md:py-16 lg:py-24 xl:py-32"
    >
      <div className="section-content text-center">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-gray-700">
            {t.getInTouchTitle}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            {t.getInTouchSubtitle}
          </p>

          <form
            action={formAction}
            className="space-y-4 max-w-md mx-auto text-left"
          >
            {/* Error Message */}
            {state?.success === false && (
              <div className="p-4 border border-red-200 rounded-lg">
                <p className="text-red-800">{state.message}</p>
              </div>
            )}
            {/* Success Message */}
            {state?.success === true && (
              <div className="p-4 border border-green-200 rounded-lg">
                <p className="text-green-800">{state.message}</p>
              </div>
            )}
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-1"
              >
                {t.firstName}
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t.yourName}
                className="text-sm sm:text-base"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="email-contact"
                className="block text-sm font-medium text-foreground mb-1"
              >
                {t.email}
              </Label>
              <Input
                id="email-contact"
                name="email"
                type="email"
                placeholder={t.yourEmail}
                className="text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="message"
                className="block text-sm font-medium text-foreground mb-1"
              >
                {t.message}
              </Label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder={t.yourMessage}
                value={message}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t?.processing || "Processing..."}
                </>
              ) : (
                `${t?.sendMessage || "Send Message"}`
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
