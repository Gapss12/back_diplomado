import sequelize from './database';
import {User} from '../models/user.model';
import {Product} from '../models/product.model';
import {Sale} from '../models/sale.model';
import { Employee } from '../models/employe.model';

const syncDatabase = async () => {
  try {

    await sequelize.authenticate();
    // Definir las relaciones entre los modelos

    Sale.belongsTo(Employee, { foreignKey: 'employeId' });
    Sale.belongsTo(Product, { foreignKey: 'productId' }); 
    
    Employee.hasMany(Sale, { foreignKey: 'userId' });
    Product.hasMany(Sale, { foreignKey: 'productId' });
    
    User.hasOne(Employee, { foreignKey: 'userId' });
    Employee.belongsTo(User, { foreignKey: 'userId' });
  
    console.log('Connection has been established successfully.');
    // Sincronizar los modelos en el orden correcto
    await User.sync({ force: false });
    await Product.sync({ force: false });
    await Employee.sync({ force: false });
    await Sale.sync({ force: false });


    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default syncDatabase;