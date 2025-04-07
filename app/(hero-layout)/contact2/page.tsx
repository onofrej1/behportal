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

export default function Contact() {

  const fields: FormField[] = [
    { type: "text", name: "name", label: "Name" },
    { type: "email", name: "email", label: "Email" },
    { type: "textarea", name: "message", rows: 5, label: "Message" },
  ];

  const sendForm = async (data: ContactFormType) => {
    console.log("d", data);
    //await contactEmail(data.email, data.name, data.message);
  };

  return (
    <div className="flex">
    <div className="flex-1">
      <Form fields={fields} action={sendForm} validation={ContactForm} >
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.name}
              {fields.email}
              {fields.message}
              <Button type="submit">Send</Button>
            </div>
          </div>
        )}
      </Form>
    </div>
    <div className="flex-1">
      <img src='/uploads/img1.jpg' className="object-cover object-center w-full h-full" />
    </div>
    </div>
  );
}
