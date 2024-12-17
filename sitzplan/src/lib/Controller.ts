import {
  TrashedField,
  PositionObserver,
  MetaKeys,
  Field,
  Student,
  StorageData,
  FieldWithStudent,
  FieldWithTable,
  ModalConfig,
} from "./Model";
import { generateDataUrl } from "./Utils";

export class Controller {
  private room: { [id: Field["id"]]: Field } = {};
  private bin: TrashedField[] = [];
  private classroomKey = "";

  private rows = 10;
  private columns = 10;

  private roomName = "";
  private className = "";

  constructor(
    className = "",
    roomName = "",
    rows = 10,
    columns = 10,
    fields: Field[] = []
  ) {
    this.init({ className, roomName, rows, columns, fields });
  }

  public init({
    className = "",
    roomName = "",
    rows = 10,
    columns = 10,
    fields,
  }: StorageData) {
    this.room = this.generateRoom(rows, columns, fields);

    this.rows = rows;
    this.columns = columns;
    this.className = className;
    this.roomName = roomName;
    this.classroomKey = this.generateId();
  }

  public getClassroomKey() {
    return this.classroomKey;
  }

  public getRoomName() {
    return this.roomName;
  }

  public getClassName() {
    return this.className;
  }

  public getDimension(direction: "rows" | "cols"): number {
    return direction === "rows" ? this.rows : this.columns;
  }

  private generateRoom(
    rows: number,
    cols: number,
    fieldsData: Field[]
  ): { [id: Field["id"]]: Field } {
    const fields: Field[] = [];

    // An existing room can be regenerated with a different number of rows or columns
    // Here existing data is moved to newly created fields
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const field = fieldsData.find(
          ({ position: [fieldX, fieldY] }) => fieldX === x && fieldY === y
        );

        fields.push(
          new Field({
            id: this.generateId(),
            position: [x, y],
            isTable: field?.isTable ?? false,
            student: field?.student,
          })
        );
      }
    }

    const room = {};

    fields.forEach((field) => {
      Object.assign(room, { [field.id]: field });
    });

    return room;
  }

  private roomObservers: {
    id: string;
    updateUi: PositionObserver<any>[];
  }[] = [];
  private classroomObserver: PositionObserver<string> | undefined;

  public observeClassroomKey(o: PositionObserver<string>) {
    this.classroomObserver = o;
  }

  public toggleModal(isOpen: boolean, field?: Field) {
    this.emitChange("appModal", {
      isOpen,
      title: "Editor",
      field,
    });
  }

  private generateId() {
    return "_" + (Math.random() * 30).toString(36).slice(4, 16);
  }

  public getFields() {
    return Object.values(this.room);
  }

  public getFieldById(id: Field["id"]): Field {
    return this.room[id];
  }

  public getFieldByRow(row: number): Field | undefined {
    return this.getFields().find(
      (field) => field.position[1] === row && field.isTable && !field.student
    );
  }

  public setStudent(id: Field["id"], newStudent: Partial<Student>) {
    const field = this.room[id];

    if (field.student) {
      const newField = {
        ...field,
        student: {
          ...field.student,
          ...newStudent,
        },
      };

      this.room[id] = newField;
      this.emitChange(id, this.room[id]);
    }
  }

  public observe(
    id: string,
    setStateAction: PositionObserver<any>
  ): () => void {
    const index = this.roomObservers.findIndex(
      (observer) => observer.id === id
    );

    if (index > -1) {
      this.roomObservers[index] = {
        id,
        updateUi: [...this.roomObservers[index].updateUi, setStateAction],
      };
    } else {
      this.roomObservers.push({ id, updateUi: [setStateAction] });
    }

    return (): void => {
      this.roomObservers = this.roomObservers.filter((t) => t.id !== id);
    };
  }

  public removeObserver(id: string, setStateAction: PositionObserver<any>) {
    this.roomObservers.forEach((observer) => {
      if (observer.id === id) {
        observer.updateUi = observer.updateUi.filter(
          (updateAction) => updateAction !== setStateAction
        );
      }
    });
  }

  // MetaData are the name of the class and room, and number of rows and columns
  public updateMetaData(id: MetaKeys, newValue: string) {
    if (id === "className" || id === "roomName") {
      this[id] = newValue;
    } else {
      // regenerate the whole room and update the classroomKey to trigger re-render
      const fieldsWithStudentsAndTables = this.getFields().filter(
        (field) => field.student || field.isTable
      ) as Field[];

      // Number of rows is updated
      if (id === "rows") {
        const newRows = Number(newValue);

        this.room = this.generateRoom(
          newRows,
          this["columns"],
          fieldsWithStudentsAndTables
        );
        this.updateClassroom();

        // Number of columns is updated
      } else if (id === "columns") {
        const newCols = Number(newValue);

        this.room = this.generateRoom(
          this["rows"],
          newCols,
          fieldsWithStudentsAndTables
        );
        this.updateClassroom();
      }

      this[id] = Number(newValue);
    }
    this.emitChange(id, newValue);
  }

  public updateClassroom() {
    this.classroomKey = this.generateId();
    typeof this.classroomObserver === "function" &&
      this.classroomObserver(this.classroomKey);
  }
  public moveStudent(
    originId: Field["id"],
    destinationId: Field["id"],
    moveTable = false
  ): void {
    const destinationField = {
      ...this.room[destinationId],
    };

    this.room[destinationId] = {
      ...this.room[destinationId],
      student: this.room[originId].student,
      isTable: moveTable
        ? this.room[originId].isTable
        : this.room[destinationId].isTable,
    };

    this.room[originId] = {
      ...this.room[originId],
      student: destinationField.student,
      isTable: moveTable
        ? destinationField.isTable
        : this.room[originId].isTable,
    };

    this.emitChange(originId, this.room[originId]);
    this.emitChange(destinationId, this.room[destinationId]);
  }

  public toggleTable(id: Field["id"]) {
    const field = { ...this.room[id], isTable: !this.room[id].isTable };
    this.room[id] = new Field({ ...field });
    this.emitChange(field.id, field);
  }

  public assignNewStudent(name: string): void {
    const emptyField = this.findTable();

    if (emptyField) {
      const newField = new Field({
        ...emptyField,
        student: {
          id: this.generateId(),
          name,
          gender: undefined,
          forbiddenNeighbors: [],
          row: undefined,
          alone: false,
        },
      });

      this.room[emptyField.id] = newField;
      this.emitChange(newField.id, newField);
    }
  }

  public resetField(field: Field): void {
    this.bin.unshift({ ...this.room[field.id], trashed: true });

    this.room[field.id] = {
      ...this.room[field.id],
      student: undefined,
      isTable: false,
    };

    this.emitChange(field.id, this.room[field.id]);
    this.emitChange("recycleBin", this.bin);
  }

  public restoreField(field: TrashedField, destinationId?: string): void {
    const id = destinationId || field.id;

    this.bin = this.bin.filter((trashedField) => trashedField.id !== field.id);

    this.room[id] = {
      id,
      isTable: field.isTable,
      student: field.student,
      position: this.room[id].position,
    };

    this.emitChange(id, this.room[id]);
    this.emitChange("recycleBin", this.bin);
  }

  private findTable(row?: number): Field | undefined {
    const allFields = this.getFields();

    const hasTableInRow = (field: Field) =>
      field.position[1] === row && field.isTable;
    const hasTableAndNoStudent = (field: Field) =>
      field.isTable && !field.student;

    const emptyTable =
      row !== undefined ? allFields.find(hasTableInRow) : undefined;

    return (
      emptyTable ??
      allFields.find(hasTableAndNoStudent) ??
      allFields.find((firstField) => !firstField.student)
    );
  }

  private storeData(data: StorageData) {
    const fullUrl = generateDataUrl(data);
    history.pushState(data, document.title, fullUrl);
  }

  private emitChange(
    id: string,
    updatedValue: Field | TrashedField[] | ModalConfig | string
  ): void {
    this.roomObservers.forEach((observer) => {
      if (observer.id === id) {
        observer.updateUi.forEach((update) => {
          if (update) {
            update(updatedValue);
          }
        });
      }
    });

    this.storeData({
      className: this.className,
      roomName: this.roomName,
      rows: this.rows,
      columns: this.columns,
      fields: this.getFields().filter(
        (field) => field.isTable || field.student
      ),
    });
  }

  private determineFirstAndLastRow(fieldsWithTable: FieldWithTable[]): {
    firstRow: number;
    lastRow: number;
    tablesFirstRow: FieldWithTable[];
    tablesLastRow: FieldWithTable[];
    remainingTables: FieldWithTable[];
  } {
    // firstRow has the smallest currentY of a table - i.e. the Y coordinate of the table "highest up" on the plan
    // lastRow has the largest currentY of a table - i.e. the Y coordinate of the table most "down below" on the plan
    const yCoordinates: number[] = fieldsWithTable.map(
      ({ position: [, y] }) => y
    );
    const firstRow = Math.max(...yCoordinates);
    const lastRow = Math.min(...yCoordinates);

    return {
      firstRow,
      lastRow,
      tablesFirstRow: fieldsWithTable.filter(
        ({ position: [, y] }) => y === firstRow
      ),
      tablesLastRow: fieldsWithTable.filter(
        ({ position: [, y] }) => y === lastRow
      ),
      remainingTables: fieldsWithTable.filter(
        ({ position: [, y] }) => y !== lastRow && y !== firstRow
      ),
    };
  }

  public async rearrangeStudentsByConstraints(mixed = false): Promise<void> {
    const students = this.getFields()
      .filter((field) => field.student)
      .map((field) => new Field({ ...field })) as FieldWithStudent[];

    const { studentsForFirstRow, studentsForLastRow, remainingStudents } =
      students.reduce<{
        studentsForFirstRow: FieldWithStudent[];
        studentsForLastRow: FieldWithStudent[];
        remainingStudents: FieldWithStudent[];
      }>(
        (acc, currentField) => {
          if (currentField.student?.row === "first") {
            acc.studentsForFirstRow.push(currentField);
          } else if (currentField.student?.row === "last") {
            acc.studentsForLastRow.push(currentField);
          } else {
            acc.remainingStudents.push(currentField);
          }

          return acc;
        },
        {
          studentsForFirstRow: [],
          studentsForLastRow: [],
          remainingStudents: [],
        }
      );

    const tables = this.getFields()
      .filter((field) => field.isTable)
      .map(
        (field) => new Field({ ...field, student: undefined })
      ) as FieldWithTable[];

    const { tablesFirstRow, tablesLastRow, remainingTables } =
      this.determineFirstAndLastRow(tables);

    // TODO:
    // Better check on every emit , or in react component
    // disable the button on either of these conditions
    // refactor into function
    if (tables.length < students.length) {
      console.warn("Too few tables for students. Aborting...");
      return;
    } else if (tablesFirstRow.length < studentsForFirstRow.length) {
      console.warn("Too few tables in first row for students. Aborting...");
      return;
    } else if (tablesLastRow.length < studentsForLastRow.length) {
      console.warn("Too few tables in last row for students. Aborting...");
      return;
    }

    const arrange = await import("./Arrange").then((module) => module.default);
    const firstAndLastRowWithStudents = [
      ...arrange(tablesFirstRow, studentsForFirstRow, mixed),
      ...arrange(tablesLastRow, studentsForLastRow, mixed),
    ];

    const allFields = [
      ...arrange(
        mixed
          ? [...firstAndLastRowWithStudents, ...remainingTables]
          : [...firstAndLastRowWithStudents, ...remainingTables].sort(() =>
              Math.random() > 0.5 ? 1 : -1
            ),
        remainingStudents,
        mixed
      ),
    ];

    this.room = this.generateRoom(this.rows, this.columns, allFields);
    this.updateClassroom();
    // Store the Updated Classroom in URL state query param
    this.storeData({
      className: this.className,
      roomName: this.roomName,
      rows: this.rows,
      columns: this.columns,
      fields: this.getFields().filter(
        (field) => field.isTable || field.student
      ),
    });
  }
}
