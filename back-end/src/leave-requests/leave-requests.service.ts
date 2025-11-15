import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LeaveRequest } from './leaveRequest.entity';
import { LookupsService } from 'src/lookups/lookups.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LeaveRequestService {
    constructor(
        @Inject('LEAVE_REQUEST_REPOSITORY')
        private leaveRequestRepo: Repository<LeaveRequest>,
        private userService: UsersService,
        private lookupService: LookupsService
    ) {}

    // ✅ 1. Kreiranje novog zahteva
    async createLeaveRequest(dto: {
        userId: number;
        leaveTypeId: number;
        startDate: Date;
        endDate: Date;
        note?: string;
    }) {
        const user = await this.userService.findOne(dto.userId );
        const leaveType = await this.lookupService.getLeaveTypeById(dto.leaveTypeId );
        const pendingStatus = await this.lookupService.getRequestStatusById(1); //treba ti pending status

        if (!user || !leaveType || !pendingStatus) {
            throw new NotFoundException('Invalid user, leave type, or status');
        }

        const newRequest = this.leaveRequestRepo.create({
            user,
            leaveType,
            startDate: dto.startDate,
            endDate: dto.endDate,
            note: dto.note ?? null,
            requestStatus: pendingStatus,
            requestDate: new Date(),
            approver: null,
        });

        return await this.leaveRequestRepo.save(newRequest);
    }

    // ✅ 2. Dohvatanje svih zahteva (admin)
    async getAllRequests() {
        return this.leaveRequestRepo
            .createQueryBuilder('request')
            .leftJoinAndSelect('request.user', 'user')
            .leftJoinAndSelect('request.leaveType', 'leaveType')
            .leftJoinAndSelect('request.requestStatus', 'requestStatus')
            .leftJoinAndSelect('request.approver', 'approver')
            .orderBy('request.requestDate', 'DESC')
            .getMany();
    }

    // ✅ 3. Dohvatanje zahteva za konkretnog korisnika
    async getRequestsByUser(userId: number) {
        return this.leaveRequestRepo
            .createQueryBuilder('lr')
            .leftJoinAndSelect('lr.leaveType', 'leaveType')
            .leftJoinAndSelect('lr.requestStatus', 'requestStatus')
            .leftJoinAndSelect('lr.approver', 'approver')
            .where('lr.userId = :userId', { userId })
            .orderBy('lr.startDate', 'DESC')
            .getMany();
    }

    async getApprovedLeavesForUserInPeriod(userId: number, startDate: string, endDate: string): Promise<LeaveRequest[]> {
        return this.leaveRequestRepo
            .createQueryBuilder('leave')
            .leftJoinAndSelect('leave.user', 'user')
            .leftJoinAndSelect('leave.leaveType', 'leaveType')
            .leftJoinAndSelect('leave.requestStatus', 'requestStatus')
            .where('user.userId = :userId', { userId })
            .andWhere('requestStatus.requestStatusName = :status', { status: 'Approved' })
            .andWhere('leave.startDate <= :endDate', { endDate })
            .andWhere('leave.endDate >= :startDate', { startDate })
            .getMany();
    }

    // ✅ 4. Odobravanje ili odbijanje zahteva (admin)
    async updateRequestStatus(
        requestId: number,
        approverId: number,
        newStatusId: number, // 2 = Approved, 3 = Rejected
    ) {
        const request = await this.leaveRequestRepo.findOne({
        where: { requestId },
        relations: ['user', 'leaveType', 'requestStatus', 'approver'],
        });

        if (!request) throw new NotFoundException('Request not found');

        const approver = await this.userService.findOne(approverId );
        const newStatus = await this.lookupService.getRequestStatusById( newStatusId );

        if (!approver || !newStatus) {
        throw new NotFoundException('Invalid approver or status');
        }

        request.requestStatus = newStatus;
        request.approver = approver;

        return await this.leaveRequestRepo.save(request);
    }

    // ✅ 5. Brisanje zahteva (ako treba — npr. ako je pending i korisnik odustane)
    async deleteRequest(requestId: number, userId: number) {
        const request = await this.leaveRequestRepo
            .createQueryBuilder('lr')
            .leftJoinAndSelect('lr.requestStatus', 'requestStatus')
            .where('lr.requestId = :requestId', { requestId })
            .andWhere('lr.userId = :userId', { userId })
            .getOne();

        if (!request) throw new NotFoundException('Request not found');
        if (request.requestStatus.requestStatusId !== 1) {
            throw new Error('Only pending requests can be deleted');
        }

        return await this.leaveRequestRepo.remove(request);
    }
}