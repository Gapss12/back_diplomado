import { Employee, EmployeeAttributes } from '../models/employe.model';
import { User } from '../models/user.model';
export class EmployeeService {
  
  async createEmployee(data: EmployeeAttributes): Promise<Employee> {
    return await Employee.create(data);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await Employee.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'email']
        }
      ]
    });
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    return await Employee.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'email']
        }
      ]
    });
  }


  async updateEmployee(id: number, data: Partial<EmployeeAttributes>): Promise<Employee | null> {
    const employee = await Employee.findByPk(id);
    if (!employee) return null;
    return await employee.update(data);
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const deleted = await Employee.destroy({
      where: { id }
    });
    return deleted > 0;
  }
}