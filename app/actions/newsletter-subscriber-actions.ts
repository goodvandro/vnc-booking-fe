"use server";

export async function addNewsLetterSubscriber(
  t: any,
  prevState: any,
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;

    // Validation with translated messages
    if (!email) {
      return {
        success: false,
        message: t.fillAllFields || "Please fill in all required fields.",
      };
    }

    const payload = { data: { email } };

    // Submit to Strapi
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/newsletter-subscribers`,
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
      const errorData = await response.json();
      console.error("Strapi error response:", errorData);

      if (response.status === 400) {
        if (errorData.error?.details?.errors) {
          const validationErrors = errorData.error.details.errors;
          const uniqueError = validationErrors.find(
            (err: any) =>
              err.message?.includes("unique") ||
              err.message?.includes("already exists") ||
              err.message?.includes("duplicate")
          );

          if (uniqueError) {
            return {
              success: true,
              message:
                t.duplicateEntry ||
                // "This entry already exists. Please use different information.",
                ""
            };
          }
        }

        return {
          success: false,
          message:
            errorData.error?.message ||
            t.validationError ||
            "Please check your information and try again.",
        };
      }

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
      message:
        t.messageSentError ||
        "An error occurred while sending your message. Please try again.",
    };
  }
}
