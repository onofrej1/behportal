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
    { type: "checkbox", name: "confirm", label: "Confirm" },
    { type: "switch", name: "sendEmail", label: "Send email" },
    { type: "textarea", name: "message", rows: 5, label: "Message" },
    { type: "phone-input", name: "phone_test", label: "Phone" },
    { type: "date-picker", name: "startDate", label: "Start date" },
    { type: "datetime-picker", name: "endDate", label: "End date" },
    {
      type: "repeater",
      name: "tags",
      fields: [
        { type: "text", name: "name", label: "Name" },
        { type: "text", name: "description", label: "Description" },
      ],
      //render,
    },
  ];

  const sendForm = async (data: ContactFormType) => {
    console.log("d", data);
    //await contactEmail(data.email, data.name, data.message);
  };

  return (
    <div className="p-4">
      <Form fields={fields} action={sendForm} validation={ContactForm} >
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.name}
              {fields.email}
              {fields.confirm}
              {fields.startDate}
              {fields.endDate}
              {fields.sendEmail}
              {fields.message}
              {fields.venueId}
              {fields.phone_test}
              {fields.tags}
              {/*fields.myfiles*/}
              <Button type="submit">Contact</Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
