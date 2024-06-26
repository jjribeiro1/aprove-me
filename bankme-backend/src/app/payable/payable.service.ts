import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePayableDto, UpdatePayableDto } from './dto/payable.dto';
import { PayableRepository } from './payable.repository';
import { AssignorService } from 'src/app/assignor/assignor.service';

@Injectable()
export class PayableService {
  constructor(
    private readonly repository: PayableRepository,
    private readonly assignorService: AssignorService,
  ) {}

  async getPayableById(id: string) {
    return await this.payableExists(id);
  }

  async getAllPayable() {
    return this.repository.findAll()
  }

  async createPayable(dto: CreatePayableDto) {
    await this.assignorService.getAssignorById(dto.assignorId)
    const createdPayable = await this.repository.create(dto);
    return createdPayable;
  }

  async updatePayable(id: string, dto: UpdatePayableDto) {
    await this.assignorService.getAssignorById(dto.assignorId!)
    await this.payableExists(id);
    const updatedPayable = await this.repository.update(id, dto);
    return updatedPayable;
  }

  async deletePayable(id: string) {
    await this.payableExists(id);
    await this.repository.delete(id);
  }

  private async payableExists(id: string) {
    const payable = await this.repository.findById(id);
    if (!payable) {
      throw new NotFoundException(`Payable with ${id} not found`);
    }

    return payable;
  }
}
