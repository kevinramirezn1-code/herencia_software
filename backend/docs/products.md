# HU-INV-001 Registrar Producto

## Endpoint

POST /api/products

## Descripción

Registrar un nuevo producto.

---

## Request

```json
{
    "codigoProducto": "P001",
    "nombreProducto": "Arroz Diana",
    "stock": 100,
    "costoProduccion": 2500,
    "precioVenta": 3500,
    "iva": 19,
    "fechaProduccion": "2026-07-10",
    "fechaVencimiento": "2027-07-10",
    "categoriaId": 1
}
# Response 201
{
    "success": true,
    "message": "Producto registrado correctamente.",
    "data": {
        "idProducto": 1,
        "codigoProducto": "P001",
        "nombreProducto": "Arroz Diana"
    }
response 400
{
    "success": false,
    "message": "Datos inválidos.",
    "errors": [
        {
            "field": "nombreProducto",
            "message": "El nombre es obligatorio."
        }
    ]
}
}
