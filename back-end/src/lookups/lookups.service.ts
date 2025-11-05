import { Inject, Injectable } from '@nestjs/common';
import { LeaveType } from 'src/lookups/entities/leaveType.entity';
import { RequestStatus } from 'src/lookups/entities/requestStatus.entity';
import { UserPosition } from 'src/lookups/entities/userPosition.entity';
import { UserRole } from 'src/lookups/entities/userRole.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LookupsService {
    constructor(
        @Inject('USER_ROLE_REPOSITORY')
        private readonly userRoleRepository: Repository<UserRole>,

        @Inject('USER_POSITION_REPOSITORY')
        private readonly userPositionRepository: Repository<UserPosition>,

        @Inject('LEAVE_TYPE_REPOSITORY')
        private readonly leaveTypeRepository: Repository<LeaveType>,

        @Inject('REQUEST_STATUS_REPOSITORY')
        private readonly requestStatusRepository: Repository<RequestStatus>,
    ) { }

    async getUserRoles() {
        return this.userRoleRepository.find();
    }

    async getUserPositions() {
        return this.userPositionRepository.find();
    }

    async getLeaveTypes() {
        return this.leaveTypeRepository.find();
    }

    async getRequestStatuses() {
        return this.requestStatusRepository.find();
    }

    async getAllLookups() {
        const userRoles = await this.userRoleRepository.find();
        const userPositions = await this.userPositionRepository.find();
        const leaveTypes = await this.leaveTypeRepository.find();
        const requestStatuses = await this.requestStatusRepository.find();

        return {
            userRoles,
            userPositions,
            leaveTypes,
            requestStatuses,
        };
    }
}
