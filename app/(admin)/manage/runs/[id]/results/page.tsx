"use client";
import { getResultsByRunId } from "@/actions/results";
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
import { RunResult } from "@prisma/client";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { updateRunResult } from "@/actions/results";

export default function Results() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  //const { value: results = [] } = useAsync(() => getResultsByRunId(Number(id)));
  const { data, isFetching } = useQuery({
    queryKey: ["getResults", id],
    queryFn: () => getResultsByRunId(Number(id)),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Partial<RunResult>>();

  const resulsForm = (data?: Partial<RunResult>) => {
    let fields: FormField[] = [
      { name: "rank", label: "Rank", type: "number" },
      { name: "bib", label: "Bib", type: "text" },
      { name: "name", label: "Name", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "yearOfBirth", label: "Year of birth", type: "date-picker" },
      { name: "club", label: "Club", type: "text" },
      { name: "gender", label: "Gender", type: "text" },
      { name: "time", label: "Time", type: "datetime-picker" },
    ];
    if (data?.id) {
      fields = fields.concat([{ name: "id", type: "hidden" }]);
    }

    return (
      <Form
        fields={fields}
        //validation={CreateEvent}
        action={sendForm}
        data={data}
      >
        {({ fields }) => (
          <>
            <SheetHeader>
              <SheetTitle>
                {selectedRow?.id ? "Update" : "Add"} event
              </SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-3 pb-4">
              {fields.name}
              <div className="flex gap-2">
                <div className="flex-1">{fields.rank}</div>
                <div className="flex-1">{fields.bib}</div>
              </div>
              {fields.category}
              {fields.club}
              {fields.yearOfBirth}
              {fields.gender}
              {fields.time}
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </Form>
    );
  };

  const sendForm = async (data: Partial<RunResult>) => {
    await updateRunResult(data);
    queryClient.invalidateQueries({ queryKey: ['getResults', id]});
  };

  const openEditResultsModal = async (runResult: Partial<RunResult>) => {
    setSelectedRow(runResult);
    setIsOpen(true);    
  };

  const openAddResultsModal = () => {
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
          {resulsForm(selectedRow)}
        </SheetContent>
      </Sheet>
      <div className="flex justify-between mb-2">
        {data?.run && <h1 className="text-xl">{data.run.title} {formatDate(new Date(data.run.event.startDate))}</h1>}
        <Button onClick={openAddResultsModal}>Add new</Button>
      </div>      

      {data?.results && (
        <Table>
          <TableCaption>Results</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Bib</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Year of Birth</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Time</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((data) => (
              <TableRow key={data.name}>
                <TableCell>{data.rank}</TableCell>
                <TableCell>{data.bib}</TableCell>
                <TableCell>{data.category}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.yearOfBirth}</TableCell>
                <TableCell>{data.club}</TableCell>
                <TableCell>{data.gender}</TableCell>
                <TableCell>{data.time}</TableCell>
                <TableCell className="flex gap-2">
                  <Button onClick={() => openEditResultsModal(data)}>
                    Edit
                  </Button>
                  <Button variant={'destructive'} onClick={() => openEditResultsModal(data)}>
                    Delete
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
