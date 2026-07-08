import sequelize from '../configuration/database.js';
import Producto from '../models/ProductModels.js';
import Categoria from '../models/CategoriesModels.js';
 
const testConnection = async () => {
  try {
    // 1. Probar que la conexion a MySQL funciona
    await sequelize.authenticate();
    console.log('✅ Conexion a la base de datos exitosa.');
 
    // 2. Probar que el modelo Producto mapea bien las columnas
    //    (si algun nombre de columna esta mal, esto lanza error aqui)
    const productos = await Producto.findAll({
      include: { model: Categoria, as: 'categoria' },
      limit: 5
    });
 
    console.log(`✅ Modelo Producto OK. Registros encontrados: ${productos.length}`);
    console.log(JSON.stringify(productos, null, 2));
 
    // 3. Probar el modelo Categoria de forma independiente
    const categorias = await Categoria.findAll({ limit: 5 });
    console.log(`✅ Modelo Categoria OK. Registros encontrados: ${categorias.length}`);
 
  } catch (error) {
    console.error('❌ Error al probar la conexion o los modelos:');
    console.error(error.message);
  } finally {
    await sequelize.close();
  }
};
 
testConnection();
 
