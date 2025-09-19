import { Request, Response } from 'express';
import { EmployeeService } from '../services/employe.service';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  public createEmployee = async (req: Request, res: Response) => {
    try {
      const employee = await this.employeeService.createEmployee(req.body);
      res.status(201).json({
        message: 'Employee created successfully',
        employee
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error creating employee'
      });
    }
  };

  public getAllEmployees = async (_req: Request, res: Response) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
       res.status(200).json(employees);
    } catch (error) {
       res.status(500).json({
        message: error instanceof Error ? error.message : 'Error retrieving employees'
      });
    }
  };

  public getEmployeeById = async (req: Request, res: Response) => {
    try {
      const employee = await this.employeeService.getEmployeeById(parseInt(req.params.id));
      if (!employee) {
         res.status(404).json({ message: 'Employee not found' });
      }
       res.status(200).json(employee);
    } catch (error) {
       res.status(500).json({
        message: error instanceof Error ? error.message : 'Error retrieving employee'
      });
    }
  };

  public updateEmployee = async (req: Request, res: Response)=> {
    try {
      const employee = await this.employeeService.updateEmployee(parseInt(req.params.id), req.body);
      if (!employee) {
         res.status(404).json({ message: 'Employee not found' });
      }
       res.status(200).json({
        message: 'Employee updated successfully',
        employee
      });
    } catch (error) {
       res.status(400).json({
        message: error instanceof Error ? error.message : 'Error updating employee'
      });
    }
  };

  public deleteEmployee = async (req: Request, res: Response) => {
    try {
      const deleted = await this.employeeService.deleteEmployee(parseInt(req.params.id));
      if (!deleted) {
         res.status(404).json({ message: 'Employee not found' });
      }
       res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
       res.status(500).json({
        message: error instanceof Error ? error.message : 'Error deleting employee'
      });
    }
  };
}