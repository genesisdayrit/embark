import { Children, useState } from "react";
import "../App.css";

type SectionProps = {
  label?: string;
  children?: React.ReactNode;
};

function Section({ children }: SectionProps) {
  return (
    <div className="flex flex-col md:flex-row w-full border-b border-gray-300 py-10 gap-10">
      {children}
    </div>
  );
}

function Left({ children }: SectionProps) {
  return (
    <div className="w-[30%] text-4xl font-bold">
      {children}
    </div>
  );
}

function Right({ children }: SectionProps) {
  return (
    <div className="w-[70%] ml-20 items-start flex flex-col gap-10 text-2xl">
      {children}
    </div>
  );
}

function Row({ label, children }: SectionProps) {
  return (
    <div>
      <p className="font-bold">{label}</p>
      <p className="text-gray-500">{children}</p>
    </div>
  )
}

Section.Left = Left
Section.Right = Right
Section.Row = Row

export { Section }
