"use client";
import { contactEmail } from "@/actions/emails";
/*import UploadDialog, {
  useUploadDialogState,
} from "@/components/common/uploadDialog";*/
import Form from "@/components/form/form";
//import { RepeaterRender } from "@/components/form/repeater";
import { Button } from "@/components/ui/button";
import { FormField } from "@/resources/resources.types";
import { ContactForm } from "@/validation";
import React from "react";

export default function Contact() {

  const fields: FormField[] = [
    { type: "text", name: "name", label: "Name" },
    { type: "email", name: "email", label: "Email" },
    { type: "checkbox", name: "confirm", label: "Confirm" },
    { type: "textarea", name: "message", rows: 5, label: "Message" },
    { type: "datepicker", name: "startDate", label: "Start date" },
    {
      type: "mediaUploader",
      name: "myfiles",
      label: "Files",
      //onChange: setFiles,
    },
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

  const sendForm = async (data: ContactForm) => {
    console.log("d", data);
    //await contactEmail(data.email, data.name, data.message);
  };

  return (
    <div className="p-4">
      <Form fields={fields} action={sendForm} >
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.name}
              {fields.email}
              {fields.confirm}
              {fields.startDate}
              {fields.message}
              {fields.venueId}
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
