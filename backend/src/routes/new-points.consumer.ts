import { Job } from 'bull';
import { RoutesDriverService } from './routes-driver/routes-driver.service';
import { Process, Processor } from '@nestjs/bull';
import { WEBSOCKET_NEW_POINTS } from 'src/utils/constants';

Processor(WEBSOCKET_NEW_POINTS);
export class NewPointsConsumer {
  constructor(private routesDriverService: RoutesDriverService) {}

  @Process()
  async handle(
    job: Job<{
      route_id: string;
      lat: number;
      lng: number;
    }>,
  ) {
    await this.routesDriverService.createOrUpdate(job.data);
    return {};
  }
}
