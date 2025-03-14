"use client";
import { ResetPassword } from "@/actions/auth";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/types/resources";
import { useSearchParams } from "next/navigation";
import React from "react";
import { ResetPassword as ResetPasswordRules } from '@/validation';
export default function ResetPasswordPage() {
  const fields: FormField[] = [
    { name: "password", type: "text", label: "Password" },
  ];
  const searchParams = useSearchParams();

  const sendForm = async (data: { password: string }) => {
    await ResetPassword(
      searchParams.get("id")!,
      searchParams.get("token")!,
      data.password
    );
  };

  return (
    <>
      <Form fields={fields} validation={ResetPasswordRules} action={sendForm}>
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.password}
              {/* fields.confirmPassword */}
              <Button type="submit">Send</Button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
}
