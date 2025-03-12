"use client";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/auth";
import { redirect } from "next/navigation";
import { FormField } from "@/types/resources";
import { LoginUser } from "@/validation";

export default function LoginPage() {
  //const { data: session, status } = useSession();
  
  const fields: FormField[] = [
    { name: 'email', type: 'text', label: 'Email' },
    { name: 'password', type: 'text', label: 'Password' },
  ];

  const buttons = [
    () => {
      return <Button key="submit" type="submit" className="mt-3">Login</Button>
    }
  ];

  const googleLogin = () => {
    redirect('/api/oauth/google/login');
  };

  const githubLogin = () => {
    redirect('/api/oauth/github/login');
  };

  const register = () => {
    redirect('/register');
  };  

  return (
    <div className="flex flex-col gap-3">
      <Form
        fields={fields}
        validation={LoginUser}
        buttons={buttons}
        action={login}
      />
      <Button onClick={googleLogin} >Google login</Button>
      <Button onClick={githubLogin} >Github login</Button>
      <Button onClick={register} >Register</Button>
    </div>

  );
}

