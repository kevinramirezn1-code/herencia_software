import sequelize from '../configuration/database.js';
import '../models/associations-ingreso.js';
import Categoria from '../models/CategoriesModels.js';
import Producto from '../models/ProductModels.js';
import Proveedor from '../models/ProovedorModel.js';
import Cliente from '../models/clienteModel.js';
import Venta from '../models/VentaModel.js';
import DetVenta from '../models/DetVentaModel.js';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado para sembrar datos iniciales.');

    // 1. Cliente
    const clienteExistente = await Cliente.findByPk(1);
    if (!clienteExistente) {
      await Cliente.create({
        id_cliente: 1,
        identificacion: 123456789,
        nombre_cliente: 'Consumidor',
        apellido_cliente: 'Final',
        telefono_cliente: '3000000000',
        correo_cliente: 'cliente@herenciadepapa.com',
        direccion_cliente: 'Cali, Colombia',
        ciudad_cliente: 'Cali'
      });
      console.log('✨ Cliente por defecto creado.');
    }

    // 2. Proveedores
    const countProv = await Proveedor.count();
    if (countProv === 0) {
      await Proveedor.create({
        nit: 900123456,
        razon_social: 'Lácteos del Valle S.A.S.',
        telefono_proveedor: '3124567890',
        direccion: 'Calle 15 # 4-50',
        ciudad: 'Cali'
      });
      await Proveedor.create({
        nit: 900987654,
        razon_social: 'Distribuidora Agrícola Andina',
        telefono_proveedor: '3157891234',
        direccion: 'Carrera 8 # 20-30',
        ciudad: 'Palmira'
      });
      console.log('✨ Proveedores iniciales creados.');
    }

    // 3. Productos
    const countProd = await Producto.count();
    if (countProd === 0) {
      await Producto.bulkCreate([
        {
          codigo_producto: 1001,
          nombre_producto: 'Queso Campesino Tradicional 500g',
          fk_producto_id_categoria: 1,
          costo_produccion: 7500,
          precio_venta: 13500,
          stock: 45,
          iva: 19,
          fecha_produccion: '2026-08-01',
          fecha_vencimiento: '2026-10-15'
        },
        {
          codigo_producto: 1002,
          nombre_producto: 'Mantequilla Artesanal 250g',
          fk_producto_id_categoria: 1,
          costo_produccion: 4200,
          precio_venta: 8000,
          stock: 30,
          iva: 19,
          fecha_produccion: '2026-08-05',
          fecha_vencimiento: '2026-11-20'
        },
        {
          codigo_producto: 1003,
          nombre_producto: 'Chorizo Santarrosano x6',
          fk_producto_id_categoria: 2,
          costo_produccion: 12000,
          precio_venta: 21000,
          stock: 4, // Stock bajo
          iva: 19,
          fecha_produccion: '2026-08-10',
          fecha_vencimiento: '2026-09-30'
        },
        {
          codigo_producto: 1004,
          nombre_producto: 'Arequipe Casero 500g',
          fk_producto_id_categoria: 1,
          costo_produccion: 5000,
          precio_venta: 9500,
          stock: 0, // Agotado
          iva: 19,
          fecha_produccion: '2026-07-01',
          fecha_vencimiento: '2026-09-25'
        },
      ]);
      console.log('✨ Productos iniciales de catálogo creados.');
    }

    console.log('\n✅ Siembra de datos iniciales completada.');
  } catch (error) {
    console.error('❌ Error sembrando datos:', error);
  } finally {
    await sequelize.close();
  }
};

seed();
