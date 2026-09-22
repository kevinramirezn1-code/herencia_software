import bcrypt from 'bcryptjs';
import sequelize from '../configuration/database.js';
import Rol from '../models/RolesModels.js';
import Usuario from '../models/UsuariosModels.js';
import Categoria from '../models/CategoriesModels.js';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');

    // 1. Asegurar roles básicos
    const rolesData = [
      { idrol: 1, nombre_rol: 'Administrador', descripcion: 'Rol con todos los privilegios' },
      { idrol: 2, nombre_rol: 'Vendedor', descripcion: 'Rol para ventas y atención al cliente' },
      { idrol: 3, nombre_rol: 'Cliente', descripcion: 'Rol para clientes del sistema' },
    ];

    for (const r of rolesData) {
      const existente = await Rol.findByPk(r.idrol);
      if (!existente) {
        await Rol.create(r);
        console.log(`✨ Rol creado: ${r.nombre_rol}`);
      }
    }

    // 2. Asegurar categorías iniciales si no existen
    const catCount = await Categoria.count();
    if (catCount === 0) {
      const categoriasDefault = [
        { nombre_categoria: 'Lácteos y Derivados', descripcion: 'Quesos, leches, mantequillas' },
        { nombre_categoria: 'Cárnicos', descripcion: 'Carnes de res, cerdo, embutidos' },
        { nombre_categoria: 'Abarrotes', descripcion: 'Granos, harinas, aceites' },
        { nombre_categoria: 'Bebidas', descripcion: 'Jugos, gaseosas, aguas' },
      ];
      for (const cat of categoriasDefault) {
        await Categoria.create(cat);
      }
      console.log('✨ Categorías por defecto creadas.');
    }

    // 3. Crear usuario Administrador inicial
    const adminEmail = 'admin@herenciadepapa.com';
    const adminPass = 'admin1234';
    const usuarioExistente = await Usuario.findOne({ where: { correo_usuario: adminEmail } });

    if (!usuarioExistente) {
      const hash = await bcrypt.hash(adminPass, 10);
      await Usuario.create({
        nombre_usuario: 'Administrador',
        apellido_usuario: 'Sistema',
        correo_usuario: adminEmail,
        contraseña_usuario: hash,
        telefono_usuario: '3001234567',
        fk_usuario_id_rol: 1
      });
      console.log(`\n🎉 Usuario Administrador creado con éxito:`);
      console.log(`   📧 Correo: ${adminEmail}`);
      console.log(`   🔑 Contraseña: ${adminPass}`);
    } else {
      console.log(`\nℹ️ El usuario administrador (${adminEmail}) ya existe.`);
    }

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await sequelize.close();
  }
};

seed();
