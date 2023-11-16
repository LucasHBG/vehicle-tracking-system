import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import {
  WEBSOCKET_ADMIN_NEW_POINTS,
  WEBSOCKET_NEW_POINTS,
} from 'src/utils/constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoutesGateway {
  constructor(
    @InjectQueue(WEBSOCKET_NEW_POINTS) private newPointsQueue: Queue,
  ) {}

  @SubscribeMessage(WEBSOCKET_NEW_POINTS)
  async handleMessage(
    client: Socket,
    payload: {
      route_id: string;
      lat: number;
      lng: number;
    },
  ) {
    client.broadcast.emit(WEBSOCKET_ADMIN_NEW_POINTS, payload);
    client.broadcast.emit(
      `${WEBSOCKET_NEW_POINTS}/${payload.route_id}`,
      payload,
    );
    await this.newPointsQueue.add(payload);
  }
}
