import { Controller, Get } from '@nestjs/common';
import { LookupsService } from './lookups.service';

@Controller('lookups')
export class LookupsController {
    constructor(private readonly lookupsService: LookupsService) { }

    @Get('roles')
    async getUserRoles() {
        return this.lookupsService.getUserRoles();
    }

    @Get('positions')
    async getUserPositions() {
        return this.lookupsService.getUserPositions();
    }

    @Get('leaveTypes')
    async getLeaveTypes() {
        return this.lookupsService.getLeaveTypes();
    }

    @Get('requestStatuses')
    async getRequestStatuses() {
        return this.lookupsService.getRequestStatuses();
    }
}
