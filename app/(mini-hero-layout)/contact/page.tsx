"use client";
import { contactEmail } from "@/actions/emails";
/*import UploadDialog, {
  useUploadDialogState,
} from "@/components/common/uploadDialog";*/
import Form from "@/components/form/form";
//import { RepeaterRender } from "@/components/form/repeater";
import { Button } from "@/components/ui/button";
import { FormField } from "@/types/resources";
import { ContactForm, ContactFormType } from "@/validation";
import React from "react";
import "./page.css";

export default function Contact() {
  const fields: FormField[] = [
    { type: "text", name: "name", label: "Name" },
    { type: "email", name: "email", label: "Email" },
    { type: "text", name: "subject", label: "Subject" },
    { type: "textarea", name: "message", rows: 10, label: "Message" },
  ];

  const sendForm = async (data: ContactFormType) => {
    console.log("d", data);
    //await contactEmail(data.email, data.name, data.message);
  };

  return (
    <div className="background">
      <img src="/strazskex.jpg" className="background-imagexx" />
      <div className="flex gap-5 py-6 items-center">
        {/*<div className="flex-1">
        <img
          src="/contact_us.jpg"
          className="object-cover object-center w-full h-full"
        />
      </div>*/}

        <div className="mx-auto min-w-[600px]">
          <h1 className="text-3xl font-bold mb-6">Leave a comment</h1>

          <div className="border border-gray-300 p-4 rounded-xl bg-white">
            <Form fields={fields} action={sendForm} validation={ContactForm}>
              {({ fields }) => (
                <div>
                  <div className="flex flex-col gap-3 pb-4">
                    <div className="flex gap-3">
                      <div className="flex-1">{fields.name}</div>
                      <div className="flex-1">{fields.email}</div>
                    </div>

                    {fields.subject}
                    {fields.message}
                    <Button
                      className="h-[55px] text-lg font-extrabold"
                      type="submit"
                    >
                      Send us message
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
