import { jsPDF } from "jspdf";
import { controller } from "../App";

export function generatePdf() {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm" });
  const today = new Date();
  const currentDate = `${today.getDate().toString().padStart(2, "0")}.${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${today.getFullYear()}`;

  const rows = controller.getDimension("rows");
  const columns = controller.getDimension("cols");
  const className = controller.getClassName();
  const roomName = controller.getRoomName();
  const fields = controller.getFields();

  const tableWidth = 280 / columns;
  const tableHeight = 200 / rows;

  // First row with Headline, room and class name and Date
  doc.text("Dein Sitzplan", 10, 10);
  doc.text(`Raum ${roomName}`, 120, 10);
  doc.text(`Klasse ${className}`, 160, 10);
  doc.text(currentDate, 260, 10);

  fields.forEach(({ position: [x, y], isTable, student }) => {
    const currentX = tableWidth * x + 10;
    const currentY = tableHeight * y + 13;
    if (isTable) {
      doc.rect(currentX, currentY, tableWidth, tableHeight);
    }

    if (student) {
      doc.text(`${student.name}`, currentX + 1, currentY + 6, {
        maxWidth: tableWidth - 3,
      });
    }
  });
  doc.save(
    `Sitzplan-${className}-${roomName}-${currentDate.replaceAll(".", "-")}.pdf`
  );
}
