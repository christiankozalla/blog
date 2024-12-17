import type {
  FieldWithTable,
  FieldWithStudent,
  Student,
} from "../src/lib/Model";
import { Field } from "../src/lib/Model";
import arrange from "../src/lib/Arrange";
import { mockFields } from "./fields.mock";

test("Class Field produces a deep copy of field", () => {
  // arrange
  const field = new Field({
    id: "gef",
    position: [1, 2],
    isTable: false,
    student: {
      id: "csx",
      name: "Christian",
      gender: "male",
      alone: false,
      row: undefined,
      forbiddenNeighbors: [],
    } as Student,
  });

  // act - generate a deep copy of field
  const newField = new Field(field);

  // change properties of newField
  newField.id = "newid";
  if (newField.student) {
    newField.student.name = "Robert";
    newField.student.alone = true;
  }

  // assert
  expect(field.id).toBe("gef"); // the id stays the same
  expect(field.student && field.student.name).toBe("Christian"); // nested properties in a deep copy
  expect(field.student && field.student.alone).toBe(false); // should stay the same! (no side-effect from mutating newField.student)

  expect(newField.id).toBe("newid");
  expect(newField.student && newField.student.name).toBe("Robert");
  expect(newField.student && newField.student.alone).toBe(true);
});

test("Empty students array returns input tables", () => {
  // arrange
  const tables = [
    { id: "abc", isTable: true, student: undefined, position: [0, 0] },
    { id: "def", isTable: true, student: undefined, position: [4, 2] },
  ] as FieldWithTable[];

  // act
  const result = arrange(tables, []); // TypeScript prevents passing undefined, etc...

  // assert
  expect(result).toEqual(tables);
});

test("Returns as many students as were put in", () => {
  // arrange
  const tables = mockFields
    .filter((field) => field.isTable) // as FieldWithTable[];
    .map((field) => new Field(field)) as FieldWithTable[];
  const students = mockFields
    .filter((field) => field.student !== undefined) //as FieldWithStudent[];
    .map((field) => new Field(field)) as FieldWithStudent[];

  // act
  const result = arrange(tables, students);

  // assert
  expect(students.length).toBeLessThanOrEqual(tables.length); // arrange should probably check for that...
  expect(result.length).toEqual(tables.length);
});
