import { Dispatch, ReactElement, SetStateAction } from "react";

export type Position = [number, number];

export type Student = {
  id: string;
  name: string;
  gender: GenderTypes | undefined;
  row: RowTypes | undefined;
  forbiddenNeighbors: string[];
  alone: boolean;
};

export type GenderTypes = "male" | "female";
export type RowTypes = "first" | "last";

export type Trashed = {
  trashed: boolean;
};

export type MetaKeys = "roomName" | "className" | "columns" | "rows";
export type TrashedField = Field & Trashed;
export type PositionObserver<T> = Dispatch<SetStateAction<T>> | null;

export type FieldProps = {
  id: string;
  position: Position;
  isTable: boolean;
  student?: Student;
};

export type StorageData = {
  className: string;
  roomName: string;
  rows: number;
  columns: number;
  fields: Field[];
};

export class Field {
  id: string;
  position: Position;
  isTable: boolean;
  student: Student | undefined;

  constructor({ id, position, isTable, student }: FieldProps) {
    this.id = id;
    this.position = position;
    this.isTable = isTable;
    this.student = student ? { ...student } : undefined;
  }
}

export type FieldWithStudent = Field & {
  student: Student;
};

export type FieldWithTable = Field & {
  isTable: true;
};

export type ModalConfig = {
  isOpen: boolean;
  title: string;
  field?: Field;
  component?: ReactElement;
};
