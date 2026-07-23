import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajusta esta ruta según dónde guardes el logo en tu proyecto
const LOGO_PATH = path.join(__dirname, "../utils/logo-herencia-papa.png");
const NOMBRE_EMPRESA = "HERENCIA DE PAPÁ";
const SLOGAN_EMPRESA = "Sabores del Valle";

class PdfGenerator {

    // ==========================================================
    // REPORTE DE INVENTARIO
    // ==========================================================
    generarReporteInventario(res, reporte) {
        const doc = new PDFDocument({
            margins: { top: 40, bottom: 50, left: 40, right: 40 },
            size: "A4",
            bufferPages: true,
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-inventario.pdf");
        doc.pipe(res);

        this._dibujarEncabezado(doc, "REPORTE GENERAL DE INVENTARIO");
        this._dibujarResumen(doc, reporte.resumen);
        this._dibujarIndicadoresFinancieros(doc, reporte.resumen);
        this._dibujarDetalleInventario(doc, reporte.inventario);
        this._dibujarPiePagina(doc);

        doc.end();
    }

    // ==========================================================
    // FACTURA DE VENTA
    // ==========================================================
    generarFacturaVenta(res, venta, detalles) {
        const doc = new PDFDocument({
            margins: { top: 40, bottom: 50, left: 40, right: 40 },
            size: "A4",
            bufferPages: true,
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=factura-${venta.numero_venta}.pdf`
        );
        doc.pipe(res);

        this._dibujarEncabezado(doc, "FACTURA DE VENTA", `N° ${venta.numero_venta}`);
        this._dibujarDatosVenta(doc, venta);
        this._dibujarDetalleFactura(doc, detalles);
        this._dibujarTotalesFactura(doc, venta);
        this._dibujarPiePagina(doc);

        doc.end();
    }

    // ==========================
    // ENCABEZADO (con logo + branding)
    // ==========================
    _dibujarEncabezado(doc, titulo, subtitulo = null) {
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const startX = doc.page.margins.left;
        const startY = doc.page.margins.top;
        const boxHeight = 100;

        doc.rect(startX, startY, pageWidth, boxHeight).stroke("#7a1f3d");

        // Logo a la izquierda
        const logoWidth = 55;
        const logoHeight = 55;
        try {
            doc.image(LOGO_PATH, startX + 12, startY + 10, {
                width: logoWidth,
                height: logoHeight,
            });
        } catch (err) {
            // Si el logo no carga, el PDF sigue generándose sin romperse
            console.error("No se pudo cargar el logo:", err.message);
        }

        const textStartX = startX + logoWidth + 25;
        const textWidth = pageWidth - logoWidth - 35;

        doc
            .fillColor("#7a1f3d")
            .fontSize(16)
            .font("Helvetica-Bold")
            .text(NOMBRE_EMPRESA, textStartX, startY + 14, {
                width: textWidth,
                align: "center",
            });

        doc
            .fillColor("#999999")
            .fontSize(9)
            .font("Helvetica-Oblique")
            .text(SLOGAN_EMPRESA, textStartX, startY + 33, {
                width: textWidth,
                align: "center",
            });

        doc
            .fillColor("#1a1a2e")
            .fontSize(12)
            .font("Helvetica-Bold")
            .text(titulo, textStartX, startY + 50, {
                width: textWidth,
                align: "center",
            });

        if (subtitulo) {
            doc
                .fillColor("#555555")
                .fontSize(10)
                .font("Helvetica-Bold")
                .text(subtitulo, textStartX, startY + 66, {
                    width: textWidth,
                    align: "center",
                });
        }

        doc
            .fillColor("#555555")
            .fontSize(8)
            .font("Helvetica")
            .text(`Fecha: ${new Date().toLocaleDateString("es-CO")}`, startX + 15, startY + 84)
            .text(
                `Hora: ${new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })}`,
                startX,
                startY + 84,
                { width: pageWidth - 15, align: "right" }
            );

        doc.fillColor("#000000");
        doc.y = startY + boxHeight + 15;
    }

    // ==========================
    // RESUMEN (inventario, sin cambios)
    // ==========================
    _dibujarResumen(doc, resumen) {
        const startX = doc.page.margins.left;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        let y = doc.y;

        const titleHeight = 20;
        doc.rect(startX, y, pageWidth, titleHeight).fillAndStroke("#7a1f3d", "#7a1f3d");
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
                .fillColor("#7a1f3d")
                .fontSize(17)
                .font("Helvetica-Bold")
                .text(String(col.value), x + 2, y + 22, { width: colWidth - 4, align: "center" });
        });

        doc.fillColor("#000000");
        doc.y = y + rowHeight + 20;
    }

    // ==========================
    // INDICADORES FINANCIEROS (inventario, sin cambios)
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
                .fillColor("#7a1f3d")
                .font("Helvetica-Bold")
                .text(valorTexto, startX, y, { width: pageWidth, align: "right" });

            y += 17;
        });

        y += 8;
        doc.moveTo(startX, y).lineTo(startX + pageWidth, y).lineWidth(1.5).stroke("#7a1f3d");

        doc.fillColor("#000000");
        doc.y = y + 20;
    }

    // ==========================
    // TABLA DE DETALLE (inventario, sin cambios)
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

            doc.rect(startX, y, pageWidth, headerHeight).fillAndStroke("#7a1f3d", "#7a1f3d");

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
    // DATOS DE LA VENTA
    // ==========================
    _dibujarDatosVenta(doc, venta) {
    const startX = doc.page.margins.left;
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    let y = doc.y;

    const boxHeight = 60;
    doc.rect(startX, y, pageWidth, boxHeight).stroke("#cccccc");

    const fechaFormateada = new Date(venta.fecha).toLocaleDateString("es-CO");

    const nombreCliente = venta.cliente
        ? `${venta.cliente.nombre_cliente} ${venta.cliente.apellido_cliente || ""}`.trim()
        : "Cliente no registrado";

    const nombreVendedor = venta.usuario
        ? `${venta.usuario.nombre_usuario} ${venta.usuario.apellido_usuario || ""}`.trim()
        : "Vendedor no registrado";

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#7a1f3d");
    doc.text("Cliente:", startX + 10, y + 10);
    doc.text("Vendedor:", startX + 10, y + 28);
    doc.text("Fecha de venta:", startX + 10, y + 46);

    doc.font("Helvetica").fillColor("#333333");
    doc.text(nombreCliente, startX + 100, y + 10);
    doc.text(nombreVendedor, startX + 100, y + 28);
    doc.text(fechaFormateada, startX + 100, y + 46);

    doc.fillColor("#000000");
    doc.y = y + boxHeight + 20;
    }

    // ==========================
    // TABLA DE PRODUCTOS (factura)
    // ==========================
    _dibujarDetalleFactura(doc, detalles) {
        const startX = doc.page.margins.left;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

        doc
            .fillColor("#000000")
            .fontSize(12)
            .font("Helvetica-Bold")
            .text("Detalle de Productos", startX, doc.y);

        doc.y += 16;

        const columnas = [
            { label: "Producto", width: 0.34 },
            { label: "Cant.", width: 0.10 },
            { label: "Precio unit.", width: 0.18 },
            { label: "IVA %", width: 0.12 },
            { label: "Subtotal", width: 0.13 },
            { label: "Total", width: 0.13 },
        ];

        const colWidths = columnas.map((c) => Math.floor(c.width * pageWidth));
        const rowHeight = 20;
        const headerHeight = 22;

        const dibujarEncabezadoTabla = () => {
            let x = startX;
            const y = doc.y;

            doc.rect(startX, y, pageWidth, headerHeight).fillAndStroke("#7a1f3d", "#7a1f3d");

            doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
            columnas.forEach((col, i) => {
                doc.text(col.label, x + 4, y + 7, { width: colWidths[i] - 8, align: "left" });
                x += colWidths[i];
            });

            doc.y = y + headerHeight;
        };

        dibujarEncabezadoTabla();
        doc.font("Helvetica").fontSize(9);

        detalles.forEach((item, idx) => {
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

            const nombreProducto = item.producto?.nombre_producto || `Producto #${item.fk_det_venta_id_producto}`;

            const valores = [
                nombreProducto,
                String(item.cantidad),
                this._formatearMoneda(item.precio_venta, false),
                `${Number(item.iva_producto).toFixed(2)}%`,
                this._formatearMoneda(item.subtotal, false),
                this._formatearMoneda(item.total, false),
            ];

            doc.fillColor("#000000");
            valores.forEach((valor, i) => {
                doc.text(valor, x + 4, y + 6, {
                    width: colWidths[i] - 8,
                    align: i === 0 ? "left" : "right",
                    ellipsis: true,
                });
                x += colWidths[i];
            });

            doc.rect(startX, y, pageWidth, rowHeight).stroke("#dddddd");
            doc.y = y + rowHeight;
        });

        doc.fillColor("#000000");
        doc.y += 15;
    }

    // ==========================
    // TOTALES DE LA FACTURA
    // ==========================
    _dibujarTotalesFactura(doc, venta) {
        const startX = doc.page.margins.left;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        let y = doc.y;

        const filas = [
            { label: "Subtotal", value: venta.subtotal },
            { label: "IVA", value: venta.iva },
            { label: "Descuento", value: venta.descuento || 0 },
        ];

        filas.forEach((fila) => {
            const valorTexto = this._formatearMoneda(fila.value);

            doc.fontSize(10).font("Helvetica").fillColor("#333333");
            doc.text(fila.label, startX, y, { width: pageWidth * 0.7, align: "right" });

            doc
                .fillColor("#7a1f3d")
                .font("Helvetica-Bold")
                .text(valorTexto, startX, y, { width: pageWidth, align: "right" });

            y += 17;
        });

        y += 5;
        doc.moveTo(startX, y).lineTo(startX + pageWidth, y).lineWidth(1.5).stroke("#7a1f3d");
        y += 10;

        doc.fontSize(13).font("Helvetica-Bold").fillColor("#7a1f3d");
        doc.text("TOTAL A PAGAR", startX, y, { width: pageWidth * 0.7, align: "right" });
        doc.text(this._formatearMoneda(venta.total), startX, y, { width: pageWidth, align: "right" });

        doc.fillColor("#000000");
        doc.y = y + 30;
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
                .text(`${NOMBRE_EMPRESA} - ${SLOGAN_EMPRESA}`, startX, y, {
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