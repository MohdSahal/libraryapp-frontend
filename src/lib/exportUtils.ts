import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDateLocal } from './dateUtils';

export const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Auto-size columns (rough implementation)
    const colWidths = Object.keys(data[0] || {}).map(key => {
        const maxLength = Math.max(
            key.length,
            ...data.map(row => String(row[key] || '').length)
        );
        return { wch: maxLength + 2 };
    });
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportToPDF = (headers: string[], data: any[][], title: string, fileName: string) => {
    const doc = new jsPDF();
    const generatedDate = formatDateLocal(new Date().toISOString());

    // Header
    doc.setFillColor(79, 70, 229); // Indigo #4f46e5
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Library Management System", 14, 18);

    doc.setFontSize(12);
    doc.text(`${title} Report`, 14, 25);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(`Generated on: ${generatedDate}`, 150, 25);

    // Table
    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 40,
        theme: 'striped',
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: [255, 255, 255],
            fontSize: 11,
            cellPadding: 4
        },
        bodyStyles: {
            fontSize: 10,
            cellPadding: 3
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },
        margin: { top: 40 },
        didDrawPage: (data: any) => {
            // Footer
            const str = `Page ${data.pageNumber}`;
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(str, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }
    });

    doc.save(`${fileName}.pdf`);
};
