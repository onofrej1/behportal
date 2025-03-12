"use client";
import { getRunById } from "@/actions/runs";
import FileUploader from "@/components/form/file-uploader";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
//import Table from "@/components/table/table";
import { hmsToSeconds, parseCsv } from "@/lib/utils";
import { createResults } from "@/actions/results";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FormField } from "@/types/resources";
import Form from "@/components/form/form";
import { z } from "zod";

export default function Run() {
  const { id } = useParams();
  const [uploadData, setUploadData] = useState<any[]>();
  const { data: run, isFetching } = useQuery({
    queryKey: ["getRunById"],
    queryFn: () => getRunById(Number(id)),
  });
  if (isFetching || !run) return;

  const fileUpload = (data: { file: File }) => {
    const { file } = data;
    const formData = new FormData();
    formData.append("file", file, file.name); 
    const formObject = Object.fromEntries(formData.entries());
    const reader = new FileReader();

    reader.onload = function (e: any) {
      const content = e.target.result;
      const requiredHeaders = ['rank', 'bib', 'name', 'category', 'time', 'club', 'gender', 'yearOfBirth'];
      const csvData = parseCsv(content, requiredHeaders);
      setUploadData(csvData);   
    };
    reader.readAsText(formObject['myFile'] as Blob);
  };

  const headers = [
    { name: 'name', header: 'Name'},
    { name: 'time', header: 'Time'},
    { name: 'rank', header: 'Rank'}
  ];
  
  const saveResults = () => {
    if (uploadData && uploadData?.length > 0) {
      const data = uploadData.map(d => {
        d.runId = id;
        d.time = hmsToSeconds(d.time);
        return d;        
      });
      createResults(data);
    }    
  }

  const sortData = (sortBy: string, sortDir: string) => {
    if (!uploadData) return;
    let data = uploadData;
    if (sortBy === 'name') {
      data = uploadData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rank') {
      data = uploadData.sort((a, b) => b.rank - a.rank)
    }
    setUploadData([...data]);
  }

  const fields: FormField[] = [
    { type: "upload", name: "results", label: "Results" },
  ];

  return (
    <div>
      Run {run.title} {run.distance} km Upload results
      <Form fields={fields} validation={z.any}>
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.results}
            </div>
          </div>
        )}
      </Form>
      {/*uploadData && uploadData.length > 0 && <Table
        headers={headers}
        data={uploadData}
        totalRows={uploadData.length}
        onSort={sortData}
      />*/}

    {uploadData && <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {uploadData.map((data) => (
          <TableRow key={data.name}>
            <TableCell>{data.rank}</TableCell>
            <TableCell>{data.bib}</TableCell>
            <TableCell>{data.yearOfBirth}</TableCell>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.category}</TableCell>
            <TableCell>{data.time}</TableCell>
            <TableCell>{data.club}</TableCell>
            <TableCell>{data.gender}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>}

      <Button onClick={saveResults}>Save results</Button>
    </div>
  );
}
