import type { FieldWithTable, FieldWithStudent, Student } from "./Model";
import { TryLimit } from "./Constants";

export default function (
  tables: FieldWithTable[],
  students: FieldWithStudent[],
  mixed = false
): FieldWithTable[] {
  if (!students.length) {
    return tables;
  }
  const studentStore = [...students];
  let currentIndex = 0;
  let tries = 0;
  const arranged: FieldWithTable[] = []; // Result

  while (
    (arranged.length < tables.length || studentStore.length > 0) &&
    currentIndex < tables.length
  ) {
    const currentTable = tables[currentIndex];
    const prevTable = arranged.length
      ? arranged[arranged.length - 1]
      : undefined;
    const randIndex = randomIndex(studentStore.length);
    const { student } =
      randIndex > -1 ? studentStore[randIndex] : { student: undefined };

    if (currentTable.student) {
      arranged.push(currentTable);
      currentIndex = currentIndex + 1;
    } else if (student === undefined) {
      // all students already placed -> push all remaining tables into result
      arranged.push(currentTable);
      currentIndex = currentIndex + 1;
    } else if (
      student &&
      prevTable?.student &&
      (prevTable.student.forbiddenNeighbors.includes(student.name) || // a pair of students ain't allowed to sit next each other
        student.forbiddenNeighbors.includes(prevTable.student.name) ||
        (mixed && areSameGender(student, prevTable.student))) // "Bunte Reihe" same gender must not sit next each other
    ) {
      if (tries < TryLimit) {
        tries = tries + 1; // continue with a new random student
      } else {
        // students are forbidden, tried {TryLimit} random students
        arranged.push(currentTable); // push empty table
        currentIndex = currentIndex + 1;
        tries = 0;
      }
    } else {
      // students are allowed
      currentTable.student = { ...student };
      arranged.push(currentTable);
      studentStore.splice(randIndex, 1); // impure
      currentIndex = currentIndex + 1;
    }
  }

  // TODO
  // Edge case: currentIndex points to the end of tables, but there are students left to place
  // in this case, the loop would never end, because studentStore.length would stay > 0 -> updated while condition fixes that
  // workaround: check if (currentIndex > tables.length - 1)
  // then grab all empty tables from arranged, and invoke sort(emptyTables, remainingStudents)
  return arranged;
}

// Returns a ranom index for randomIndex(array.length) and -1 if array.length is 0
export const randomIndex = (max: number) => Math.ceil(Math.random() * max) - 1;

const areSameGender = (student: Student, prevStudent: Student): boolean => {
  return (
    (student.gender === "male" && prevStudent.gender === "male") ||
    (student.gender === "female" && prevStudent.gender === "female")
  );
};
