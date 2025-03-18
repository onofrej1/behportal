"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FormField } from "@/types/resources";
import Form from "@/components/form/form";
import { Registration } from "@prisma/client";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import {
  createRegistration,
  getRegistrationByRunId,
  getRegistrationsByRunId,
  updateRegistration,
} from "@/actions/registrations";
import { SquareCheck } from "lucide-react";

export default function Registrations() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["getRegistrationsByRunId", id],
    queryFn: () => getRegistrationsByRunId(Number(id)),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Partial<Registration>>();

  const registrationForm = (data?: Partial<Registration>) => {
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
      {
        name: "dateOfBirth",
        type: "date-picker",
        label: "Date of birth",
        displayFormat: { hour24: "dd/MM/yyyy" },
      },
      { name: "email", type: "text", label: "Email" },
      { name: "nation", type: "country-select", label: "Nation" },
      { name: "club", type: "text", label: "Club" },
      { name: "city", type: "text", label: "City" },
      { name: "paid", type: "switch" },
      { name: "presented", type: "switch" },
      {
        name: "phone",
        type: "phone-input",
        label: "Phone",
        defaultCountry: "SK",
      },
    ];

    return (
      <Form
        fields={fields}
        //validation={CreateEvent}
        action={submitForm}
        data={data}
      >
        {({ fields }) => (
          <>
            <SheetHeader>
              <SheetTitle>
                {selectedRow?.id ? "Update" : "Add"} registration
              </SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>

            <div className="mt-3">
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
                <div className="p-2 flex gap-3 mt-2 justify-between border border-dashed border-gray-400">
                  <div>Presented</div>
                  <div>{fields.presented}</div>
                </div>
                <div className="p-2 flex gap-3 mt-2 justify-between border border-dashed border-gray-400">
                  <div>Paid</div>
                  <div>{fields.paid}</div>
                </div>
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button className="w-full" type="submit">Save registration</Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </Form>
    );
  };

  const submitForm = async (data: Registration) => {
    if (data.id) {
      await updateRegistration(data);
    } else {
      await createRegistration(data);
    }

    queryClient.invalidateQueries({
      queryKey: ["getRegistrationsByRunId", id],
    });
  };

  const openEditRegistrationModal = async (registrationId: number) => {
    const registration = await queryClient.fetchQuery({
      queryKey: ["getRegistration", registrationId],
      queryFn: () => getRegistrationByRunId(registrationId),
    });
    if (registration) {
      setSelectedRow(registration);
      setIsOpen(true);
    }
  };

  const openAddRegistrationModal = () => {
    const data = {
      runId: Number(id),
    };
    setSelectedRow(data);
    setIsOpen(true);
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="max-h-screen overflow-y-scroll">
          {registrationForm(selectedRow)}
        </SheetContent>
      </Sheet>
      <div className="flex justify-between mb-2">
        {data?.run && (
          <h1 className="text-xl">
            {data.run.title} {formatDate(new Date(data.run.event.startDate))}
          </h1>
        )}
        <Button onClick={openAddRegistrationModal}>Add registration</Button>
      </div>

      {data?.registrations && (
        <Table>
          <TableCaption>Registrations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.registrations.map((data) => (
              <TableRow key={data.id}>
                <TableCell>
                  {data.firstName} {data.lastName}
                </TableCell>
                <TableCell>{data.gender === "MALE" ? "M" : "F"}</TableCell>
                <TableCell>{data.phone}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.city}</TableCell>
                <TableCell>{data.club}</TableCell>
                <TableCell>{!data.paid ? <SquareCheck /> : ""}</TableCell>
                <TableCell className="flex gap-2">
                  <Button onClick={() => openEditRegistrationModal(data.id)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
