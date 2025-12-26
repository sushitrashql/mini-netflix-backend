import { Injectable } from '@nestjs/common';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { ResponseHelper } from '../helpers/response.helper';
import { HTTP_STATUS } from '../constants/http-status.constant';
import { MESSAGES } from '../constants/messages.constant';

@Injectable()
export class ResponseService {
  success<T>(
    data: T,
    message: string = MESSAGES.GENERAL.SUCCESS,
  ): ServiceResponse<T> {
    return ResponseHelper.success(data, message, HTTP_STATUS.OK);
  }

  successCreated<T>(
    data: T,
    message: string = MESSAGES.GENERAL.CREATED,
  ): ServiceResponse<T> {
    return ResponseHelper.success(data, message, HTTP_STATUS.CREATED);
  }

  successUpdated<T>(
    data: T,
    message: string = MESSAGES.GENERAL.UPDATED,
  ): ServiceResponse<T> {
    return ResponseHelper.success(data, message, HTTP_STATUS.OK);
  }

  successDeleted<T>(
    data: T,
    message: string = MESSAGES.GENERAL.DELETED,
  ): ServiceResponse<T> {
    return ResponseHelper.success(data, message, HTTP_STATUS.OK);
  }

  successList<T>(
    data: T,
    message: string = MESSAGES.GENERAL.SUCCESS,
  ): ServiceResponse<T> {
    return ResponseHelper.success(data, message, HTTP_STATUS.OK);
  }

  successPaginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = MESSAGES.GENERAL.SUCCESS,
  ): ServiceResponse<T[]> {
    return ResponseHelper.paginated(data, total, page, limit, message);
  }
}