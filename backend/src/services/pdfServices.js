import PDFDocument from "pdfkit";

const doc = new PDFDocument();

doc.fontSize(22)
   .text("REPORTE DE INVENTARIO");

doc.moveDown();

doc.text(`Total productos: ${reporte.resumen.totalProductos}`);
doc.text(`Productos con stock: ${reporte.resumen.productosConStock}`);
doc.text(`Productos agotados: ${reporte.resumen.productosSinStock}`);

doc.moveDown();

doc.text("Inventario");

doc.moveDown();

reporte.inventario.forEach(producto => {

    doc.text(
        `${producto.nombre_producto} | Stock: ${producto.stock} | Costo: ${producto.costo_produccion}`
    );

});

doc.end();