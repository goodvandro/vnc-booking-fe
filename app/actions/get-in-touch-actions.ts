"use server";

export async function createGetInTouch(t: any, prevState: any, formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Validation with translated messages
    if (!name || !email || !message) {
      return {
        success: false,
        message: t.fillAllFields || "Please fill in all required fields.",
      };
    }

    const payload = {
      data: {
        name,
        email,
        message,
      },
    };

    // Submit to Strapi
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/get-in-touches`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      // Capturar a resposta de erro do Strapi
      const errorData = await response.json();
      console.error("Strapi error response:", errorData);

      // Tratar diferentes tipos de erro do Strapi
      if (response.status === 400) {
        console.log("errorData", errorData);
        // Bad Request - geralmente validação
        if (errorData.error?.details?.errors) {
          // Strapi v4 format
          const validationErrors = errorData.error.details.errors;
          const uniqueError = validationErrors.find((err: any) => 
            err.message?.includes('unique') || 
            err.message?.includes('already exists') ||
            err.message?.includes('duplicate')
          );
          
          if (uniqueError) {
            return {
              success: false,
              message: t.duplicateEntry || "This entry already exists. Please use different information.",
            };
          }
        }
        
        // Outras validações
        return {
          success: false,
          message: errorData.error?.message || t.validationError || "Please check your information and try again.",
        };
      }

      // Outros erros HTTP
      return {
        success: false,
        message: t.serverError || "Server error. Please try again later.",
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: t.messageSentSuccess || "Message sent successfully!",
      data,
    };
  } catch (error) {
    console.error("Error creating get in touch:", error);
    return {
      success: false,
      message: t.messageSentError || "An error occurred while sending your message. Please try again.",
    };
  }
}
