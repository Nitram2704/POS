import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReceipt = (order) => {
    // Default to thermal receipt for now as requested
    generateThermalReceipt(order);
};

export const generateThermalReceipt = (order) => {
    // 80mm width is approx 226 points (1mm = 2.83pt)
    // We use a long height to simulate a roll, autoTable will handle the rest
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // 80mm width, 200mm initial height (can be variable but fixed is easier for now)
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    // Header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('Mi POS Premium', centerX, 10, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text('Calle Falsa 123, Ciudad', centerX, 15, { align: 'center' });
    doc.text('Tel: 555-1234', centerX, 19, { align: 'center' });
    doc.text('--------------------------------', centerX, 23, { align: 'center' });

    // Order Info
    doc.setFontSize(9);
    doc.text(`Orden: #${order.id}`, 5, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 5, 35);

    if (order.billing) {
        doc.text(`Cliente: ${order.billing.first_name} ${order.billing.last_name}`, 5, 40);
    }

    doc.text('--------------------------------', centerX, 45, { align: 'center' });

    // Items
    let yPos = 50;
    doc.setFontSize(8);

    // Simple manual table for thermal receipt to control width better
    doc.text("Cant  Prod", 5, yPos);
    doc.text("Total", 75, yPos, { align: 'right' });
    yPos += 5;

    order.line_items.forEach(item => {
        const name = item.name || `Prod ${item.product_id}`;
        const quantity = item.quantity;
        const total = (item.price * quantity).toFixed(2);

        // Truncate name if too long
        const truncatedName = name.length > 20 ? name.substring(0, 20) + '...' : name;

        doc.text(`${quantity} x ${truncatedName}`, 5, yPos);
        doc.text(`$${total}`, 75, yPos, { align: 'right' });
        yPos += 5;
    });

    doc.text('--------------------------------', centerX, yPos + 2, { align: 'center' });
    yPos += 7;

    // Totals
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${order.total}`, 75, yPos, { align: 'right' });

    yPos += 10;

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text('¡Gracias por su compra!', centerX, yPos, { align: 'center' });
    doc.text('Conserve este ticket', centerX, yPos + 4, { align: 'center' });

    // Auto-print script (works in some PDF viewers)
    doc.autoPrint();

    doc.save(`ticket_${order.id}.pdf`);
};

