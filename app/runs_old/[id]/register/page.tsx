"use client";
import { createRegistration } from "@/actions/runs";
import Form from "@/components/form/form";
import { Button } from "@/components/flowbite/button";
import { FormField } from "@/types/resources";
import { CreateRegistration } from "@/validation";
import { Registration } from "@prisma/client";
import { useParams } from "next/navigation";
import React from "react";

export default function Register() {
  const params = useParams();

  const fields: FormField[] = [
    { name: "runId", type: "hidden" },
    { name: "firstName", label: "First name", type: "text" },
    { name: "lastName", label: "Last name", type: "text" },
    {
      name: "gender",
      type: "select",
      label: "Gender",
      options: [
        { label: "Man", value: "MALE" },
        { label: "Woman", value: "FEMALE" },
      ],
    },
    { name: "dateOfBirth", type: "date-picker", label: "Date of birth" },
    { name: "email", type: "text", label: 'Email' },

    { name: "nation", type: "country-select", label: 'Nation' },
    { name: "club", type: "text", label: 'Club' },
    { name: "city", type: "text", label: 'City' },
    { name: "phone", type: "phone-input", label: 'Phone', defaultCountry: 'SK' },
    { name: "confirm", type: "checkbox", label: "Confirm submit" },
  ];

  const sendRegistration = async (data: Registration) => {
    console.log(data);
    //await createRegistration(data);
  };

  return (
    <>
      <Form
        fields={fields}
        validation={CreateRegistration}
        data={{ runId: params.id, nation: 'SVK' }}
        action={sendRegistration}
      >
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.firstName}
              {fields.lastName}
              <div className="flex gap-3">
                <div className="flex-1">{fields.gender}</div>
                <div className="flex-1">{fields.dateOfBirth}</div>
              </div>
              {fields.email}
              {fields.nation}
              <div className="flex gap-3">
                <div className="flex-1">{fields.club}</div>
                <div className="flex-1">{fields.city}</div>
              </div>
              {fields.phone}
              <Button type="submit">Send registration</Button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
}
