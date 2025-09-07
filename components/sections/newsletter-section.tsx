"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { useActionState, useState, useEffect } from "react";
import { Loader2, Check, X } from "lucide-react";
import { addNewsLetterSubscriber } from "@/app/actions/newsletter-subscriber-actions";

interface NewsletterSectionProps {
  t: any;
  user: User | null | undefined;
}

export default function NewsletterSection({ t, user }: NewsletterSectionProps) {
  const addNewsLetterContactWithTranslation = addNewsLetterSubscriber.bind(
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

  // Estados para controlar as mensagens temporárias
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Effect para mostrar mensagens temporárias baseadas no state
  useEffect(() => {
    if (state?.success === true) {
      setShowSuccessMessage(true);
      setShowErrorMessage(false);

      // Limpar o email após sucesso
      setEmail("");

      // Remover mensagem de sucesso após 5 segundos
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else if (state?.success === false) {
      setShowErrorMessage(true);
      setShowSuccessMessage(false);

      // Remover mensagem de erro após 5 segundos
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state]);

  // Função para determinar o conteúdo do botão
  const getButtonContent = () => {
    if (isPending) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t?.processing || "Processing..."}
        </>
      );
    }

    if (showSuccessMessage) {
      return (
        <>
          <Check className="mr-2 h-4 w-4" />
          {t?.subscribed || "Subscribed"}
        </>
      );
    }

    if (showErrorMessage) {
      return (
        <>
          <X className="mr-2 h-4 w-4" />
          {t?.tryAgainLater || "Try again later"}
        </>
      );
    }

    return t.subscribe || "Subscribe";
  };

  // Função para determinar a classe do botão baseada no estado
  const getButtonClassName = () => {
    const baseClasses = "w-full sm:w-auto transition-colors duration-300";

    if (showSuccessMessage) {
      return `${baseClasses} bg-green-600 hover:bg-green-700 focus:bg-green-700`;
    }

    if (showErrorMessage) {
      return `${baseClasses} bg-red-600 hover:bg-red-700 focus:bg-red-700`;
    }

    return baseClasses;
  };

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
              disabled={isPending || showSuccessMessage || showErrorMessage}
            />
            <Button
              type="submit"
              className={getButtonClassName()}
              disabled={
                email === "" ||
                isPending ||
                showSuccessMessage ||
                showErrorMessage
              }
            >
              {getButtonContent()}
            </Button>
          </form>

          {/* Mostrar mensagem de erro abaixo do formulário se necessário */}
          {showErrorMessage && state?.message && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              {state.message}
            </p>
          )}

          {/* Mostrar mensagem de sucesso abaixo do formulário se necessário */}
          {showSuccessMessage && state?.message && (
            <p className="text-green-600 dark:text-green-400 text-sm mt-2">
              {state.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
