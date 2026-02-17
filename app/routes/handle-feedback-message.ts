import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";

import feedbackModel from "~/models/Feedback";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const message = formData.get("messageContent");
  const privacyAgreement = formData.get("privacyAgreement");
  const date = formData.get("date");
  const honeypot = formData.get("website");

  //Validate form
  const formValidationErrors: Record<string, boolean> = {};

  if (!email || typeof email !== "string") {
    formValidationErrors.invalidEmail = true;
  }

  if (!privacyAgreement) {
    formValidationErrors.uncheckedPrivacyAgreement = true;
  }

  if (!message || typeof message !== "string") {
    formValidationErrors.invalidMessage = true;
  }

  //Reject too-fast requests (But mimic as success)
  if (Date.now() < Number(date) + 3000) {
    return Response.json({
      success: true,
      responseId: Date.now(),
    });
  }

  //Reject stale forms
  if (Date.now() > Number(date) + 160000) {
    return Response.json({
      success: false,
      errors: {
        staleForm: true,
      },
      responseId: Date.now(),
    });
  }

  //Check honeypot
  if (honeypot) {
    return Response.json({
      success: true,
      responseId: Date.now(),
    });
  }

  if (Object.keys(formValidationErrors).length > 0) {
    return Response.json({
      success: false,
      errors: formValidationErrors,
      responseId: Date.now(),
    });
  }

  try {
    await feedbackModel.create({
      email,
      message,
    });

    return Response.json({
      success: true,
      responseId: Date.now(),
    });
  } catch (error) {
    return Response.json({
      success: false,
      errors: {
        serverSideError: true,
      },
      responseId: Date.now(),
    });
  }
};
