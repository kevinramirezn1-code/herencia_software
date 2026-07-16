import PDFDocument from "pdfkit";

class PdfGenerator {

//aqui se genera toda la estructura del pdf
//se puede escalar separando modulos headers footers y bodys

    generarReporteInventario(res, reporte) {

        const doc = new PDFDocument({
            margins: { top: 40, bottom: 50, left: 40, right: 40 },
            size: "A4",
            bufferPages: true,
        });

        // Configurar la respuesta
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=reporte-inventario.pdf"
        );

        // Enviar el PDF al navegador
        doc.pipe(res);

        this._dibujarEncabezado(doc);
        this._dibujarResumen(doc, reporte.resumen);
        this._dibujarIndicadoresFinancieros(doc, reporte.resumen);
        this._dibujarDetalleInventario(doc, reporte.inventario);
        this._dibujarPiePagina(doc);

        doc.end();
    }

    // ==========================
    // ENCABEZADO
    // ==========================
    _dibujarEncabezado(doc) {
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const startX = doc.page.margins.left;
        const startY = doc.page.margins.top;
        const boxHeight = 90;

        doc.rect(startX, startY, pageWidth, boxHeight).stroke("#333333");

        doc
            .fillColor("#1a1a2e")
            .fontSize(15)
            .font("Helvetica-Bold")
            .text("HORIZON SOFTWARE S.A.S.", startX, startY + 12, {
                width: pageWidth,
                align: "center",
            });

        doc
            .fillColor("#1a1a2e")
            .fontSize(15)
            .font("Helvetica-Bold")
            .text("REPORTE GENERAL DE INVENTARIO", startX, startY + 34, {
                width: pageWidth,
                align: "center",
            });

        doc
            .fillColor("#555555")
            .fontSize(9)
            .font("Helvetica")
            .text(`Fecha: ${new Date().toLocaleDateString("es-CO")}`, startX + 15, startY + 68)
            .text(
                `Hora: ${new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })}`,
                startX,
                startY + 68,
                { width: pageWidth - 15, align: "right" }
            );

        doc.fillColor("#000000");
        doc.y = startY + boxHeight + 15;
    }

    // ==========================
    // RESUMEN (tarjetas)
    // ==========================
    _dibujarResumen(doc, resumen) {
        const startX = doc.page.margins.left;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        let y = doc.y;

        const titleHeight = 20;
        doc.rect(startX, y, pageWidth, titleHeight).fillAndStroke("#1a1a2e", "#1a1a2e");
        doc
            .fillColor("#ffffff")
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("RESUMEN DEL INVENTARIO", startX, y + 5, { width: pageWidth, align: "center" });

        y += titleHeight;

        const columnas = [
            { label: "Total\nProductos", value: resumen.totalProductos },
            { label: "Con Stock", value: resumen.productosConStock },
            { label: "Sin Stock", value: resumen.productosSinStock },
            { label: "Stock Bajo", value: resumen.productosConStockBajo },
            { label: "Próx. a\nVencer", value: resumen.productosProximosAVencer },
        ];

        const colWidth = pageWidth / columnas.length;
        const rowHeight = 42;

        columnas.forEach((col, i) => {
            const x = startX + i * colWidth;

            doc.rect(x, y, colWidth, rowHeight).stroke("#cccccc");

            doc
                .fillColor("#555555")
                .fontSize(8)
                .font("Helvetica")
                .text(col.label, x + 2, y + 7, { width: colWidth - 4, align: "center" });

            doc
                .fillColor("#1a1a2e")
                .fontSize(17)
                .font("Helvetica-Bold")
                .text(String(col.value), x + 2, y + 22, { width: colWidth - 4, align: "center" });
        });

        doc.fillColor("#000000");
        doc.y = y + rowHeight + 20;
    }

    // ==========================
    // INDICADORES FINANCIEROS
    // ==========================
    _dibujarIndicadoresFinancieros(doc, resumen) {
        const startX = doc.page.margins.left;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        let y = doc.y;

        doc
            .fillColor("#000000")
            .fontSize(12)
            .font("Helvetica-Bold")
            .text("Indicadores Financieros", startX, y);

        y += 20;

        const filas = [
            { label: "Costo total inventario", value: resumen.costoTotalInventario },
            { label: "Valor potencial ventas", value: resumen.valorPotencialVentas },
            { label: "Ganancia potencial", value: resumen.gananciaPotencial },
        ];

        filas.forEach((fila) => {
            const valorTexto = this._formatearMoneda(fila.value);

            doc.fontSize(10).font("Helvetica").fillColor("#333333");
            doc.text(fila.label, startX, y);

            const labelWidth = doc.widthOfString(fila.label);
            const valorWidth = doc.widthOfString(valorTexto);
            const puntosDisponibles = pageWidth - labelWidth - valorWidth - 10;
            const anchoPunto = doc.widthOfString(".");
            const numPuntos = Math.max(0, Math.floor(puntosDisponibles / anchoPunto));

            doc
                .fillColor("#999999")
                .text(".".repeat(numPuntos), startX + labelWidth + 3, y);

            doc
                .fillColor("#1a1a2e")
                .font("Helvetica-Bold")
                .text(valorTexto, startX, y, { width: pageWidth, align: "right" });

            y += 17;
        });

        y += 8;
        doc.moveTo(startX, y).lineTo(startX + pageWidth, y).lineWidth(1.5).stroke("#1a1a2e");

        doc.fillColor("#000000");
        doc.y = y + 20;
    }

    // ==========================
    // TABLA DE DETALLE
    // ==========================
    _dibujarDetalleInventario(doc, inventario) {
        const startX = doc.page.margins.left;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

        doc
            .fillColor("#000000")
            .fontSize(12)
            .font("Helvetica-Bold")
            .text("Detalle del Inventario", startX, doc.y);

        doc.y += 16;

        const columnas = [
            { key: "codigo_producto", label: "Código", width: 0.12 },
            { key: "nombre_producto", label: "Producto", width: 0.28 },
            { key: "stock", label: "Stock", width: 0.12 },
            { key: "costo_produccion", label: "Costo", width: 0.16 },
            { key: "precio_venta", label: "Venta", width: 0.16 },
            { key: "estado", label: "Estado", width: 0.16 },
        ];

        const colWidths = columnas.map((c) => Math.floor(c.width * pageWidth));
        const rowHeight = 20;
        const headerHeight = 22;

        const dibujarEncabezadoTabla = () => {
            let x = startX;
            const y = doc.y;

            doc.rect(startX, y, pageWidth, headerHeight).fillAndStroke("#1a1a2e", "#1a1a2e");

            doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
            columnas.forEach((col, i) => {
                doc.text(col.label, x + 4, y + 7, { width: colWidths[i] - 8, align: "left" });
                x += colWidths[i];
            });

            doc.y = y + headerHeight;
        };

        dibujarEncabezadoTabla();
        doc.font("Helvetica").fontSize(9);

        inventario.forEach((producto, idx) => {
            // Salto de página si no cabe la fila
            if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom - 40) {
                doc.addPage();
                doc.y = doc.page.margins.top;
                dibujarEncabezadoTabla();
                doc.font("Helvetica").fontSize(9);
            }

            const y = doc.y;
            let x = startX;

            if (idx % 2 === 0) {
                doc.rect(startX, y, pageWidth, rowHeight).fill("#f4f4f7");
            }

            const colorEstado = this._colorPorEstado(producto.estado);

            const valores = [
                producto.codigo_producto,
                producto.nombre_producto,
                String(producto.stock),
                this._formatearMoneda(producto.costo_produccion, false),
                this._formatearMoneda(producto.precio_venta, false),
                producto.estado,
            ];

            valores.forEach((valor, i) => {
                doc.fillColor(i === 5 ? colorEstado : "#000000");
                doc.text(valor, x + 4, y + 6, {
                    width: colWidths[i] - 8,
                    align: i === 2 || i === 3 || i === 4 ? "right" : "left",
                    ellipsis: true,
                });
                x += colWidths[i];
            });

            doc.rect(startX, y, pageWidth, rowHeight).stroke("#dddddd");
            doc.y = y + rowHeight;
        });

        doc.fillColor("#000000");
    }

    // ==========================
    // PIE DE PÁGINA
    // ==========================
    _dibujarPiePagina(doc) {
        const range = doc.bufferedPageRange();

        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);

            const startX = doc.page.margins.left;
            const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
            const y = doc.page.height - doc.page.margins.bottom + 15;

            doc
                .fontSize(8)
                .font("Helvetica")
                .fillColor("#666666")
                .text(`Página ${i + 1} de ${range.count}`, startX, y, { width: pageWidth / 2, align: "left" })
                .text("Horizon Software S.A.S.", startX, y, {
                    width: pageWidth,
                    align: "right",
                });
        }
    }

    // ==========================
    // HELPERS
    // ==========================
    _formatearMoneda(valor, conSimbolo = true) {
        const numero = Number(valor) || 0;
        const texto = numero.toLocaleString("es-CO", { maximumFractionDigits: 0 });
        return conSimbolo ? `$${texto}` : texto;
    }

    _colorPorEstado(estado) {
        switch (estado) {
            case "Agotado":
            case "Sin stock":
                return "#c0392b";
            case "Stock Bajo":
                return "#d68910";
            default:
                return "#1e8449";
        }
    }

}

export default new PdfGenerator();