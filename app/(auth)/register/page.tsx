"use client";
import { register } from "@/actions/auth";
import Form, { DefaultFormData } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/types/resources";
import { type FormState } from "react-hook-form";

export default function RegisterPage() {
  const fields: FormField[] = [
    { name: 'firstName', type: 'text', label: 'First name' },
    { name: 'lastName', type: 'text', label: 'Last name' },
    { name: 'email', type: 'text', label: 'Email' },
    { name: 'password', type: 'text', label: 'Password' },
    //{ name: 'confirm', type: 'checkbox', label: 'Confirm submit' }
  ];

  const buttons = [
    ({ isValid, isLoading }: Partial<FormState<DefaultFormData>>) => {
      console.log(isValid);
      console.log(isLoading);
      return <Button key="submit" type="submit" className="mt-3">Register user</Button>
    }
  ];

  return (
    <>
      <Form
        fields={fields}
        validation={'RegisterUser'}
        buttons={buttons}
        action={register}
      />
    </>

  );
}
